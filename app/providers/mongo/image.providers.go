package mongo

import (
	"log"

	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/providers"
	"github.com/smileinnovation/imannotate/app/providers/qwant"
)

var imageProviders = make(map[string]providers.ImageProvider)

func getProvider(prj *project.Project) providers.ImageProvider {
	if p, ok := imageProviders[prj.Name]; !ok {
		createImageProvider(prj)
		return getProvider(prj)
	} else {
		return p
	}
}

func createImageProvider(prj *project.Project) {
	log.Println("Provider for project", prj.Name, prj.ImageProvider, prj.ImageProviderOptions)
	switch prj.ImageProvider {
	case "qwant":
		provider := qwant.NewQwant(prj.ImageProviderOptions["qwantQuery"])
		imageProviders[prj.Name] = provider
	}
}
