package auth

import (
	"net/http"

	"github.com/smileinnovation/imannotate/api/user"
)

// Authenticator interface to implement user management (eg. LDAP, Database, CAS).
type Authenticator interface {
	// Login should take a user as parameter and return error if login failed
	Login(*user.User) error

	// Logout should take a user as paramter and return error if logout failed.
	// That one is not mandatory for the entire authenticator, some use JWT so that method can only
	// return nil.
	Logout(*user.User) error

	// Allowed take request as parameter to check some header, cookies, and so on. An error
	// should be returned if the current user is not allowed to see the resource.
	Allowed(*http.Request) error

	// GetCurrentUsername must use header to return username. Note that this method is ONLY used
	// to get username and NOT to check authorization !
	GetCurrentUsername(*http.Request) (string, error)
}

var authent Authenticator

// SetAuthenticator will register given Authenticator to use.
func SetAuthenticator(authenticator Authenticator) {
	authent = authenticator
}

// Login will return the Authenticator.Login result - if the user login process failed, an error is returned.
func Login(u *user.User) error {
	return authent.Login(u)
}

// Allowed returns Authenticator.Allowed result, it user is not allowed to use current resource, an non nil error is returned.
func Allowed(req *http.Request) error {
	return authent.Allowed(req)
}

// GetCurrentUsername returns Authenticator.GetCurrentUsername response, it must give the current logged user name. If user is not
// logged so an error is returned. If something goes wrong to read the user name, an non-nil error is also returned.
func GetCurrentUsername(req *http.Request) (string, error) {
	return authent.GetCurrentUsername(req)
}
