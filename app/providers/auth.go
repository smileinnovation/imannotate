package providers

import (
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"

	"github.com/smileinnovation/imannotate/api/user"
)

type DummyAuth struct{}

func (d *DummyAuth) Login(u *user.User) error {
	if len(u.Username) < 3 {
		return fmt.Errorf("Invalid login length, %d < 3", len(u.Username))
	}
	/* if len(u.Password) < 3 {
		return errors.New("Invalid password")
	}*/

	// fake secret token
	u.Token = base64.StdEncoding.EncodeToString([]byte(u.Username))
	return nil
}

func (d *DummyAuth) Logout(*user.User) error {
	return nil
}

func (d *DummyAuth) Allowed(req *http.Request) error {

	if req.Header.Get("Authorization") == "" {
		return errors.New("Authorization header not found")
	}

	return nil
}
