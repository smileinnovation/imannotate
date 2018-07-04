package app

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/project"
)

func GetProjects(c *gin.Context) {
	projects := project.GetAll(c.Request.Header.Get("Authorization"))
	log.Println("Handler projects", projects)
	if len(projects) == 0 {
		c.JSON(http.StatusNotFound, projects)
		return
	}
	c.JSON(http.StatusOK, projects)
}

func GetProject(c *gin.Context) {
	name := c.Param("name")
	status := http.StatusOK
	p := project.Get(name)

	if p == nil {
		status = http.StatusNotFound
	}
	c.JSON(status, p)
}

func GetNextImage(c *gin.Context) {
	p := project.Get(c.Param("name"))
	image := p.NextImage()

	c.String(http.StatusOK, image)
}
