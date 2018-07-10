package dummy

import (
	"encoding/json"
	"errors"

	"github.com/smileinnovation/imannotate/api/project"
)

// Fake list of projects
var projects = []*project.Project{
	{
		Name:        "Vehicules",
		Description: "This is a description of project 1",
		Tags:        []string{"car", "bicycle", "bus", "truck"},
		Owner:       "Alice",
	},
	{
		Name:        "Dogs and cats",
		Description: "This is a description of project 2",
		Tags:        []string{"dog", "cat"},
		Owner:       "Bob",
	},
	{
		Name:        "Hot dog or not ?",
		Description: "This is a description of project 3",
		Tags:        []string{"hot dog", "not hot dog"},
		Owner:       "Alice",
	},
	{
		Name:        "Licenceplates",
		Description: "This is a description of project 4",
		Tags:        []string{"licenceplate", "faces"},
		Owner:       "Alice",
	},
	{
		Name:        "Fruits",
		Description: "This is a description of project 5",
		Tags:        []string{"orange", "banana", "apple"},
		Owner:       "Bob",
	},
}

// fake list of authorization
var acl = map[string][]string{
	"Fruits":        {"Patrice", "Alice"},
	"Licenceplates": {"Joe", "Patrice", "Bob"},
}

// Dummy project
type DummyProject struct {
	images   []string
	provider chan string
}

// GetAll implements ProjectManager.GetAll method.
func (dp *DummyProject) GetAll(owner ...string) []*project.Project {
	pr := []*project.Project{}

	for _, p := range projects {
		for _, ow := range owner {
			if p.Owner == ow {
				pr = append(pr, p)
				continue
			}
			if a, ok := acl[p.Name]; ok {
				for _, u := range a {
					if ow == u {
						pr = append(pr, p)
					}
				}
			}
		}
	}

	return pr
}

// Get implements ProjectManager.Get method.
func (dp *DummyProject) Get(name string) *project.Project {
	for _, p := range projects {
		if p.Name == name {
			return p
		}
	}

	return nil
}

func (db *DummyProject) NextImage(prj *project.Project) (string, error) {
	image := <-provide()
	c, _ := json.Marshal(image)
	return string(c), nil

}

// New project to save.
func (dp *DummyProject) New(prj *project.Project) error {
	if prj.Owner == "" {
		return errors.New("Owner should be set")
	}
	return nil
}

// provide images
var provider chan string

func provide() chan string {
	if provider == nil {
		initImage()
		provider = make(chan string)
		go walk()
	}

	return provider
}

var images []string

func walk() {
	for {
		for _, image := range images {
			provider <- image
		}
	}
}

func initImage() {
	images = []string{
		"https://www.chien.fr/assets/img/000/083/large/choisir-chien-japonais.jpg",
		"https://www.a-toute-berzingue.fr/assets/images/sante/assurance-chien-chat.jpg",
		"https://www.chiens-chats.be/img/questions.jpg",
		"https://www.animauxsante.com/wp-content/uploads/2017/client/gfx/utilisateur/Image/chien-chat-cohabitation.jpg",
	}
}
