package app

import (
	"github.com/gorilla/sessions"
	"net/http"
)

const SiteDescription = "A tiny app that protects mistakenly merging pull requests in progress"
const SiteTitle = "Wiplock"

type Context struct {
	AccessToken     string
	SiteDescription string
	SiteTitle       string
	JavaScriptPath  string
	Request         *http.Request
	Session         *sessions.Session
}

func (app *App) CreateContext(r *http.Request) *Context {
	ctx := &Context{
		JavaScriptPath:  app.GetJavaScriptPath(),
		Request:         r,
		Session:         app.GetSession(r),
		SiteDescription: SiteDescription,
		SiteTitle:       SiteTitle,
	}
	ctx.AccessToken = ctx.GetAccessToken()
	return ctx
}

func (context *Context) GetAccessToken() string {
	if token, ok := context.Session.Values["token"].(string); ok {
		return token
	}
	return ""
}

func (context *Context) SetAccessToken(token string, w http.ResponseWriter) error {
	context.Session.Values["token"] = token
	return context.Session.Save(context.Request, w)
}
