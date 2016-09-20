package app

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
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
	event := r.Header.Get("X-GitHub-Event")
	if event == "" {
		http.Error(w, "400 Bad Request - Missing X-GitHub-Event Header", http.StatusBadRequest)
		return
	}
	if event == "ping" {
		w.Write([]byte("OK"))
		return
	}
	if event != "pull_request" {
		http.Error(w, "400 Bad Request - Invalid X-GitHub-Event Header: "+event, http.StatusBadRequest)
		return
	}
	payload, err := ioutil.ReadAll(r.Body)
	if err != nil || len(payload) == 0 {
		http.Error(w, "Error reading Body", http.StatusInternalServerError)
		return
	}

	signature := r.Header.Get("X-Hub-Signature")

	if len(signature) == 0 {
		http.Error(w, "403 Forbidden - Missing X-Hub-Signature required for HMAC verification", http.StatusForbidden)
		return
	}

	mac := hmac.New(sha1.New, []byte(app.Secret))
	mac.Write(payload)

	expectedMAC := hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(signature[5:]), []byte(expectedMAC)) {
		http.Error(w, "403 Forbidden - HMAC verification failed", http.StatusForbidden)
		return
	}

	var p PullRequestPayload
	json.Unmarshal([]byte(payload), &p)
	if err := app.HandlePullRequest(p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (app *App) HandleAuthenticate(w http.ResponseWriter, r *http.Request) {
	config := app.GetOAuth2Config()
	state := RandomString(24) // no meaning for now
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
	app.ReconnectRedisIfNeeeded()
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
	app.ReconnectRedisIfNeeeded()
	vars := mux.Vars(r)
	org := vars["org"]
	repo := vars["repo"]
	context := app.CreateContext(r)
	if err := context.LockRepo(org, repo); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(204)
}

func (app *App) HandleUnlockRepo(w http.ResponseWriter, r *http.Request) {
	app.ReconnectRedisIfNeeeded()
	vars := mux.Vars(r)
	org := vars["org"]
	repo := vars["repo"]
	context := app.CreateContext(r)
	if err := context.UnlockRepo(org, repo); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(204)
}
