package providers

type ImageProvider interface {
	GetImage() (string, error)
}

type FileNotFoundError struct{}

func (FileNotFoundError) Error() string {
	return "File not found"
}

type NoMoreFileError struct{}

func (NoMoreFileError) Error() string {
	return "File not found"
}
