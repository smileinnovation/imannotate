package providers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

const url = "https://api.qwant.com/api/search/images?q=%s&t=image&offset=%d&count=10&license=sharecommercially"

type Qwant struct {
	req   string
	page  int
	cache []string
	hit   chan string
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
		req: req,
		hit: make(chan string, 0),
	}

	go q.provide()
	return &q
}

func (q *Qwant) fetch() (string, error) {

	if i, ok := <-q.hit; ok {
		return i, nil
	} else {
		return "", NoMoreFileError{}
	}
}

func (q *Qwant) GetImage() (string, error) {
	return q.fetch()
}

func (q *Qwant) provide() {

	for {
		u := fmt.Sprintf(url, q.req, q.page)
		q.page += 10
		log.Println("Getting", u)
		resp, err := http.Get(u)
		defer resp.Body.Close()

		if err != nil {
			// Error with the GET request on api
			close(q.hit)
			fmt.Println(err)
			return
		} else {
			// Decode response
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
				q.hit <- img.Url
			}
		}
	}
}

func (q *Qwant) AdaptPage() (string, string) {
	logo := "https://www.qwant.com/img/boards-footer-logo-x1.png"

	content := `
<div id="qwant-search">
	<input type="text"></input><br />
	<img src="` + logo + `" />
</div>`

	return content, "#nav"
}
