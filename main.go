package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/app"
	"github.com/smileinnovation/imannotate/app/providers"
)

func unlisted(c *gin.Context) {
	c.String(http.StatusNotFound, "Not found")
}

func CORS(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	if c.Request.Method == "OPTIONS" {
		fmt.Println("options")
		c.AbortWithStatus(http.StatusOK)
	}
}

func Auth(c *gin.Context) {
	if err := auth.Allowed(c.Request); err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}

func init() {
	auth.SetAuthenticator(&providers.DummyAuth{})
	project.SetProvider(&providers.DummyProject{})
}

func main() {
	router := gin.Default()

	router.Use(CORS)

	v1 := router.Group("/api/v1")
	{
		v1.POST("/user/signin", app.Login)
		v1.GET("/project/:name", Auth, app.GetProject)
		v1.GET("/project/:name/next", Auth, app.GetNextImage)
		v1.GET("/projects", Auth, app.GetProjects)
	}

	router.Run(":8000")
}
