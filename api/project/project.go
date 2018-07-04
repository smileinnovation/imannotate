package project

type Project struct {
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Tags        []string      `json:"tags"`
	Owner       string        `json:"owner"`
	NextImage   func() string `json:"-"`
}
