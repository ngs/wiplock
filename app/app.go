package app

import (
	"errors"
	"fmt"
	"github.com/gorilla/sessions"
	"github.com/lestrrat/go-apache-logformat"
	"gopkg.in/go-playground/webhooks.v1"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
)

type App struct {
	HTMLTemplate *template.Template
	SessionStore *sessions.CookieStore
	AssetHash    string
	Webhook      webhooks.Webhook
	Secret       string
	ClientSecret string
	ClientID     string
}

func New() (*App, error) {
	app := &App{HTMLTemplate: NewTemplate()}
	if err := app.GetAssetHash(); err != nil {
		return app, err
	}
	secret := os.Getenv("SECRET")
	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")
	clientID := os.Getenv("GITHUB_CLIENT_ID")
	var errVars = []string{}
	if secret == "" {
		errVars = append(errVars, "SECRET")
	}
	if clientSecret == "" {
		errVars = append(errVars, "GITHUB_CLIENT_SECRET")
	}
	if clientID == "" {
		errVars = append(errVars, "GITHUB_CLIENT_ID")
	}
	if len(errVars) > 0 {
		return app, fmt.Errorf("%s are not configured.", strings.Join(errVars, ", "))
	}
	if secret == "" {
		return app, errors.New("SECRET is not configured. try run\n$ echo \"export SECRET='$(openssl rand -hex 48)'\" >> .envrc")
	}
	app.Secret = secret
	app.ClientID = clientID
	app.ClientSecret = clientSecret
	app.SetupSessionStore()
	return app, nil
}

func Run() error {
	app, err := New()
	if err != nil {
		return err
	}
	var port = os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	router := app.SetupRouter()
	log.Fatal(http.ListenAndServe(":"+port, apachelog.CombinedLog.Wrap(router, os.Stderr)))
	return nil
}

func (app *App) GetJavaScriptPath() string {
	if os.Getenv("DEV_SERVER") == "1" {
		return "/assets/bundle.js"
	}
	return "/assets/bundle-" + app.AssetHash + ".js"
}
