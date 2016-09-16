package app

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"github.com/gorilla/sessions"
	"github.com/julienschmidt/httprouter"
	"html/template"
	"net/http"
	"os"
)

type App struct {
	HTMLTemplate *template.Template
	SessionStore *sessions.CookieStore
	AssetHash    string
}

func (app *App) Asset(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var name = ps.ByName("repo")
	if name == "bundle-"+app.AssetHash+".js" {
		name = "bundle.js"
	}
	data, err := Asset("assets/build/" + name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
	} else {
		w.Write(data)
	}
}

func (app *App) Index(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	org := ps.ByName("org")
	repo := ps.ByName("org")
	if org == "assets" && repo != "" {
		app.Asset(w, r, ps)
		return
	}
	app.HTMLTemplate.Execute(w, app.CreateContext(r))
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
	secret := os.Getenv("SESSION_SECRET")
	if secret == "" {
		return nil, errors.New("SESSION_SECRET is not configured. try run\n$ echo \"export SESSION_SECRET=$(openssl rand -base64 48)\" >> .envrc")
	}
	store := sessions.NewCookieStore([]byte(secret))
	app := &App{
		HTMLTemplate: NewTemplate(),
		SessionStore: store,
		AssetHash:    h,
	}
	return app, nil
}
