package main

import (
	"github.com/ngs/wiplock/app"
)

func main() {
	if _, err := app.Run(); err != nil {
		panic(err)
	}
}
