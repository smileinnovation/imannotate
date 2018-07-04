package user

type User struct {
	ID       string `json:"id"`
	Token    string `json:"token"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}
