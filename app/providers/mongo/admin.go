package mongo

import (
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"
)

type AdminUser struct {
	UserId string `bson:"userid"`
	Level  int    `bson:"level"`
}

func init() {
	db := getMongo()
	defer db.Session.Close()

	idx := mgo.Index{
		Key:      []string{"userid"},
		Unique:   true,
		DropDups: true,
	}

	db.C("adminuser").EnsureIndex(idx)
}

type MongoAdmin struct{}

func (ma *MongoAdmin) IsAdmin(u *user.User) bool {
	db := getMongo()
	defer db.Session.Close()

	if n, err := db.C("adminuser").Find(bson.M{
		"userid": u.ID,
	}).Count(); err != nil || n == 0 {
		return false
	}

	return true
}

func (ma *MongoAdmin) GetUsers() []*user.User {
	u := []*user.User{}
	db := getMongo()
	defer db.Session.Close()

	db.C("user").Find(nil).All(&u)
	for _, us := range u {
		fixUserId(us)
	}
	return u
}

func (ma *MongoAdmin) GetProjects(user ...*user.User) []*project.Project {
	db := getMongo()
	defer db.Session.Close()

	prjs := []*project.Project{}
	db.C("project").Find(nil).All(&prjs)
	for _, p := range prjs {
		fixProjectId(p)

		u, _ := auth.Get(p.Owner)
		p.Owner = u.Username
	}
	return prjs
}

func (ma *MongoAdmin) DeleteUser(u *user.User) error {
	db := getMongo()
	defer db.Session.Close()

	// remove references in ACL
	db.C("project_acl").RemoveAll(bson.M{
		"userId": bson.ObjectIdHex(u.ID),
	})

	// Delete user
	return db.C("user").RemoveId(bson.ObjectIdHex(u.ID))
}

func (ma *MongoAdmin) SetAdmin(u *user.User) error {
	db := getMongo()
	defer db.Session.Close()

	return db.C("adminuser").Insert(bson.M{
		"userid": u.ID,
		"level":  0,
	})
}

func (ma *MongoAdmin) SetLevel(u *user.User, level int) error {
	db := getMongo()
	defer db.Session.Close()

	return db.C("adminuser").Update(bson.M{
		"userid": u.ID,
	}, bson.M{
		"$set": bson.M{
			"level": level,
		},
	})
}

func (ma *MongoAdmin) RemoveAdmin(u *user.User) error {
	db := getMongo()
	defer db.Session.Close()

	_, err := db.C("adminuser").RemoveAll(bson.M{
		"userid": u.ID,
	})

	return err
}
