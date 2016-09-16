package app

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

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
	repo := ps.ByName("repo")
	if org == "assets" && repo != "" {
		app.Asset(w, r, ps)
		return
	}
	app.HTMLTemplate.Execute(w, app.CreateContext(r))
}

func (app *App) HandleWebhook(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	app.Webhook.ParsePayload(w, r)
}
