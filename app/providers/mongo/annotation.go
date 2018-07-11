package mongo

import (
	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/annotation"
	"github.com/smileinnovation/imannotate/api/project"
)

type ProjectAnnotation struct {
	Pid        bson.ObjectId
	Annotation *annotation.Annotation
}

type MongoAnnotationStore struct{}

func (ma *MongoAnnotationStore) Save(p *project.Project, ann *annotation.Annotation) error {
	pa := ProjectAnnotation{bson.ObjectIdHex(p.Id), ann}
	db := getMongo()
	defer db.Session.Close()
	return db.C("annotation").Insert(pa)
}
