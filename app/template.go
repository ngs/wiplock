package app

import (
	"github.com/eknkc/amber"
	"html/template"
)

func NewTemplate() *template.Template {
	return amber.MustCompile(`!!! 5
html
  head
    title #{SiteTitle}
    meta[name="description"][content=SiteDescription]
    meta[content="width=device-width, initial-scale=1, maximum-scale=1"][name="viewport"]
    link[href="https://fonts.googleapis.com/css?family=Raleway"][rel="stylesheet"]
  body[class=BodyClassName]
    div#app-root[data-access-token=AccessToken]
    script[src=JavaScriptPath]
    `, amber.Options{PrettyPrint: false})
}
