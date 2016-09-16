package main

import (
	"github.com/julienschmidt/httprouter"
	"github.com/ngs/wiplock/app"
	"log"
	"net/http"
	"os"
)

func main() {
	app, err := app.New()
	if err != nil {
		panic(err)
	}
	router := httprouter.New()
	router.GET("/", app.Index)
	router.GET("/:org", app.Index)
	router.GET("/:org/:repo", app.Index)
	var port = os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Fatal(http.ListenAndServe(":"+port, router))
}
