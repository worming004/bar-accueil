package pocketproxy

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/shopspring/decimal"
)

type DailyItems struct {
	ID    string         `json:"id"`
	Name  string         `json:"name"`
	Count int            `json:"count"`
	Date  PocketBaseDate `json:"date"`
}
type SingleDayReport struct {
	TotalCount decimal.Decimal `json:"totalAmount"`
	DailyItems []DailyItems    `json:"dailyItems"`
}
type DailyReport struct {
	SingleDayReports map[PocketBaseDate]*SingleDayReport
}
type ServerResponse struct {
	Items []DailyItems `json:"items"`
}

func (a *App) GetDailyData() (DailyReport, error) {
	result := DailyReport{}
	request := a.DefaultDailyRequest()
	client := http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return DailyReport{}, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("Failed to fetch data", "status", resp.StatusCode)
		return DailyReport{}, fmt.Errorf("failed to fetch data, status code: %d", resp.StatusCode)
	}

	reports := ServerResponse{}

	err = json.NewDecoder(resp.Body).Decode(&reports)
	if err != nil {
		slog.Error("Failed to decode JSON response", "error", err)
		return DailyReport{}, err
	}

	fillReportWithDailyItems(&result, reports.Items)
	return result, nil
}

func fillReportWithDailyItems(r *DailyReport, items []DailyItems) {
	if r.SingleDayReports == nil {
		r.SingleDayReports = make(map[PocketBaseDate]*SingleDayReport)
	}

	for _, item := range items {
		if _, ok := r.SingleDayReports[item.Date]; !ok {
			r.SingleDayReports[item.Date] = &SingleDayReport{}
		}

		singleDayReport := r.SingleDayReports[item.Date]
		singleDayReport.DailyItems = append(singleDayReport.DailyItems, item)
		r.SingleDayReports[item.Date] = singleDayReport
	}
}

func (a *App) DefaultDailyRequest() *http.Request {
	request, err := http.NewRequest("GET", a.Server+"/api/collections/orders_per_day/records", nil)
	if err != nil {
		panic(err)
	}

	request.Header.Add("Authorization", "Bearer "+a.Token)

	return request
}
