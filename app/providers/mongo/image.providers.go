package mongo

import (
	"log"

	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/providers"
	"github.com/smileinnovation/imannotate/app/providers/qwant"
	"github.com/smileinnovation/imannotate/app/providers/s3store"
)

var imageProviders = make(map[string]providers.ImageProvider)

func getProvider(prj *project.Project) providers.ImageProvider {
	if prj.ImageProvider == "" {
		log.Println("No image provider defined")
		return nil
	}
	if p, ok := imageProviders[prj.Name]; !ok {
		createImageProvider(prj)
		return getProvider(prj)
	} else {
		return p
	}
}

func createImageProvider(prj *project.Project) {
	log.Println("Provider for project", prj.Name, prj.ImageProvider, prj.ImageProviderOptions)
	opt := prj.ImageProviderOptions

	switch prj.ImageProvider {
	case "qwant":
		provider := qwant.NewQwant(opt["qwantQuery"])
		imageProviders[prj.Name] = provider
	case "s3":
		provider := s3store.NewS3ImageProvider(opt["id"], opt["secret"], opt["region"], opt["bucket"], opt["prefix"])
		imageProviders[prj.Name] = provider
	}
}
