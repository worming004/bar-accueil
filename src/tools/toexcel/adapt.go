package main

import (
	"encoding/csv"
	"io"
	"strconv"

	"github.com/shopspring/decimal"
)

type Flat struct {
	FlatID  int
	ID      string
	Created string

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

func denormalize(items []Item) []Flat {
	counter := 0
	res := []Flat{}
	for _, item := range items {
		for _, token := range item.Data.ItemWithCount {
			f := Flat{
				FlatID:            counter,
				ID:                item.ID,
				Created:           item.Created,
				IsElectronique:    item.Data.IsElectronique,
				IsCash:            item.Data.IsCash,
				CashReceived:      item.Data.CashReceived,
				CashToGiveBack:    item.Data.CashToGiveBack,
				TransactionAmount: item.Data.Amount,
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

func amountOnTokens(ts []Token, count int) decimal.Decimal {
	res := decimal.Zero
	for _, t := range ts {
		res = res.Add(t.Value)
	}
	res = res.Mul(decimal.NewFromInt(int64(count)))
	return res
}

func toCsv(w io.Writer, fl []Flat) {
	csvWriter := csv.NewWriter(w)
	csvWriter.Write([]string{
		"FlatID",
		"ID",
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
	for _, f := range fl {
		csvWriter.Write([]string{
			strconv.Itoa(f.FlatID),
			f.ID,
			f.Created,
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
