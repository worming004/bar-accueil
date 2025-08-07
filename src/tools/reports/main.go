package main

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/worming004/bar-accueil/src/tools/pocketproxy"
)

func main() {
	app := pocketproxy.BuildDefaultApp()
	err := app.Authenticate()
	slog.SetLogLoggerLevel(slog.LevelDebug)
	if err != nil {
		panic(err)
	}

	http.Handle("/report", ReportHandler{App: app})
	http.ListenAndServe(":9000", nil)
}

type ReportHandler struct {
	*pocketproxy.App
	latestReport string
}

func (rh ReportHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	report, err := rh.GenerateReport()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("Failed to generate report", "error", err)
	}

	json.NewEncoder(w).Encode(report)
}

func (rh ReportHandler) GenerateReport() (pocketproxy.DailyReport, error) {
	return rh.GetDailyData()
}
