package annotation

type Annotation struct {
	Image string `json:"image"`
	Boxes []Box  `json:"boxes"`
}

type Box struct {
	Label string  `json:"label"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	W     float64 `json:"w"`
	H     float64 `json:"h"`
}
