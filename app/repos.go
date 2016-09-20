package app

import (
	"encoding/json"
	"fmt"
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

func (context *Context) LockRepo(org string, repo string) error {
	fullName := org + "/" + repo
	hookURL := context.GetHookURL()
	client := github.NewClient(context.GetOAuth2Client())
	active := true
	name := "web"
	hook, res, err := client.Repositories.CreateHook(org, repo, &github.Hook{
		Name:   &name,
		Events: []string{"pull_request"},
		Active: &active,
		// https://developer.github.com/v3/repos/hooks/
		Config: map[string]interface{}{
			"url":  hookURL,
			"type": "json",
		},
	})
	fmt.Printf("hook: %+v\nres: %+v\n err: %+v\n", hook, res, err)
	if err != nil {
		return err
	}
	conn := context.RedisConn
	token := context.GetAccessToken()
	if _, err := conn.Do("HSET", context.LockStoreKey, fullName, token); err != nil {
		return err
	}
	if err := conn.Flush(); err != nil {
		return err
	}
	return nil
}

func (context *Context) UnlockRepo(org string, repo string) error {
	fullName := org + "/" + repo
	hookURL := context.GetHookURL()
	client := github.NewClient(context.GetOAuth2Client())
	opt := &github.ListOptions{PerPage: 100}
	for {
		hooks, resp, err := client.Repositories.ListHooks(org, repo, opt)
		if err != nil {
			return err
		}
		for _, hook := range hooks {
			if hook.Config["url"] == hookURL {
				if _, err = client.Repositories.DeleteHook(org, repo, *hook.ID); err != nil {
					return err
				}
			}
		}
		if resp.NextPage == 0 {
			break
		}
		opt.Page = resp.NextPage
	}

	fmt.Printf("%v %v", hookURL, client)
	conn := context.RedisConn
	if _, err := conn.Do("HDEL", context.LockStoreKey, fullName); err != nil {
		return err
	}
	if err := conn.Flush(); err != nil {
		return err
	}
	return nil
}
