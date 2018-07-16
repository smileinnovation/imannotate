package project

import (
	"github.com/smileinnovation/imannotate/api/user"
)

var provider ProjectManager

// PrjectManager interface to implement to manage projects.
type ProjectManager interface {
	// GetAll returns the whole project for given user.
	GetAll(user *user.User) []*Project

	// Get return the project named "name".
	Get(name string) *Project

	// Create and save a new project.
	New(*Project) error

	// Update project.
	Update(*Project) error

	// NextImage return next image url or id to annotate for a given project.
	NextImage(*Project) (string, error)

	// GetContributors return the list of user that are allowed to annotate images.
	GetContributors(*Project) []*user.User

	// AddContributor append a contributor to the project.
	AddContributor(*user.User, *Project) error

	// RemoveContributor remove contributor from the project.
	RemoveContributor(*user.User, *Project) error

	// CanEdit return boolean to indicate if user can touch the project.
	CanEdit(*user.User, *Project) bool

	// CanAnnotate return boolean to indicate if user can annotate images in project.
	CanAnnotate(*user.User, *Project) bool
}

// SetProvider registers the manager to use.
func SetProvider(pm ProjectManager) {
	provider = pm
}

// GetAll returns the ProjectManager.GetAll result.
func GetAll(u *user.User) []*Project {
	return provider.GetAll(u)
}

// Get returns the ProjectManager.Get result.
func Get(name string) *Project {
	return provider.Get(name)
}

func New(p *Project) error {
	return provider.New(p)
}

func Update(p *Project) error {
	return provider.Update(p)
}

func NextImage(p *Project) (string, error) {
	return provider.NextImage(p)
}

func GetContributors(p *Project) []*user.User {
	return provider.GetContributors(p)
}

func AddContributor(u *user.User, p *Project) error {
	return provider.AddContributor(u, p)
}

func RemoveContributor(u *user.User, p *Project) error {
	return provider.RemoveContributor(u, p)
}

func CanEdit(u *user.User, p *Project) bool {
	return provider.CanEdit(u, p)
}

func CanAnnotate(u *user.User, p *Project) bool {
	return provider.CanAnnotate(u, p)
}
