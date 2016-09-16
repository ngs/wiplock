package app

import (
	"github.com/gorilla/sessions"
	"net/http"
)

const SiteDescription = "A tiny app that protects mistakenly merging pull requests in progress"
const SiteTitle = "Wiplock"

type Context struct {
	AssetHash       string
	BodyClass       string
	AccessToken     string
	SiteDescription string
	SiteTitle       string
	Request         *http.Request
	Session         *sessions.Session
}

func (app *App) CreateContext(r *http.Request) *Context {
	ctx := &Context{
		AssetHash:       app.AssetHash,
		Request:         r,
		Session:         app.GetSession(r),
		SiteDescription: SiteDescription,
		SiteTitle:       SiteTitle,
	}
	ctx.BodyClass = ctx.GetBodyClass()
	ctx.AccessToken = ctx.GetAccessToken()
	return ctx
}

func (context *Context) GetBodyClass() string {
	if context.GetAccessToken() == "" {
		return "guest"
	}
	return ""
}

func (context *Context) GetAccessToken() string {
	if token, ok := context.Session.Values["token"].(string); ok {
		return token
	}
	return ""
}
