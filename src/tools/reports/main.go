package main

import (
	"log/slog"

	"github.com/worming004/bar-accueil/src/tools/pocketproxy"
)

func main() {
	app := pocketproxy.BuildDefaultApp()
	err := app.Authenticate()
	slog.SetLogLoggerLevel(slog.LevelDebug)
	if err != nil {
		panic(err)
	}
}
