package annotation

import "github.com/smileinnovation/imannotate/api/project"

type Annotation struct {
	Image string `json:"image" bson:"image"`
	Boxes []*Box `json:"boxes" bson:"boxes"`
}

type Box struct {
	Label string  `json:"label" bson:"label"`
	X     float64 `json:"x" bson:"x"`
	Y     float64 `json:"y" bson:"y"`
	W     float64 `json:"width" bson:"w"`
	H     float64 `json:"height" bson:"h"`
}

type AnnotationStore interface {
	Save(*project.Project, *Annotation) error
	Get(*project.Project) []*Annotation
}

var store AnnotationStore

func SetStore(as AnnotationStore) {
	store = as
}

func Save(p *project.Project, an *Annotation) error {
	return store.Save(p, an)
}

func Get(p *project.Project) []*Annotation {
	return store.Get(p)
}
