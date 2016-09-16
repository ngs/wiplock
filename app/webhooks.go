package app

import (
	"fmt"
	"gopkg.in/go-playground/webhooks.v1/github"
)

func (app *App) HandlePullRequest(payload interface{}) {
	pl := payload.(github.ReleasePayload)
	fmt.Printf("%+v", pl)
}
