package main

import (
	"os"
)

func main() {
	app := buildDefaultApp()
	err := app.auth()
	if err != nil {
		panic(err)
	}
	response, err := app.getData()
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
