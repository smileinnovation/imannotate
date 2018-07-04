package project

var provider ProjectManager

type ProjectManager interface {
	GetAll(username ...string) []*Project
	Get(name string) *Project
}

func SetProvider(pm ProjectManager) {
	provider = pm
}

func GetAll(username ...string) []*Project {
	return provider.GetAll(username...)
}

func Get(name string) *Project {
	return provider.Get(name)
}
