package main

import (
	"github.com/smileinnovation/imannotate/api/admin"
	"github.com/smileinnovation/imannotate/api/annotation"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"
	"github.com/smileinnovation/imannotate/app/providers/mongo"
	"github.com/smileinnovation/imannotate/app/server"
)

func init() {
	auth.SetAuthenticator(&mongo.MongoAuth{})
	project.SetProvider(&mongo.MongoProjectProvider{})
	annotation.SetStore(&mongo.MongoAnnotationStore{})
	user.SetUserSearch(&mongo.UserSearch{})
	admin.Set(&mongo.MongoAdmin{})
}

func main() {
	router := server.GetServer()
	router.Run(":8000")
}
