package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/smileinnovation/imannotate/api/adapter"
	"github.com/smileinnovation/imannotate/api/annotation"
	"github.com/smileinnovation/imannotate/api/providers"
	"github.com/smileinnovation/imannotate/api/storages"
)

var imageProvider providers.ImageProvider
var storage storages.Storage

func Save(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	d := json.NewDecoder(r.Body)
	m := &annotation.Annotation{}
	if err := d.Decode(m); err != nil {
		log.Println(err)
	}
	log.Printf("%+v\n", m)
	log.Println(storage.Save(m))
}

func NextImage(w http.ResponseWriter, r *http.Request) {
	if image, err := imageProvider.GetImage(); err != nil {
		switch err.(type) {
		case providers.NoMoreFileError:
			w.WriteHeader(http.StatusNoContent)
		case providers.FileNotFoundError:
			w.WriteHeader(http.StatusNotFound)
		default:
			w.WriteHeader(http.StatusServiceUnavailable)
		}

	} else {
		image = strings.Replace(image, "statics/", "", 1)
		fmt.Println(image)
		w.Write([]byte(image))
	}
}

func AdaptPage(w http.ResponseWriter, r *http.Request) {
	if adapter, ok := imageProvider.(adapter.PageAdapter); ok {
		content, selector := adapter.AdaptPage()
		c, _ := json.Marshal(map[string]string{
			"selector": selector,
			"content":  content,
		})
		w.Write(c)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func main() {
	//imageProvider = providers.NewFileSystemImageProvider("./statics/licenceplates/*/*.jpg")
	imageProvider = providers.NewQwant("chien%20chat")
	storage = storages.NewCSVStorage("../out")
	http.HandleFunc("/send", Save)
	http.HandleFunc("/next", NextImage)
	http.HandleFunc("/adaptation", AdaptPage)
	http.Handle("/", http.FileServer(http.Dir("./")))
	log.Fatal(http.ListenAndServe(":8000", nil))
}
