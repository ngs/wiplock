package app

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func (app *App) SetupRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/repos", app.HandleListRepos).Methods("GET")
	router.HandleFunc("/oauth/callback", app.HandleOAuthCallback).Methods("GET")
	router.HandleFunc("/hooks", app.HandleWebhook).Methods("POST")
	router.HandleFunc("/login", app.HandleAuthenticate).Methods("GET")
	router.HandleFunc("/logout", app.HandleUnauthenticate).Methods("GET")
	router.HandleFunc("/assets/{filename}", app.HandleAsset).Methods("GET")
	router.HandleFunc("/api/{org}/{repo}/lock", app.HandleLockRepo).Methods("PUT")
	router.HandleFunc("/api/{org}/{repo}/lock", app.HandleUnlockRepo).Methods("DELETE")
	router.HandleFunc("/favicon.ico", app.HandleFavicon).Methods("GET")
	router.HandleFunc("/", app.HandleIndex).Methods("GET")
	return router
}

func (app *App) HandleFavicon(w http.ResponseWriter, r *http.Request) {
	data, err := Asset("assets/build/favicon.ico")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(data)
	}
}

func (app *App) HandleAsset(w http.ResponseWriter, r *http.Request) {
	var name = mux.Vars(r)["filename"]
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

func (app *App) HandleIndex(w http.ResponseWriter, r *http.Request) {
	app.HTMLTemplate.Execute(w, app.CreateContext(r))
}

func (app *App) HandleWebhook(w http.ResponseWriter, r *http.Request) {
	app.Webhook.ParsePayload(w, r)
}

func (app *App) HandleAuthenticate(w http.ResponseWriter, r *http.Request) {
	config := app.GetOAuth2Config()
	state := RandomString(24) // TODO: persist referer with state as key
	url := config.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusSeeOther)
}

func (app *App) HandleUnauthenticate(w http.ResponseWriter, r *http.Request) {
	context := app.CreateContext(r)
	context.SetAccessToken("", w)
	http.Redirect(w, r, "/", http.StatusFound)
}

func (app *App) HandleOAuthCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	token, err := app.GetAccessToken(code, state)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	context := app.CreateContext(r)
	context.SetAccessToken(token, w)
	http.Redirect(w, r, "/", http.StatusFound)
}

func (app *App) HandleListRepos(w http.ResponseWriter, r *http.Request) {
	context := app.CreateContext(r)
	data, err := context.GetReposJson()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(data)
}

func (app *App) HandleLockRepo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HandleLockRepo: not yet implemented\n")
}

func (app *App) HandleUnlockRepo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HandleUnlockRepo: not yet implemented\n")
}
