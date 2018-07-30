package auth

import (
	"net/http"

	"github.com/smileinnovation/imannotate/api/user"
)

// Authenticator interface to implement user management (eg. LDAP, Database, CAS).
type Authenticator interface {
	// Login should take a user as parameter and return error if login failed
	Login(*user.User) error

	// Signup should take a user, check it and register it.
	Signup(*user.User) error

	// Update the user. Please make nice checks on password.
	Update(u *user.User) error

	// Logout should take a user as paramter and return error if logout failed.
	// That one is not mandatory for the entire authenticator, some use JWT so that method can only
	// return nil.
	Logout(*user.User) error

	// Allowed take request as parameter to check some header, cookies, and so on. An error
	// should be returned if the current user is not allowed to see the resource.
	Allowed(*http.Request) error

	// GetCurrentUsername must use header to return username. Note that this method is ONLY used
	// to get username and NOT to check authorization !
	GetCurrentUsername(*http.Request) (string, error) // deprecated ?

	// GetCurrentUser should give the current logged in user
	GetCurrentUser(*http.Request) *user.User

	// Get user from any db. ID should be manipulate by authenticator instance.
	Get(id string) (*user.User, error)
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

func Signup(u *user.User) error {
	return authent.Signup(u)
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

func Get(id string) (*user.User, error) {
	return authent.Get(id)
}

func GetCurrentUser(req *http.Request) *user.User {
	return authent.GetCurrentUser(req)
}

func Update(u *user.User) error {
	return authent.Update(u)
}
