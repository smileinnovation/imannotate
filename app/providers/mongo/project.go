package mongo

import (
	"errors"
	"io"
	"io/ioutil"
	"log"

	"github.com/globalsign/mgo"
	"github.com/smileinnovation/imannotate/api/annotation/exporter"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"
	"github.com/smileinnovation/imannotate/app/registry"

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

	u := user.User{}
	db.C("user").Find(bson.M{
		"username": "Bob",
	}).One(&u)
	fixUserId(&u)

	p := &project.Project{
		Name:        "DB project",
		Owner:       u.ID,
		Tags:        []string{"foo", "bar", "baz"},
		Description: "A sample project in database",
	}
	db.C("project").Upsert(bson.M{
		"name": p.Name,
	}, p)

	idx = mgo.Index{
		Key:      []string{"projectId", "userId"},
		DropDups: true,
		Unique:   true,
	}
	db.C("project_acl").EnsureIndex(idx)
}

type MongoProjectProvider struct{}

func (mpp *MongoProjectProvider) GetAll(u *user.User) []*project.Project {
	db := getMongo()
	defer db.Session.Close()

	projects := []*project.Project{}

	log.Println("Fetching project for user", u)
	if err := db.C("project").Find(bson.M{
		"owner": u.ID,
	}).All(&projects); err != nil {
		log.Println("P1", err)
		return nil
	}

	// Get project where user is not owner but is allowed to participate
	p2 := []*MongoProjectACL{}
	if err := db.C("project_acl").Find(bson.M{
		"userId": bson.ObjectIdHex(u.ID),
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
		for _, p := range projectacl {
			owner := &user.User{}
			db.C("user").FindId(bson.ObjectIdHex(p.Owner)).One(&owner)
			p.Owner = owner.Username
		}

		projects = append(projects, projectacl...)
	}

	for _, p := range projects {
		fixProjectId(p)
	}
	return projects
}

// TODO: use project id
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

func (mpp *MongoProjectProvider) NextImage(prj *project.Project) (string, string, error) {
	provider := registry.GetProvider(prj)
	if provider == nil {
		return "", "", errors.New("No image provider given for the project named " + prj.Name)
	}
	name, url, err := provider.GetImage()

	if gc := registry.GetGC(prj); gc != nil {
		gc.Collect(name, url)
	}

	return name, url, err
}

func (mpp *MongoProjectProvider) AddImage(prj *project.Project, name string, reader io.Reader) error {
	provider := registry.GetProvider(prj)
	if provider == nil {
		return errors.New("Provider not found:" + name)
	}

	c, _ := ioutil.ReadAll(reader)
	provider.AddImage(name, string(c))
	return nil
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
	db := getMongo()
	defer db.Session.Close()

	return db.C("project_acl").Remove(bson.M{
		"projectId": bson.ObjectIdHex(p.Id),
		"userId":    bson.ObjectIdHex(u.ID),
	})
}

func (mpp *MongoProjectProvider) CanEdit(u *user.User, p *project.Project) bool {
	return canTouchProject(u, p)
}

func (mpp *MongoProjectProvider) CanAnnotate(u *user.User, p *project.Project) bool {
	return canAnnotateProject(u, p)
}

func (mpp *MongoProjectProvider) Export(p *project.Project, exp exporter.Exporter) io.Reader {
	return nil
}
