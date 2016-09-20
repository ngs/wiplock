package app

import (
	"fmt"
	"github.com/google/go-github/github"
	"regexp"
)

func (app *App) HandlePullRequest(payload PullRequestPayload) error {
	app.ReconnectRedisIfNeeeded()
	pr := payload.PullRequest
	repo := payload.Repository
	title := pr.Title
	body := pr.Body
	sha := pr.Head.SHA
	org := *repo.Owner.Login
	name := *repo.Name
	fullName := repo.FullName
	res, err := app.RedisConn.Do("HGET", app.LockStoreKey, fullName)
	if err != nil {
		fmt.Println(err)
		return err
	}
	tokenBytes, ok := res.([]byte)
	if !ok {
		return fmt.Errorf("Token not found for %v", fullName)
	}
	token := string(tokenBytes)
	client := github.NewClient(GetOAuth2ClientForToken(token))
	targetURL := "https://wiplock.herokuapp.com/?repo=" + fullName
	description := "This pull request"
	context := "wiplock"
	var state string
	containsWIP := regexp.MustCompile("(?i)wip").MatchString(title)
	containsUnchecked := regexp.MustCompile("\\n\\-\\s+\\[\\s+\\]([^\\n]+)").MatchString(body)
	if containsWIP || containsUnchecked {
		state = "pending"
	} else {
		state = "success"
	}
	if containsWIP {
		description = description + " contains WIP in the title"
	}
	if containsUnchecked {
		if containsWIP {
			description = description + " and"
		}
		description = description + " has unchecked checkboxes"
	}
	status := &github.RepoStatus{
		TargetURL:   &targetURL,
		Description: &description,
		Context:     &context,
		State:       &state,
	}
	if _, _, err := client.Repositories.CreateStatus(org, name, sha, status); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
