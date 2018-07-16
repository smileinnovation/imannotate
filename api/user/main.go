package user

type User struct {
	ID       string `json:"id" bson:"_id,omitempty"`
	Token    string `json:"token,omitempty"`
	Username string `json:"username"`
	Password string `json:"password,omitempty"`
	Email    string `json:"email,omitempty"`
}
