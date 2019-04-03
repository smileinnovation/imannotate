package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/smileinnovation/imannotate/api/auth"
	"github.com/smileinnovation/imannotate/api/user"
	"github.com/smileinnovation/imannotate/app/server"
)

type TestAuthenticator struct{}

func (ta *TestAuthenticator) Login(u *user.User) error {
	if u.Username != "Alice" {
		return errors.New("Test user is not ok")
	}

	return nil
}

func (ta *TestAuthenticator) Signup(*user.User) error {
	return nil
}

func (ta *TestAuthenticator) Logout(*user.User) error {
	panic("not implemented")
}

func (ta *TestAuthenticator) Allowed(*http.Request) error {
	panic("not implemented")
}

func (ta *TestAuthenticator) GetCurrentUsername(*http.Request) (string, error) {
	panic("not implemented")
}

func (ta *TestAuthenticator) Get(id string) (*user.User, error) {
	panic("not implemented")
}

func (ta *TestAuthenticator) GetCurrentUser(*http.Request) *user.User {
	return nil
}

func (ta *TestAuthenticator) Update(u *user.User) error {
	panic("not implemented")
}

func getHTTPTest() *httptest.Server {
	auth.SetAuthenticator(&TestAuthenticator{})
	gin.SetMode(gin.ReleaseMode)

	server := server.GetServer()
	ht := httptest.NewServer(server)
	return ht
}

func postJson(path string, data interface{}) (*http.Response, error) {
	ht := getHTTPTest()
	defer ht.Close()
	j, _ := json.Marshal(data)

	buff := bytes.NewBuffer(j)

	return http.Post(ht.URL+path, "application/json", buff)
}

func TestLogin(t *testing.T) {

	u := user.User{
		Username: "Alice",
		Password: "Test",
	}

	resp, err := postJson("/api/v1/signin", u)

	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode > 299 {
		var r interface{}
		d := json.NewDecoder(resp.Body)
		d.Decode(&r)
		t.Fatal("User should be logged in but an error occured: ", r)
	}

}

func TestFailedLogin(t *testing.T) {
	u := user.User{
		Username: "Bob",
		Password: "Test",
	}

	resp, err := postJson("/api/v1/signin", u)
	t.Log("response status", resp.StatusCode)

	if err != nil {
		t.Log(err)
	}

	if resp.StatusCode != http.StatusUnauthorized {
		d := json.NewDecoder(resp.Body)
		d.Decode(&u)
		t.Fatal("User should not be authenticated", u)
	}

}
