package auth

import (
	"net/http"
	"testing"

	"github.com/smileinnovation/imannotate/api/user"
)

type TestAuth struct{}

func (a *TestAuth) Login(*user.User) error {
	return nil
}

func (a *TestAuth) Signup(*user.User) error {
	return nil
}

func (a *TestAuth) Logout(*user.User) error {
	return nil
}

func (a *TestAuth) Allowed(*http.Request) error {
	return nil
}

func (a *TestAuth) GetCurrentUsername(*http.Request) (string, error) {
	return "Alice", nil
}

func (a *TestAuth) GetCurrentUser(*http.Request) *user.User {
	return nil
}

func (a *TestAuth) Get(id string) (*user.User, error) {
	return nil, nil
}

func TestAuthLogin(t *testing.T) {
	SetAuthenticator(&TestAuth{})

	u := &user.User{
		Username: "Alice",
		Password: "Test",
	}
	if err := Login(u); err != nil {
		t.Error(err)
	}
}
