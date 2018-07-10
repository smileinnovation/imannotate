package project

var provider ProjectManager

// PrjectManager interface to implement to manage projects.
type ProjectManager interface {
	// GetAll returns the whole project for given users.
	GetAll(username ...string) []*Project

	// Get return the project named "name".
	Get(name string) *Project

	// Create and save a new project.
	New(*Project) error

	// Update project.
	Update(*Project) error

	// NextImage return next image url or id to annotate for a given project.
	NextImage(*Project) (string, error)
}

// SetProvider registers the manager to use.
func SetProvider(pm ProjectManager) {
	provider = pm
}

// GetAll returns the ProjectManager.GetAll result.
func GetAll(username ...string) []*Project {
	return provider.GetAll(username...)
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
