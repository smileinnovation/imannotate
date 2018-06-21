package providers

import (
	"log"
	"path/filepath"
)

var current = ""

type FileSystemImageProvider struct {
	BaseRoot string
	List     []string
	Hit      chan string
}

func (f *FileSystemImageProvider) provide() chan string {
	return f.Hit
}

func (f *FileSystemImageProvider) GetImage() (string, error) {
	if file, ok := <-f.provide(); ok {
		return file, nil
	} else {
		f.Hit = make(chan string, 0)
		go next(f)
		return "", NoMoreFileError{}
	}
}

func NewFileSystemImageProvider(path string) *FileSystemImageProvider {
	fsip := &FileSystemImageProvider{
		BaseRoot: path,
		Hit:      make(chan string, 0),
	}

	go next(fsip)
	return fsip
}

func next(f *FileSystemImageProvider) {
	if list, err := filepath.Glob(f.BaseRoot); err != nil {
		log.Println(list)
		close(f.Hit)
	} else {
		for _, file := range list {
			f.Hit <- file
		}
		close(f.Hit)
	}
}
