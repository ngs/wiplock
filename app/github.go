package app

import (
	// "github.com/google/go-github/github"
	"fmt"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	githubEndpoint "golang.org/x/oauth2/github"
)

func (app *App) GetOAuth2Config() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     app.ClientID,
		ClientSecret: app.ClientSecret,
		Endpoint:     githubEndpoint.Endpoint,
		Scopes:       []string{"repo", "admin:repo_hook", "read:org"},
	}
}

func (app *App) GetAccessToken(code string, state string) (string, error) {
	config := app.GetOAuth2Config()
	fmt.Printf("state: %+v\n", state)
	ctx := context.TODO()
	t, err := config.Exchange(ctx, code)
	if err != nil {
		return "", err
	}
	return t.AccessToken, nil
}
