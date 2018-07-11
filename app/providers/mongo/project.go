package mongo

import (
	"log"

	"github.com/globalsign/mgo"
	"github.com/smileinnovation/imannotate/api/project"

	"github.com/globalsign/mgo/bson"
)

func init() {
	db := getMongo()
	defer db.Session.Close()

	idx := mgo.Index{
		Key:      []string{"name", "owner"},
		DropDups: true,
		Unique:   true,
	}
	db.C("project").EnsureIndex(idx)

	p := &project.Project{
		Name:        "DB project",
		Owner:       "Bob",
		Tags:        []string{"foo", "bar", "baz"},
		Description: "A sample project in database",
	}
	db.C("project").Insert(p)
}

type MongoProjectACL struct {
	ProjectName string
	Username    string
}

type MongoProjectProvider struct{}

func (mpp *MongoProjectProvider) GetAll(username ...string) []*project.Project {
	db := getMongo()
	defer db.Session.Close()

	projects := []*project.Project{}

	if len(username) > 0 {
		log.Println("Fetching project for user", username[0])
		if err := db.C("project").Find(bson.M{
			"owner": username[0],
		}).All(&projects); err != nil {
			log.Println(err)
			return nil
		}
	}

	// TODO: link others projects from ACL (project where user is not owner)

	for _, p := range projects {
		fixId(p)
	}
	return projects
}

func (mpp *MongoProjectProvider) Get(name string) *project.Project {
	p := project.Project{}
	db := getMongo()
	defer db.Session.Close()
	db.C("project").Find(bson.M{"name": name}).One(&p)

	return fixId(&p)
}

func (mpp *MongoProjectProvider) New(p *project.Project) error {
	db := getMongo()
	defer db.Session.Close()

	// TODO: Check project before to insert
	return db.C("project").Insert(p)
}

func (mpp *MongoProjectProvider) Update(p *project.Project) error {
	db := getMongo()
	defer db.Session.Close()
	log.Println("updating", p)

	id := bson.ObjectIdHex(p.Id)
	p.Id = ""

	return db.C("project").UpdateId(id, p)
}

func (mpp *MongoProjectProvider) NextImage(prj *project.Project) (string, error) {
	provider := getProvider(prj)
	return provider.GetImage()
}

func fixId(p *project.Project) *project.Project {
	p.Id = bson.ObjectId(p.Id).Hex()
	return p
}
