package auth

import (
	"net/http"

	"github.com/smileinnovation/imannotate/api/user"
)

type Authenticator interface {
	Login(*user.User) error
	Logout(*user.User) error
	Allowed(*http.Request) error
}

var authent Authenticator

func SetAuthenticator(a Authenticator) {
	authent = a
}

func Login(u *user.User) error {
	return authent.Login(u)
}

func Allowed(req *http.Request) error {
	return authent.Allowed(req)
}
