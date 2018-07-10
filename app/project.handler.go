package app

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/project"
)

func GetProjects(c *gin.Context) {
	username, err := auth.GetCurrentUsername(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	projects := project.GetAll(username)
	log.Println("Handler projects", projects, "for user", username)
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

func NewProject(c *gin.Context) {
	p := &project.Project{}
	c.Bind(p)
	if err := project.New(p); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, p)
}

func UpdateProject(c *gin.Context) {
	p := &project.Project{}
	c.Bind(p)

	if err := project.Update(p); err != nil {
		c.JSON(http.StatusNotAcceptable, err.Error())
		return
	}

	c.JSON(http.StatusOK, p)
}

func GetNextImage(c *gin.Context) {
	p := project.Get(c.Param("name"))
	image, _ := project.NextImage(p)

	c.String(http.StatusOK, image)
}

func SaveAnnotation(c *gin.Context) {

}
