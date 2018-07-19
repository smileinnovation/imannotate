package handlers

import (
	"log"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
)

func CheckS3Credentials(c *gin.Context) {
	s3opt := map[string]string{}
	c.Bind(&s3opt)

	conf := aws.NewConfig().WithCredentials(credentials.NewStaticCredentials(s3opt["id"], s3opt["secret"], ""))
	sess, err := session.NewSession(conf)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	svc := s3.New(sess, aws.NewConfig().WithRegion(s3opt["region"]))
	log.Println(*svc)

	bl := s3.ListBucketsInput{}
	out, err := svc.ListBuckets(&bl)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	log.Println(out)

	c.JSON(http.StatusOK, out.Buckets)

}
