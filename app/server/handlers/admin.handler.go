package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/admin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"
)

// AdminStats returns basic stats.
func AdminStats(c *gin.Context) {
	ps := project.GetStats().CountProjects()
	us := auth.GetStats().CountUsers()

	c.JSON(http.StatusOK, map[string]int{
		"projects": ps,
		"users":    us,
	})
}

type projectstat struct {
	Project      *project.Project `json:"project"`
	Annotations  int              `json:"annotations"`
	Contributors int              `json:"contributors"`
}

// AdminGetProjects returns the entire project lists.
func AdminGetProjects(c *gin.Context) {
	prj := admin.Get().GetProjects()
	stats := []projectstat{}

	for _, p := range prj {
		na := project.GetStats().CountAnnotations(p)
		ct := project.GetContributors(p)
		stats = append(stats, projectstat{
			Project:      p,
			Annotations:  na,
			Contributors: len(ct),
		})
	}
	c.JSON(http.StatusOK, stats)
}

type userstat struct {
	User     *user.User `json:"user"`
	IsAdmin  bool       `json:"isAdmin"`
	Projects int        `json:"projects"`
}

func AdminGetUsers(c *gin.Context) {
	stats := []userstat{}
	users := admin.Get().GetUsers()
	for _, u := range users {
		s := userstat{User: u}
		p := project.GetAll(u)
		s.IsAdmin = admin.Get().IsAdmin(u)
		s.Projects = len(p)
		stats = append(stats, s)
	}
	c.JSON(http.StatusOK, stats)
}

func DeleteUser(c *gin.Context) {
	uname := c.Param("name")
	u := &user.User{}
	var err error
	if u, err = auth.Get(uname); err != nil {
		c.JSON(http.StatusNotFound, "User not found")
		return
	}

	if err = admin.Get().DeleteUser(u); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusAccepted, u.ID+" deleted")
}

func SetAdmin(c *gin.Context) {
	uid := c.Param("name")
	u, err := auth.Get(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	if err := admin.Get().SetAdmin(u); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusAccepted, "user "+u.ID+" is now admin")
}

func RemoveAdmin(c *gin.Context) {
	uid := c.Param("name")
	u, err := auth.Get(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	if err := admin.Get().RemoveAdmin(u); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusAccepted, "user "+u.ID+" is now normal user")
}
