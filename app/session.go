package app

import (
	"github.com/gorilla/sessions"
	"net/http"
)

func (app *App) SetupSessionStore() {
	store := sessions.NewCookieStore([]byte(app.Secret))
	app.SessionStore = store
}

func (app *App) GetSession(r *http.Request) *sessions.Session {
	session, _ := app.SessionStore.Get(r, "__wlsess")
	return session
}
