package main

import (
	"github.com/eknkc/amber"
	"html/template"
)

func NewTemplate() *template.Template {
	return amber.MustCompile(`!!! 5
html
  head
    script[src="/assets/bundle-"+AssetHash+".js"]
    title Wiplock
    meta[name="description"][content="A tiny app that protects mistakenly merging pull requests in progress"]
  body
    #app-root`, amber.Options{PrettyPrint: false})
}
