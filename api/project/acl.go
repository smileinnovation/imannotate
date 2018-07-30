package project

type PojectAuthorizer interface {
	UserCanSee(*Project) bool
}
