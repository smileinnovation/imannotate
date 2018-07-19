package mongo

import (
	"log"

	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/annotation"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/app/registry"
)

type ProjectAnnotation struct {
	Pid        bson.ObjectId          `bson:"pid"`
	Annotation *annotation.Annotation `bson:"annotation"`
}

type MongoAnnotationStore struct{}

func (ma *MongoAnnotationStore) Save(p *project.Project, ann *annotation.Annotation) error {
	pa := ProjectAnnotation{bson.ObjectIdHex(p.Id), ann}
	db := getMongo()
	defer db.Session.Close()
	defer func() {
		if gc := registry.GetGC(p); gc != nil {
			gc.Delete(ann.Image)
		}
	}()
	return db.C("annotation").Insert(pa)
}

func (ma *MongoAnnotationStore) Get(p *project.Project) []*annotation.Annotation {
	db := getMongo()
	defer db.Session.Close()

	pja := []*ProjectAnnotation{}
	log.Println(p)

	if err := db.C("annotation").Find(bson.M{
		"pid": bson.ObjectIdHex(p.Id),
	}).All(&pja); err != nil {
		log.Println("Err", err)
		return nil
	}
	ann := []*annotation.Annotation{}
	for _, pa := range pja {
		ann = append(ann, pa.Annotation)
	}
	return ann

}
