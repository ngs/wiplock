package app

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func (app *App) SetupRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/hooks", app.HandleWebhook).Methods("POST")
	router.HandleFunc("/", app.HandleIndex).Methods("GET")
	router.HandleFunc("/assets/{filename}", app.HandleAsset).Methods("GET")
	router.HandleFunc("/{org}", app.HandleIndex).Methods("GET")
	router.HandleFunc("/{org}/{repo}", app.HandleIndex).Methods("GET")
	router.HandleFunc("/api/{org}/locks", app.HandleListLocks).Methods("GET")
	router.HandleFunc("/api/{org}/{:repo}/lock", app.HandleLockRepo).Methods("POST")
	router.HandleFunc("/api/{org}/{:repo}/lock", app.HandleUnlockRepo).Methods("DELETE")
	return router
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

func (app *App) HandleListLocks(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HandleListLocks: not yet implemented\n")
}

func (app *App) HandleLockRepo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HandleLockRepo: not yet implemented\n")
}

func (app *App) HandleUnlockRepo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HandleUnlockRepo: not yet implemented\n")
}
