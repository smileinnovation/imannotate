package storages

import "imannotate.io/annotation"

type Storage interface {
	Save(*annotation.Annotation) error
}
