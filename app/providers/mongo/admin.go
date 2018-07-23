package mongo

import (
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
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
		"userid": bson.ObjectIdHex(u.ID),
	}).Count(); err != nil || n == 0 {
		return false
	}

	return true
}

func (ma *MongoAdmin) GetUsers() []*user.User {
	panic("not implemented")
}

func (ma *MongoAdmin) GetProjects(user ...*user.User) []*project.Project {
	db := getMongo()
	defer db.Session.Close()

	prjs := []*project.Project{}
	db.C("project").Find(nil).All(&prjs)
	return prjs
}

func (ma *MongoAdmin) DeleteUser(user *user.User) error {
	panic("not implemented")
}

func (ma *MongoAdmin) DeleteProject(prj *project.Project) error {
	panic("not implemented")
}
