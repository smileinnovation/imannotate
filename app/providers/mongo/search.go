package mongo

import (
	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/user"
)

type UserSearch struct{}

func (u *UserSearch) Search(q string) ([]*user.User, error) {
	db := getMongo()
	defer db.Session.Close()

	q = `.*` + q + `.*`

	users := []*user.User{}
	err := db.C("user").Find(bson.M{
		"username": bson.M{
			"$regex": q,
		},
	}).All(&users)

	for _, u := range users {
		fixUserId(u)
	}

	return users, err
}
