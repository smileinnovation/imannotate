package memorygc

import (
	"log"
	"time"

	"github.com/smileinnovation/imannotate/api/providers"
)

type MemoryGC struct {
	ImageProvider providers.ImageProvider
	mem           map[string]string
}

func NewMemoryGC() *MemoryGC {
	mm := &MemoryGC{
		mem: make(map[string]string),
	}

	return mm
}

func (gc *MemoryGC) Collect(name string, data string) {

	gc.mem[name] = data
	go func(name, data string) {
		time.Sleep(5 * time.Second)
		if _, ok := gc.mem[name]; ok {
			log.Println("The image", name, "should be reinjected")
			gc.ImageProvider.AddImage(name, data)
		} else {
			log.Println("The image", name, "not found in GC, do NOT reinject")
		}
	}(name, data)
}

func (gc *MemoryGC) Delete(name string) error {
	log.Println("Remove", name, "from GC")
	delete(gc.mem, name)
	return nil
}

func (gc *MemoryGC) SetImageProvider(p providers.ImageProvider) {
	gc.ImageProvider = p
}
