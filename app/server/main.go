package server

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/admin"
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

func Admin(c *gin.Context) {
	u := auth.GetCurrentUser(c.Request)
	if !admin.Get().IsAdmin(u) {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}

func Health(c *gin.Context) {
	c.String(200, "ok")
}

func GetServer() *gin.Engine {

	router := gin.Default()

	if os.Getenv("SERVE_STATICS") == "true" {
		router.Use(static.Serve("/", static.LocalFile("/ui", true)))
	}

	v1 := router.Group("/api/v1")
	{
		v1.GET("/health", Health)
		v1.POST("/user/signin", handlers.Login)
		v1.POST("/user/signup", handlers.Signup)
		v1.POST("/project", Auth, handlers.NewProject)
		v1.PUT("/project", Auth, handlers.UpdateProject)
		v1.GET("/project/:name/annotations/:format", Auth, handlers.ExportProject)
		v1.GET("/project/:name/next", Auth, handlers.GetNextImage)
		v1.GET("/project/:name/contributors", Auth, handlers.GetContributors)
		v1.DELETE("/project/:name/contributors/:user", Auth, handlers.RemoveContributor)
		v1.POST("/project/:name/contributors/:user", Auth, handlers.AddContributor)
		v1.POST("/project/:name/annotate", Auth, handlers.SaveAnnotation)
		v1.GET("/project/:name", Auth, handlers.GetProject)
		v1.GET("/projects", Auth, handlers.GetProjects)
		v1.GET("/user/search", handlers.SearchUser)

		v1.GET("/admin/projects", Auth, Admin, handlers.AdminGetProjects)

		v1.POST("/check/s3", Auth, handlers.CheckS3Credentials)
	}
	return router
}
