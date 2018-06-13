package storages

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"imannotate.io/annotation"
)

const (
	CLASSFILE = "classes.csv"
	ANNOTFILE = "annotations.csv"
)

type CSVStorage struct {
	path       string
	classes    map[string]int
	maxclassnb int
	mux        sync.Mutex
}

func NewCSVStorage(path string) *CSVStorage {
	fs := CSVStorage{
		path:       path,
		classes:    make(map[string]int),
		maxclassnb: -1,
		mux:        sync.Mutex{},
	}
	return &fs
}

// Save to CSV class and annotation
// class file:
//   classname,num
// annotation file:
//   path,x,y,w,h,classname
func (csv *CSVStorage) Save(ano *annotation.Annotation) error {
	csv.mux.Lock()
	defer csv.mux.Unlock()

	lines := []string{}

	if len(ano.Boxes) == 0 {
		lines = append(lines, ano.Image+",,,,,")
	}

	for _, a := range ano.Boxes {
		// check class
		var err error
		if !csv.classExists(a.Label) {
			_, err = csv.addClass(a.Label)
			if err != nil {
				return err
			}
		}

		lines = append(lines, fmt.Sprintf("%s,%f,%f,%f,%f,%s",
			ano.Image,
			a.X,
			a.Y,
			a.W,
			a.H,
			a.Label))
	}

	p := filepath.Join(csv.path, ANNOTFILE)
	fp, err := os.OpenFile(p, os.O_APPEND|os.O_WRONLY|os.O_CREATE|os.O_SYNC, 0644)
	defer fp.Close()

	if err != nil {
		return err
	}

	if _, err := fp.WriteString(strings.Join(lines, "\n") + "\n"); err != nil {
		return err
	}

	return nil
}

func (csv *CSVStorage) getMaxClass() int {
	if csv.maxclassnb > -1 {
		return csv.maxclassnb
	}

	file := filepath.Join(csv.path, CLASSFILE)
	max := 0
	fp, err := os.Open(file)
	defer fp.Close()

	if err != nil {
		return 0
	}

	err = nil
	reader := bufio.NewScanner(fp)
	for reader.Scan() {
		line := reader.Text()
		cols := strings.Split(line, ",")
		cur, err := strconv.Atoi(cols[1])
		if err != nil {
			continue
		}
		max = int(math.Max(float64(cur), float64(max)))
	}
	csv.maxclassnb = max
	return max
}

func (fs *CSVStorage) classExists(class string) bool {

	if _, ok := fs.classes[class]; ok {
		return true
	}

	p := filepath.Join(fs.path, CLASSFILE)
	fp, err := os.Open(p)
	defer fp.Close()
	if err != nil {
		return false
	}

	err = nil
	reader := bufio.NewScanner(fp)
	for reader.Scan() {
		line := reader.Text()
		cols := strings.Split(line, ",")
		if cols[0] == class {
			return true
		}
	}

	return false
}

func (csv *CSVStorage) addClass(class string) (int, error) {
	max := csv.getMaxClass()
	max++

	p := filepath.Join(csv.path, CLASSFILE)
	fp, err := os.OpenFile(p, os.O_APPEND|os.O_WRONLY|os.O_CREATE|os.O_SYNC, 0644)
	defer fp.Close()
	if err != nil {
		return -1, err
	}

	if _, err := fp.WriteString(fmt.Sprintf("%s,%d\n", class, max)); err != nil {
		return max, err
	}
	csv.classes[class] = max
	csv.maxclassnb = max
	return max, nil

}
