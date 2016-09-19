package app

import (
	"encoding/json"
	"github.com/google/go-github/github"
)

type Repository struct {
	ID      *int         `json:"id,omitempty"`
	Owner   *github.User `json:"owner,omitempty"`
	Name    *string      `json:"name,omitempty"`
	HTMLURL *string      `json:"html_url,omitempty"`
	Private *bool        `json:"private"`
	Locked  bool         `json:"locked"`
}

func RepositoryFromGitHub(repo *github.Repository) Repository {
	return Repository{
		ID:      repo.ID,
		Owner:   repo.Owner,
		Name:    repo.Name,
		HTMLURL: repo.HTMLURL,
		Private: repo.Private,
		Locked:  false, // TODO
	}
}

func (context *Context) GetRepos() ([]Repository, error) {
	client := github.NewClient(context.GetOAuth2Client())
	var allRepos []Repository
	opt := &github.RepositoryListOptions{
		ListOptions: github.ListOptions{PerPage: 100},
	}
	for {
		repos, resp, err := client.Repositories.List("", opt)
		if err != nil {
			return []Repository{}, err
		}
		for _, repo := range repos {
			if (*repo.Permissions)["admin"] == true {
				allRepos = append(allRepos, RepositoryFromGitHub(repo))
			}
		}
		if resp.NextPage == 0 {
			break
		}
		opt.ListOptions.Page = resp.NextPage
	}
	return allRepos, nil
}

func (context *Context) GetReposJson() ([]byte, error) {
	repos, err := context.GetRepos()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(repos)
}
