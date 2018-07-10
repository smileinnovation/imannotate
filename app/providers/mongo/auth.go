package mongo

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/smileinnovation/imannotate/api/user"
	"golang.org/x/crypto/bcrypt"
	jwt "gopkg.in/dgrijalva/jwt-go.v3"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var SigningKey = []byte("AllYourBase")

func init() {
	pass, _ := bcrypt.GenerateFromPassword([]byte("toto123"), bcrypt.DefaultCost)
	db := getMongo()
	if err := db.C("user").Find(bson.M{"username": "Bob"}); err != nil {
		db.C("user").Upsert(bson.M{"username": "Bob"}, &user.User{
			Username: "Bob",
			Password: string(pass),
		})
	}
}

type MongoAuth struct{}
type CustomClaim struct {
	ID string
	jwt.StandardClaims
}

func (ma *MongoAuth) Login(u *user.User) error {
	db := getMongo()

	r := bson.M{"username": u.Username}
	real := &user.User{}
	if err := db.C("user").Find(r).One(real); err != nil {
		return errors.New("User from database isn't found or incorrect, " + err.Error())
	}

	// Password should be encrypted with bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(real.Password), []byte(u.Password)); err != nil {
		return err
	}

	claims := CustomClaim{
		u.Username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(time.Hour * 24)).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	if ss, err := token.SignedString(SigningKey); err != nil {
		return err
	} else {
		u.Token = "Bearer " + ss
	}

	return nil
}
func (ma *MongoAuth) Logout(u *user.User) error {
	return nil
}
func (ma *MongoAuth) Allowed(req *http.Request) error {

	bearer := req.Header.Get("Authorization")
	bearer = strings.Replace(bearer, "Bearer ", "", 1)

	_, err := jwt.Parse(bearer, func(token *jwt.Token) (interface{}, error) {
		return SigningKey, nil
	})
	log.Println(err)
	return err
}

func (ma *MongoAuth) GetCurrentUsername(req *http.Request) (string, error) {
	bearer := req.Header.Get("Authorization")
	bearer = strings.Replace(bearer, "Bearer ", "", 1)
	token, err := jwt.ParseWithClaims(bearer, &CustomClaim{}, func(token *jwt.Token) (interface{}, error) {
		return SigningKey, nil
	})
	if err != nil {
		return "", err
	}
	claim := token.Claims.(*CustomClaim)
	return claim.ID, nil
}

var sess *mgo.Session

func getMongo() *mgo.Database {
	// db := os.Getenv("DB_HOST")
	// dbu := os.Getenv("DB_USER")
	// dbp := os.Getenv("DB_PASS")
	dbn := os.Getenv("DB_NAME")

	if sess == nil {
		var err error
		// c := fmt.Sprintf("mongo://%s:%s@%s:27017", dbu, dbp, db)
		c := "database"
		log.Println(c)
		sess, err = mgo.Dial(c)
		if err != nil {
			log.Fatal("DB connection error:", err)
		}
	}

	return sess.Clone().DB(dbn)
}
