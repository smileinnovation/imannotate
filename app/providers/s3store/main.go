package s3store

import (
	"bytes"
	"encoding/base64"
	"errors"
	"image"
	_ "image/jpeg"
	"image/png"
	"io"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type s3res struct {
	Name   string
	Reader io.Reader
}

type S3ImageProvider struct {
	bucket string
	prefix string
	id     string
	secret string
	region string
	hit    chan *s3res
}

func NewS3ImageProvider(id, secret, region, bucket, prefix string) *S3ImageProvider {

	c := aws.NewConfig().WithCredentials(credentials.NewStaticCredentials(id, secret, ""))
	sess, err := session.NewSession(c)
	if err != nil {
		log.Println(err)
	}
	svc := s3.New(sess, aws.NewConfig().WithRegion(region))

	sss := &S3ImageProvider{
		id:     id,
		secret: secret,
		region: region,
		bucket: bucket,
		prefix: prefix,
		hit:    make(chan *s3res),
	}
	go sss.fetch(svc)
	return sss
}

func (sss *S3ImageProvider) GetImage() (string, string, error) {
	if i, ok := <-sss.hit; ok {
		// copy stream
		im, _, err := image.Decode(i.Reader)
		if err != nil {
			log.Println(err)
		}
		var buff bytes.Buffer

		png.Encode(&buff, im)
		return i.Name, "data:image/png;base64," + base64.StdEncoding.EncodeToString(buff.Bytes()), nil
	}
	return "", "", errors.New("No new file")
}

func (sss *S3ImageProvider) AddImage(name, url string) {
	var b []byte

	buff := bytes.NewBuffer(b)
	buff.WriteString(url)

	sss.hit <- &s3res{
		Name:   name,
		Reader: buff,
	}
}

func (sss *S3ImageProvider) fetch(svc *s3.S3) {
	buck := &s3.ListObjectsV2Input{}
	buck.SetBucket(sss.bucket)
	buck.SetPrefix(sss.prefix + "/")
	buck.SetDelimiter("/")

	sss.listThat(svc, buck)
}

func (sss *S3ImageProvider) listThat(svc *s3.S3, buck *s3.ListObjectsV2Input) {
	prefixes := []string{}
	page := 0
	err := svc.ListObjectsV2Pages(buck, func(p *s3.ListObjectsV2Output, lastPage bool) bool {
		page++
		for _, cc := range p.Contents {
			isImage := false
			for _, ext := range []string{".jpg", ".jpeg", ".png"} {
				k := strings.ToLower(*cc.Key)
				if strings.HasSuffix(k, ext) {
					isImage = true
				}
			}
			if !isImage {
				continue
			}

			in := s3.GetObjectInput{
				Bucket: buck.Bucket,
				Key:    cc.Key,
			}
			res, err := svc.GetObject(&in)
			if err != nil {
				log.Println("S3 ERR 1", err)
			}

			// AddImage...
			sss.hit <- &s3res{
				Name:   *cc.Key,
				Reader: res.Body,
			}
		}
		for _, cp := range p.CommonPrefixes {
			prefixes = append(prefixes, *cp.Prefix)
		}
		return lastPage
	})
	if err != nil {
		log.Println("S3 failed", err)
	}
	for _, p := range prefixes {
		b := &s3.ListObjectsV2Input{}
		b.SetBucket(*buck.Bucket)
		b.SetPrefix(p)
		b.SetDelimiter("/")
		sss.listThat(svc, b)
	}
}
