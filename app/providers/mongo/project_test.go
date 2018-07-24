package mongo

import (
	"os"
	"testing"

	"github.com/globalsign/mgo/bson"
	"github.com/smileinnovation/imannotate/api/project"
)

func TestMarshallToBson(t *testing.T) {
	if os.Getenv("TRAVIS") == "true" {
		t.Skip("Not usable in travis, need mongodb")
		return
	}

	p := &project.Project{
		Name:  "project test",
		Owner: "abc",
	}

	np, err := bson.Marshal(p)
	t.Log(np, err)
	out := bson.M{}
	bson.Unmarshal(np, out)
	t.Log(out)
	out["_id"] = bson.NewObjectId()
	t.Log(out)

}
