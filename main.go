package main

import (
	"crypto/md5"
	"encoding/hex"
	"github.com/julienschmidt/httprouter"
	"html/template"
	"log"
	"net/http"
)

type App struct {
	HTMLTemplate *template.Template
	Context
}

type Context struct {
	AssetHash string
}

func (app *App) Asset(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var name = ps.ByName("repo")
	if name == "bundle-"+app.Context.AssetHash+".js" {
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
	app.HTMLTemplate.Execute(w, app.Context)
}

func main() {
	data, err := Asset("assets/build/bundle.js")
	if err != nil {
		panic(err)
	}
	h := md5.Sum(data)
	assetHash := hex.EncodeToString(h[:])
	app := &App{
		HTMLTemplate: NewTemplate(),
		Context: Context{
			AssetHash: assetHash,
		},
	}
	router := httprouter.New()
	router.GET("/", app.Index)
	router.GET("/:org", app.Index)
	router.GET("/:org/:repo", app.Index)

	log.Fatal(http.ListenAndServe(":8080", router))
}
