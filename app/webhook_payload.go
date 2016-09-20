package app

// PullRequestPayload contains the information for GitHub's pull_request hook event
type PullRequestPayload struct {
	PullRequest PullRequest `json:"pull_request"`
	Repository  Repository  `json:"repository"`
}

// PullRequest contains GitHub's pull_request information
type PullRequest struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Body  string `json:"body"`
	Head  Head   `json:"head"`
}

// Head contains GitHub's head information
type Head struct {
	Label string     `json:"label"`
	Ref   string     `json:"ref"`
	SHA   string     `json:"sha"`
	User  User       `json:"user"`
	Repo  Repository `json:"repo"`
}

// User contains GitHub's user information
type User struct {
	Login string `json:"login"`
}

// Owner contains GitHub's owner information
type Owner struct {
	User
}
