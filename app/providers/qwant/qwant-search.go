package qwant

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"path"

	"github.com/smileinnovation/imannotate/api/garbage"
	"github.com/smileinnovation/imannotate/api/providers"
)

const searchUrl = "https://api.qwant.com/api/search/images?q=%s&t=image&offset=%d&count=10&license=sharecommercially"

type Qwant struct {
	req   string
	page  int
	cache []string
	hit   chan map[string]string
	gc    garbage.GarbageCollector
}

type qMeta struct {
	Data qData `json:"data"`
}

type qData struct {
	Result qRes `json:"result"`
}

type qRes struct {
	Items []qItem `json:"items"`
}

type qItem struct {
	Url string `json:"media"`
}

func NewQwant(req string) *Qwant {
	q := Qwant{
		req: url.QueryEscape(req),
		hit: make(chan map[string]string, 0),
	}

	go q.provide()
	return &q
}

func (q *Qwant) fetch() (string, string, error) {

	if i, ok := <-q.hit; ok {
		// we should not return "name" because we must save "image url"
		// on annotation database to retrieve image source
		return i["url"], i["url"], nil
	} else {
		return "", "", providers.NoMoreFileError{}
	}
}

func (q *Qwant) GetImage() (string, string, error) {
	return q.fetch()
}

func (q *Qwant) AddImage(name, url string) {
	q.hit <- map[string]string{
		"name": name,
		"url":  url,
	}
}

func (q *Qwant) provide() {

	for {
		u := fmt.Sprintf(searchUrl, q.req, q.page)
		q.page += 10
		log.Println("Getting", u)
		resp, err := http.Get(u)

		if err != nil {
			// Error with the GET request on api
			close(q.hit)
			fmt.Println(err)
			return
		} else {
			// Decode response
			defer resp.Body.Close()
			jd := json.NewDecoder(resp.Body)
			res := qMeta{}
			if err := jd.Decode(&res); err != nil {
				// Maybe not a JSON, close all
				close(q.hit)
				fmt.Println(err)
				return
			}
			if len(res.Data.Result.Items) < 1 {
				// Maybe no more results, close all
				close(q.hit)
				log.Println("End of result")
				return
			}
			for _, img := range res.Data.Result.Items {
				// write url to the channel
				// and wait someone read it
				q.AddImage(img.Url, path.Base(img.Url))
			}
		}
	}
}
