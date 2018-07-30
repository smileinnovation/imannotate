package server

import (
	"crypto/md5"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/admin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/app/server/handlers"
)

func unlisted(c *gin.Context) {
	c.String(http.StatusNotFound, "Not found")
}

func Auth(c *gin.Context) {
	if err := auth.Allowed(c.Request); err != nil {
		log.Println("Auth error", err)
		c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
	}
}

func Admin(c *gin.Context) {
	Auth(c)
	if c.IsAborted() {
		return
	}
	u := auth.GetCurrentUser(c.Request)
	if !admin.Get().IsAdmin(u) {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}

func ProjectProtection(c *gin.Context) {
	prjname := c.Param("name")
	prj := project.Get(prjname)

	u := auth.GetCurrentUser(c.Request)

	if project.CanEdit(u, prj) || admin.Get().IsAdmin(u) {
		return
	}
	c.AbortWithStatus(http.StatusUnauthorized)
}

func AnnotationProtection(c *gin.Context) {
	prjname := c.Param("name")
	prj := project.Get(prjname)
	u := auth.GetCurrentUser(c.Request)

	if project.CanAnnotate(u, prj) || admin.Get().IsAdmin(u) {
		return
	}
	c.AbortWithStatus(http.StatusUnauthorized)
}

func UserProtection(c *gin.Context) {
	uname := c.Param("name")
	u, err := auth.Get(uname)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cu := auth.GetCurrentUser(c.Request)

	if cu.ID == u.ID || admin.Get().IsAdmin(cu) {
		return
	}
	c.AbortWithStatus(http.StatusUnauthorized)
}

func Gravatar(c *gin.Context) {
	uid := c.Param("name")
	if u, err := auth.Get(uid); err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, fmt.Sprintf("https://www.gravatar.com/avatar/%x", md5.Sum([]byte(u.Email))))
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
		v1.GET("/search/user", handlers.SearchUser)
		v1.POST("/signin", handlers.Login)
		v1.POST("/signup", handlers.Signup)
		v1.PUT("/user/:name", Auth, UserProtection, handlers.UpdateUser)
		v1.GET("/user/:name", Auth, handlers.GetUser)

		v1.GET("/projects", Auth, handlers.GetProjects)
		v1.POST("/project", Auth, handlers.NewProject)
		v1.PUT("/project/:name", Auth, ProjectProtection, handlers.UpdateProject)
		v1.GET("/project/:name/annotations/:format", Auth, AnnotationProtection, handlers.ExportProject)
		v1.GET("/project/:name/next", Auth, AnnotationProtection, handlers.GetNextImage)
		v1.GET("/project/:name/contributors", Auth, ProjectProtection, handlers.GetContributors)
		v1.DELETE("/project/:name/contributors/:user", Auth, ProjectProtection, handlers.RemoveContributor)
		v1.POST("/project/:name/contributors/:user", Auth, ProjectProtection, handlers.AddContributor)
		v1.POST("/project/:name/annotate", Auth, AnnotationProtection, handlers.SaveAnnotation)
		v1.GET("/project/:name", Auth, handlers.GetProject)
		v1.DELETE("/project/:name", Auth, ProjectProtection, handlers.DeleteProject)
		v1.GET("/project/:name/info", Auth, handlers.ProjectInfo)

		v1.DELETE("/user/:name", Auth, Admin, handlers.DeleteUser)

		v1.GET("/admin/stats", Auth, Admin, handlers.AdminStats)
		v1.GET("/admin/projects", Auth, Admin, handlers.AdminGetProjects)
		v1.GET("/admin/users", Auth, Admin, handlers.AdminGetUsers)
		v1.POST("/admin/user/:name", Auth, Admin, handlers.SetAdmin)
		v1.DELETE("/admin/user/:name", Auth, Admin, handlers.RemoveAdmin)

		v1.POST("/check/s3", Auth, handlers.CheckS3Credentials)

		v1.HEAD("/isadmin", Auth, Admin)
		v1.GET("/avatar/:name", Gravatar)

	}
	return router
}
