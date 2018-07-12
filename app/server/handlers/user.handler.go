package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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
	c.JSON(200, u)
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

	c.JSON(http.StatusOK, []*user.User{})
}
