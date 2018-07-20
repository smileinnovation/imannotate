package mongo

import (
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/user"
	"golang.org/x/crypto/bcrypt"
	jwt "gopkg.in/dgrijalva/jwt-go.v3"
)

var SigningKey = []byte("AllYourBase")

func init() {
	db := getMongo()
	defer db.Session.Close()

	idx := mgo.Index{
		Key:      []string{"username"},
		Unique:   true,
		DropDups: true,
	}
	db.C("user").EnsureIndex(idx)
}

type MongoAuth struct{}
type CustomClaim struct {
	ID       string
	Username string
	jwt.StandardClaims
}

func (ma *MongoAuth) Login(u *user.User) error {
	db := getMongo()
	defer db.Session.Close()

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
		bson.ObjectId(real.ID).Hex(),
		real.Username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(time.Hour * 24)).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	if ss, err := token.SignedString(SigningKey); err != nil {
		return err
	} else {
		u.ID = real.ID
		u.Token = "Bearer " + ss
		fixUserId(u)
	}
	return nil
}

func (ma *MongoAuth) Signup(u *user.User) error {
	db := getMongo()
	defer db.Session.Close()

	u.ID = "" // ensure no ID were sent

	if pass, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost); err != nil {
		return err
	} else {
		u.Password = string(pass)
	}
	return db.C("user").Insert(u)

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

func (ma *MongoAuth) GetCurrentUser(req *http.Request) *user.User {
	bearer := req.Header.Get("Authorization")
	bearer = strings.Replace(bearer, "Bearer ", "", 1)
	token, err := jwt.ParseWithClaims(bearer, &CustomClaim{}, func(token *jwt.Token) (interface{}, error) {
		return SigningKey, nil
	})
	if err != nil {
		return nil
	}
	claim := token.Claims.(*CustomClaim)
	log.Println("claim", claim)
	db := getMongo()
	defer db.Session.Close()

	u := user.User{}
	if err := db.C("user").FindId(bson.ObjectIdHex(claim.ID)).One(&u); err != nil {
		return nil
	}
	fixUserId(&u)
	return &u
}

func (ma *MongoAuth) GetCurrentUsername(req *http.Request) (string, error) {
	if u := ma.GetCurrentUser(req); u == nil {
		return "", errors.New("No correct user logged found")
	} else {
		return u.Username, nil
	}
}

func (ma *MongoAuth) Get(id string) (*user.User, error) {
	db := getMongo()
	defer db.Session.Close()

	u := user.User{}
	err := db.C("user").FindId(bson.ObjectIdHex(id)).One(&u)
	u.ID = bson.ObjectId(u.ID).Hex()

	return &u, err
}
