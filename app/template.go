package app

import (
	"github.com/eknkc/amber"
	"html/template"
)

func NewTemplate() *template.Template {
	return amber.MustCompile(`!!! 5
html
  head
    script[src="/assets/bundle-"+AssetHash+".js"]
    title #{SiteTitle}
    meta[name="description"][content=SiteDescription]
  body[class=BodyClass]
    #app-root`, amber.Options{PrettyPrint: false})
}
