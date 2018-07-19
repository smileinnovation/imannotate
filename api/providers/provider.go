package providers

type ImageProvider interface {
	// GetImage should return the name and the url of image. In case of non accessible image
	// you may use url encoded image (eg. data:image/png,base63,...).
	GetImage() (name, url string, err error)

	// AddImage inject new image to provide to user.
	AddImage(name, url string)
}

type FileNotFoundError struct{}

func (FileNotFoundError) Error() string {
	return "File not found"
}

type NoMoreFileError struct{}

func (NoMoreFileError) Error() string {
	return "File not found"
}
