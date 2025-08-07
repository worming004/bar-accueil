package main

import (
	"log/slog"
	"os"

	"github.com/worming004/bar-accueil/src/tools/pocketproxy"
)

func main() {
	app := pocketproxy.BuildDefaultApp()
	err := app.Authenticate()
	slog.SetLogLoggerLevel(slog.LevelDebug)
	if err != nil {
		panic(err)
	}
	response, err := app.GetCompleteData()
	if err != nil {
		panic(err)
	}

	fl := denormalize(response)
	f, err := os.OpenFile("output.csv", os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	toCsv(f, fl)
}
