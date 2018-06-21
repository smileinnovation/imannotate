package storages

import "github.com/smileinnovation/imannotate/api/annotation"

type Storage interface {
	Save(*annotation.Annotation) error
}
