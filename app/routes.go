package app

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *App) SetupRouter() *httprouter.Router {
	router := httprouter.New()
	router.POST("/hooks", app.HandleWebhook)
	router.GET("/", app.HandleIndex)
	router.GET("/:org", app.HandleIndex)
	router.GET("/:org/:repo", app.HandleIndex)
	return router
}

func (app *App) HandleAsset(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
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

func (app *App) HandleIndex(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	org := ps.ByName("org")
	repo := ps.ByName("repo")
	if org == "assets" && repo != "" {
		app.HandleAsset(w, r, ps)
		return
	}
	app.HTMLTemplate.Execute(w, app.CreateContext(r))
}

func (app *App) HandleWebhook(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	app.Webhook.ParsePayload(w, r)
}
