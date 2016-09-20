package app

import (
	"fmt"
	"github.com/google/go-github/github"
	githubWebhook "gopkg.in/go-playground/webhooks.v1/github"
	"regexp"
)

func (app *App) SetupWebhooks() {
	wh := githubWebhook.New(&githubWebhook.Config{Secret: app.Secret})
	wh.RegisterEvents(app.HandlePullRequest, githubWebhook.PullRequestEvent)
	app.Webhook = wh
}

func (app *App) HandlePullRequest(payload interface{}) {
	pl := payload.(githubWebhook.PullRequestPayload)
	title := pl.PullRequest.Title
	body := pl.PullRequest.Body
	sha := pl.PullRequest.Head.SHA
	org := pl.Repository.Owner.Login
	name := pl.Repository.Name
	fullName := pl.Repository.FullName
	fmt.Println(title, body, fullName, sha)
	res, err := app.RedisConn.Do("HGET", app.LockStoreKey, fullName)
	if err != nil {
		fmt.Println(err)
		return
	}
	token, ok := res.(string)
	if !ok {
		fmt.Println("Token not found for " + fullName)
		return
	}
	client := github.NewClient(GetOAuth2ClientForToken(token))
	targetURL := "https://wiplock.herokuapp.com/?repo=" + fullName
	description := "Webhooks for preventing to merge pulls in progress"
	context := "wiplock"
	var state string
	if regexp.MustCompile("(?i)wip").MatchString(title) ||
		regexp.MustCompile("\n\\- [ ]").MatchString(body) {
		state = "pending"
	} else {
		state = "success"
	}
	status := &github.RepoStatus{
		TargetURL:   &targetURL,
		Description: &description,
		Context:     &context,
		State:       &state,
	}
	if _, _, err := client.Repositories.CreateStatus(org, name, sha, status); err != nil {
		fmt.Println(err)
	}
}
