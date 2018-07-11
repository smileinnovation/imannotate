package annotation

import "github.com/smileinnovation/imannotate/api/project"

type Annotation struct {
	Image string `json:"image"`
	Boxes []Box  `json:"boxes"`
}

type Box struct {
	Label string  `json:"label"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	W     float64 `json:"w"`
	H     float64 `json:"h"`
}

type AnnotationStore interface {
	Save(*project.Project, *Annotation) error
}

var store AnnotationStore

func SetStore(as AnnotationStore) {
	store = as
}

func Save(p *project.Project, an *Annotation) error {
	return store.Save(p, an)
}
