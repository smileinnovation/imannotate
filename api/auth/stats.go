package auth

type Stats interface {
	CountUsers() int
}

var stats Stats

func SetStats(s Stats) {
	stats = s
}

func GetStats() Stats {
	return stats
}
