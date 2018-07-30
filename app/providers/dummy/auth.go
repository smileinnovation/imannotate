package dummy

import (
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"

	"github.com/smileinnovation/imannotate/api/user"
)

// Implements Authenticator.
type DummyAuth struct{}

// Login implements Authenticator.Login method.
func (d *DummyAuth) Login(u *user.User) error {
	if len(u.Username) < 3 {
		return fmt.Errorf("Invalid login length, %d < 3", len(u.Username))
	}
	// fake secret token
	u.Token = base64.StdEncoding.EncodeToString([]byte(u.Username))
	return nil
}

// Logout implements Authenticator.Logout method. Does nothing, we are using faked authorization header.
func (d *DummyAuth) Logout(*user.User) error {
	return nil
}

// Allowed implements Authenticator.Allowed method. This only check if authorization header exists (DummyAuth is a test).
func (d *DummyAuth) Allowed(req *http.Request) error {

	if req.Header.Get("Authorization") == "" {
		return errors.New("Authorization header not found")
	}

	return nil
}

// GetCurrentUsername implements Authenticator.GetCurrentUsername methods.
// Base64 decrypt authorization header where we stored username (that's for testing).
func (d *DummyAuth) GetCurrentUsername(req *http.Request) (string, error) {
	a := req.Header.Get("Authorization")
	return a, nil
}
