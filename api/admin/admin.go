package admin

import (
	"github.com/smileinnovation/imannotate/api/project"
	"github.com/smileinnovation/imannotate/api/user"
)

type Admin interface {
	IsAdmin(*user.User) bool
	GetUsers() []*user.User
	GetProjects(user ...*user.User) []*project.Project
	DeleteUser(*user.User) error
}

var administrator Admin

func Set(a Admin) {
	administrator = a
}

func Get() Admin {
	return administrator
}
