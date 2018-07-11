package server

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/app/server/handlers"
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

func GetServer() *gin.Engine {

	router := gin.Default()

	if os.Getenv("SERVE_STATICS") == "true" {
		router.Use(static.Serve("/", static.LocalFile("/ui", true)))
	}

	v1 := router.Group("/api/v1")
	{
		v1.POST("/user/signin", handlers.Login)
		v1.POST("/project", Auth, handlers.NewProject)
		v1.PUT("/project", Auth, handlers.UpdateProject)
		v1.GET("/project/:name", Auth, handlers.GetProject)
		v1.GET("/project/:name/next", Auth, handlers.GetNextImage)
		v1.POST("/project/:name/annotate", handlers.SaveAnnotation)
		v1.GET("/projects", Auth, handlers.GetProjects)
	}
	return router
}
