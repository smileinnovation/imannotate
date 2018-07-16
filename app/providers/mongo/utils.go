package mongo

import (
	"fmt"
	"log"
	"os"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"
)

var sess *mgo.Session

func getMongo() *mgo.Database {
	db := os.Getenv("DB_HOST")
	dbu := os.Getenv("DB_USER")
	dbp := os.Getenv("DB_PASS")
	dbn := os.Getenv("DB_NAME")
	admdb := os.Getenv("DB_AUTH")
	if admdb == "" {
		// is there is no "DB_AUTH" database name for authentication
		// so we use the used db name
		admdb = dbn
	}

	if sess == nil {
		var err error
		c := fmt.Sprintf("%s:%s@%s:27017/%s", dbu, dbp, db, admdb)
		log.Println(c)
		sess, err = mgo.Dial(c)
		if err != nil {
			log.Fatal("DB connection error:", err)
		}
	}

	return sess.Clone().DB(dbn)
}

func fixProjectId(p *project.Project) *project.Project {
	p.Id = bson.ObjectId(p.Id).Hex()
	return p
}

func fixUserId(p *user.User) *user.User {
	p.ID = bson.ObjectId(p.ID).Hex()
	return p
}

func canTouchProject(u *user.User, p *project.Project) bool {

	db := getMongo()
	defer db.Session.Close()

	if p.Owner == u.ID {
		return true
	}

	return false
}

func canAnnotateProject(u *user.User, p *project.Project) bool {

	if canTouchProject(u, p) {
		return true
	}

	db := getMongo()
	defer db.Session.Close()
	if i, err := db.C("project_acl").Find(bson.M{
		"projectId": bson.ObjectIdHex(p.Id),
		"userId":    bson.ObjectIdHex(u.ID),
	}).Count(); err != nil || i < 1 {
		return false
	}
	return false
}
