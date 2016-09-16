package app

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"github.com/gorilla/sessions"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/go-playground/webhooks.v1"
	"gopkg.in/go-playground/webhooks.v1/github"
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
}

func GetAssetHash() (string, error) {
	data, err := Asset("assets/build/bundle.js")
	if err != nil {
		return "", err
	}
	h := md5.Sum(data)
	return hex.EncodeToString(h[:]), nil
}

func (app *App) GetSession(r *http.Request) *sessions.Session {
	session, _ := app.SessionStore.Get(r, "__wlsess")
	return session
}

func New() (*App, error) {
	h, err := GetAssetHash()
	if err != nil {
		return nil, err
	}
	secret := os.Getenv("SECRET")
	if secret == "" {
		return nil, errors.New("SECRET is not configured. try run\n$ echo \"export SECRET=$(openssl rand -base64 48)\" >> .envrc")
	}
	store := sessions.NewCookieStore([]byte(secret))
	wh := github.New(&github.Config{Secret: secret})
	app := &App{
		HTMLTemplate: NewTemplate(),
		SessionStore: store,
		AssetHash:    h,
		Webhook:      wh,
	}
	wh.RegisterEvents(app.HandlePullRequest, github.PullRequestEvent)
	return app, nil
}

func Run() error {
	app, err := New()
	if err != nil {
		return err
	}
	router := httprouter.New()
	router.POST("/hooks", app.HandleWebhook)
	router.GET("/", app.Index)
	router.GET("/:org", app.Index)
	router.GET("/:org/:repo", app.Index)
	var port = os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Fatal(http.ListenAndServe(":"+port, router))
	return nil
}
