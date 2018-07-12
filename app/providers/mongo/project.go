package mongo

import (
	"log"

	"github.com/globalsign/mgo"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"

	"github.com/globalsign/mgo/bson"
)

type MongoProjectACL struct {
	ProjectID bson.ObjectId `bson:"projectId"`
	UserID    bson.ObjectId `bson:"userId"`
}

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

	idx = mgo.Index{
		Key:      []string{"projectId", "userId"},
		DropDups: true,
		Unique:   true,
	}
	db.C("project_acl").EnsureIndex(idx)
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

		// Get project where user is not owner but is allowed to participate
		p2 := []*MongoProjectACL{}
		if err := db.C("project_acl").Find(bson.M{
			"username": username[0],
		}).All(&p2); err == nil {
			ids := []bson.ObjectId{}
			projectacl := []*project.Project{}

			for _, p := range p2 {
				ids = append(ids, p.ProjectID)
			}

			db.C("project").Find(bson.M{
				"_id": bson.M{
					"$in": ids,
				},
			}).All(&projectacl)

			projects = append(projects, projectacl...)
		}
	}

	for _, p := range projects {
		fixProjectId(p)
	}
	return projects
}

func (mpp *MongoProjectProvider) Get(name string) *project.Project {
	p := project.Project{}
	db := getMongo()
	defer db.Session.Close()
	db.C("project").Find(bson.M{"name": name}).One(&p)

	return fixProjectId(&p)
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

func (mpp *MongoProjectProvider) GetContributors(p *project.Project) []*user.User {
	db := getMongo()
	defer db.Session.Close()

	projects := []*MongoProjectACL{}
	db.C("project_acl").Find(bson.M{
		"projectId": bson.ObjectIdHex(p.Id),
	}).All(&projects)

	users := []*user.User{}
	for _, p := range projects {
		u := user.User{}
		db.C("user").FindId(p.UserID).One(&u)
		fixUserId(&u)
		users = append(users, &u)
	}

	return users
}

func (mpp *MongoProjectProvider) AddContributor(u *user.User, p *project.Project) error {
	db := getMongo()
	defer db.Session.Close()

	return db.C("project_acl").Insert(MongoProjectACL{
		ProjectID: bson.ObjectIdHex(p.Id),
		UserID:    bson.ObjectIdHex(u.ID),
	})

}

func (mpp *MongoProjectProvider) RemoveContributor(u *user.User, p *project.Project) error {
	return nil
}
