package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/admin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/user"
)

func Login(c *gin.Context) {
	u := &user.User{}
	c.Bind(u)

	if err := auth.Login(u); err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	u.Password = ""
	c.JSON(http.StatusOK, u)
}

func Signup(c *gin.Context) {
	u := &user.User{}
	c.Bind(u)

	if err := auth.Signup(u); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	u.Password = ""
	c.JSON(http.StatusOK, u)
}

func SearchUser(c *gin.Context) {
	q := c.Request.URL.Query().Get("q")
	if len(q) > 1 {
		if users, err := user.Seach(q); err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		} else {
			for _, u := range users {
				u.Email = ""
				u.Password = ""
			}
			c.JSON(http.StatusOK, users)
			return
		}
	}

	// emty list
	c.JSON(http.StatusOK, []*user.User{})
}

func UpdateUser(c *gin.Context) {
	u := &user.User{}
	c.Bind(u)
	if err := auth.Update(u); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusAccepted, u.Username+" updated")
}

func GetUser(c *gin.Context) {
	un := c.Param("name")
	us, err := auth.Get(un)
	cu := auth.GetCurrentUser(c.Request)

	if !admin.Get().IsAdmin(cu) {
		if cu.ID != us.ID {
			us.Email = ""
			us.Password = ""
		}
	}
	if err != nil {
		c.JSON(http.StatusNotFound, "user not found")
		return
	}
	c.JSON(http.StatusOK, us)
}
