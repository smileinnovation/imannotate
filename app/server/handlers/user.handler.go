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
