package main

import (
	"encoding/csv"
	"io"
	"log/slog"
	"strconv"
	"time"

	"github.com/shopspring/decimal"
	"github.com/worming004/bar-accueil/src/tools/pocketproxy"
)

type Flat struct {
	FlatID    int
	ID        string
	OrderDate string

	IsElectronique    bool
	IsCash            bool
	CashReceived      decimal.Decimal
	CashToGiveBack    decimal.Decimal
	TransactionAmount decimal.Decimal

	ItemName         string
	ItemAmount       decimal.Decimal
	SingleItemAmount decimal.Decimal
	Count            int
}

func denormalize(items []pocketproxy.Item) []Flat {
	counter := 0
	res := []Flat{}
	loc, err := time.LoadLocation("Europe/Brussels")
	if err != nil {
		panic(err)
	}
	for _, item := range items {
		for _, token := range item.Data.ItemWithCount {
			f := Flat{
				FlatID:            counter,
				ID:                item.ID,
				OrderDate:         item.OrderDate.In(loc).Format(time.Layout),
				IsElectronique:    item.IsElectronique,
				IsCash:            item.IsCash,
				CashReceived:      item.CashReceived,
				CashToGiveBack:    item.CashToGiveBack,
				TransactionAmount: item.Amount,
				ItemName:          token.Name,
				ItemAmount:        amountOnTokens(token.Tokens, token.Count),
				SingleItemAmount:  amountOnTokens(token.Tokens, 1),
				Count:             token.Count,
			}
			res = append(res, f)
			counter++
		}
	}

	return res
}

func amountOnTokens(ts []pocketproxy.Token, count int) decimal.Decimal {
	res := decimal.Zero
	for _, t := range ts {
		res = res.Add(t.Value)
	}
	res = res.Mul(decimal.NewFromInt(int64(count)))
	return res
}

func toCsv(w io.Writer, fl []Flat) {
	csvWriter := csv.NewWriter(w)
	slog.Debug("Writing CSV header")
	csvWriter.Write([]string{
		"FlatID",
		"OrderID",
		"Created",
		"IsElectronique",
		"IsCash",
		"CashReceived",
		"CashToGiveBack",
		"TransactionAmount",
		"ItemName",
		"ItemAmount",
		"SingleItemAmount",
		"Count",
	})
	slog.Debug("will start write lines", "LINES", len(fl))
	for _, f := range fl {
		slog.Debug("Writing flat", "ID", f.ID)
		csvWriter.Write([]string{
			strconv.Itoa(f.FlatID),
			f.ID,
			f.OrderDate,
			strconv.FormatBool(f.IsElectronique),
			strconv.FormatBool(f.IsCash),
			f.CashReceived.String(),
			f.CashToGiveBack.String(),
			f.TransactionAmount.String(),
			f.ItemName,
			f.ItemAmount.String(),
			f.SingleItemAmount.String(),
			strconv.Itoa(f.Count),
		})
	}
	csvWriter.Flush()
}
