package exporter

import (
	"io"

	"github.com/smileinnovation/imannotate/api/annotation"
)

type Exporter interface {
	Export([]*annotation.Annotation) io.Reader
}
