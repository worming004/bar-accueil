package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/volatiletech/authboss/v3"
	"github.com/worming004/bar-accueil/backend/store"
)

func greet(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World! %s", time.Now())
}

func main() {
	ab := authboss.New()
	mux := http.NewServeMux()

	ab.Config.Storage.Server = store.NewPsqlStorer()
	// ab.Config.Storage.SessionState = mySessionImplementation
	// ab.Config.Storage.CookieState = myCookieImplementation
	//
	// ab.Config.Paths.Mount = "/authboss"
	// ab.Config.Paths.RootURL = "https://www.example.com/"
	//
	// // This is using the renderer from: github.com/volatiletech/authboss
	// ab.Config.Core.ViewRenderer = abrenderer.NewHTML("/auth", "ab_views")
	// // Probably want a MailRenderer here too.
	//
	// // This instantiates and uses every default implementation
	// // in the Config.Core area that exist in the defaults package.
	// // Just a convenient helper if you don't want to do anything fancy.
	// defaults.SetCore(&ab.Config, false, false)
	//
	// if err := ab.Init(); err != nil {
	// 	panic(err)
	// }

	mux.Handle("/authboss", http.StripPrefix("/authboss", ab.Config.Core.Router))

	mux.HandleFunc("/", greet)
	http.ListenAndServe(":8080", mux)
}
