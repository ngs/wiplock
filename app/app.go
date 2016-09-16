package app

import (
	"errors"
	"github.com/gorilla/sessions"
	"github.com/lestrrat/go-apache-logformat"
	"gopkg.in/go-playground/webhooks.v1"
	"html/template"
	"log"
	"net/http"
	"os"
)

type App struct {
	HTMLTemplate *template.Template
	SessionStore *sessions.CookieStore
	AssetHash    string
	Webhook      webhooks.Webhook
	Secret       string
}

func New() (*App, error) {
	app := &App{HTMLTemplate: NewTemplate()}
	if err := app.GetAssetHash(); err != nil {
		return app, err
	}
	secret := os.Getenv("SECRET")
	if secret == "" {
		return app, errors.New("SECRET is not configured. try run\n$ echo \"export SECRET='$(openssl rand -base64 48)'\" >> .envrc")
	}
	app.Secret = secret
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
