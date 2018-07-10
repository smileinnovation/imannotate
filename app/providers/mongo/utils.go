package mongo

import (
	"fmt"
	"log"
	"os"

	"github.com/globalsign/mgo"
)

var sess *mgo.Session

func getMongo() *mgo.Database {
	db := os.Getenv("DB_HOST")
	dbu := os.Getenv("DB_USER")
	dbp := os.Getenv("DB_PASS")
	dbn := os.Getenv("DB_NAME")

	if sess == nil {
		var err error
		c := fmt.Sprintf("%s:%s@%s:27017", dbu, dbp, db)
		log.Println(c)
		sess, err = mgo.Dial(c)
		if err != nil {
			log.Fatal("DB connection error:", err)
		}
	}

	return sess.Clone().DB(dbn)
}
