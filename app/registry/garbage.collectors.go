package registry

import (
	"github.com/smileinnovation/imannotate/api/garbage"
	"github.com/smileinnovation/imannotate/api/project"
)

var collectors = map[string]garbage.GarbageCollector{}

func SetGC(prj *project.Project, gc garbage.GarbageCollector) {
	if _, ok := collectors[prj.Id]; !ok {
		collectors[prj.Id] = gc
	}
}

func GetGC(prj *project.Project) garbage.GarbageCollector {
	return collectors[prj.Id]
}
