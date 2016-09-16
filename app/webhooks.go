package app

import (
	"fmt"
	"gopkg.in/go-playground/webhooks.v1/github"
)

func (app *App) SetupWebhooks() {
	wh := github.New(&github.Config{Secret: app.Secret})
	wh.RegisterEvents(app.HandlePullRequest, github.PullRequestEvent)
	app.Webhook = wh
}

func (app *App) HandlePullRequest(payload interface{}) {
	pl := payload.(github.ReleasePayload)
	fmt.Printf("%+v", pl)
}
