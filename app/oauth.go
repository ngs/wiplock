package app

import (
	"fmt"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	githubEndpoint "golang.org/x/oauth2/github"
	"net/http"
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

func (context *Context) GetOAuth2Client() *http.Client {
	token := context.GetAccessToken()
	if token == "" {
		return nil
	}
	return GetOAuth2ClientForToken(token)
}

func GetOAuth2ClientForToken(token string) *http.Client {
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	return oauth2.NewClient(oauth2.NoContext, ts)
}
