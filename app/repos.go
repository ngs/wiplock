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
		Locked:  false,
	}
}

func (context *Context) GetRepos() ([]Repository, error) {
	client := github.NewClient(context.GetOAuth2Client())
	var allRepos []Repository
	var fullNames []string
	fullNames = append(fullNames, context.LockStoreKey)
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
				fullNames = append(fullNames, *repo.FullName)
			}
		}
		if resp.NextPage == 0 {
			break
		}
		opt.ListOptions.Page = resp.NextPage
	}
	hmgetArgs := make([]interface{}, len(fullNames))
	for i, v := range fullNames {
		hmgetArgs[i] = v
	}
	res, err := context.RedisConn.Do("HMGET", hmgetArgs...)
	if err != nil {
		return allRepos, err
	}
	for i, v := range res.([]interface{}) {
		allRepos[i].Locked = v != nil
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

func (context *Context) LockRepo(fullName string) error {
	conn := context.RedisConn
	if _, err := conn.Do("HSET", context.LockStoreKey, fullName, context.GetAccessToken()); err != nil {
		return err
	}
	if err := conn.Flush(); err != nil {
		return err
	}
	// TODO: Create webhook
	return nil
}

func (context *Context) UnlockRepo(fullName string) error {
	conn := context.RedisConn
	if _, err := conn.Do("HSET", context.LockStoreKey, fullName); err != nil {
		return err
	}
	if err := conn.Flush(); err != nil {
		return err
	}
	// TODO: Delete webhook
	return nil
}
