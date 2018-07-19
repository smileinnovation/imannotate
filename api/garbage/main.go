package garbage

import (
	"time"

	"github.com/smileinnovation/imannotate/api/providers"
)

type GarbageCollector interface {
	Collect(name, data string)
	Delete(name string) error
	SetImageProvider(providers.ImageProvider)
	SetTTL(time.Duration)
}
