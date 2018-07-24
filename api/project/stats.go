package project

type Stats interface {
	CountProjects() int
	CountAnnotations(prj *Project) int
}

var stat Stats

func SetStats(s Stats) {
	stat = s
}

func GetStats() Stats {
	return stat
}
