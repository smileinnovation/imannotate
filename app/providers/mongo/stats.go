package mongo

import (
	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/project"
)

type MongoProjectStats struct {
}

func (s *MongoProjectStats) CountProjects() int {
	db := getMongo()
	defer db.Session.Close()

	n, err := db.C("project").Count()
	if err != nil {
		// not found, so 0
		return 0
	}
	return n

}

func (s *MongoProjectStats) CountAnnotations(prj *project.Project) int {
	db := getMongo()
	defer db.Session.Close()

	n, err := db.C("annotation").Find(bson.M{
		"pid": bson.ObjectIdHex(prj.Id),
	}).Count()

	if err != nil {
		// not found, so 0
		return 0
	}
	return n
}

type MongoUserStats struct{}

func (mu *MongoUserStats) CountUsers() int {
	db := getMongo()
	defer db.Session.Close()

	n, err := db.C("user").Count()
	if err != nil {
		// not found, so 0
		return 0
	}

	return n
}
