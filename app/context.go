package app

import (
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/sessions"
	"net/http"
)

const SiteDescription = "A tiny app that protects mistakenly merging pull requests in progress"
const SiteTitle = "Wiplock"

type Context struct {
	AccessToken     string
	BodyClassName   string
	JavaScriptPath  string
	RedisConn       redis.Conn
	Request         *http.Request
	Session         *sessions.Session
	SiteDescription string
	SiteTitle       string
	LockStoreKey    string
}

func (app *App) CreateContext(r *http.Request) *Context {
	ctx := &Context{
		JavaScriptPath:  app.GetJavaScriptPath(),
		LockStoreKey:    app.LockStoreKey,
		RedisConn:       app.RedisConn,
		Request:         r,
		Session:         app.GetSession(r),
		SiteDescription: SiteDescription,
		SiteTitle:       SiteTitle,
	}
	ctx.AccessToken = ctx.GetAccessToken()
	if ctx.AccessToken == "" {
		ctx.BodyClassName = "signin"
	}
	return ctx
}

func (context *Context) GetAccessToken() string {
	if token, ok := context.Session.Values["token"].(string); ok {
		return token
	}
	return ""
}

func (context *Context) GetHookURL() string {
	return "https://" + context.Request.Host + "/hooks"
}

func (context *Context) SetAccessToken(token string, w http.ResponseWriter) error {
	context.Session.Values["token"] = token
	return context.Session.Save(context.Request, w)
}
