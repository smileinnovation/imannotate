package user

type UserSearcher interface {
	// Search user using "q" query (eg. Bob*) and returns list of users.
	Search(q string) ([]*User, error)
}

var searcher UserSearcher

func SetUserSearch(u UserSearcher) {
	searcher = u
}

func Seach(q string) ([]*User, error) {
	return searcher.Search(q)
}
