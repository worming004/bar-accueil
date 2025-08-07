package pocketproxy

import (
	"strings"
	"time"

	"github.com/shopspring/decimal"
)

type Auth struct {
	User  string
	Pass  string
	Token string
}
type App struct {
	Auth
	PerPage int
	Server  string
}

type Token struct {
	Name         string          `json:"name"`
	DisplayColor string          `json:"displayColor"`
	Shape        string          `json:"shape"`
	Value        decimal.Decimal `json:"value"`
}
type Data struct {
	ItemWithCount []struct {
		Name   string  `json:"name"`
		Tokens []Token `json:"tokens"`
		Count  int     `json:"count"`
	} `json:"itemWithCount"`
	IsElectronique bool            `json:"isElectronique"`
	IsCash         bool            `json:"isCash"`
	CashReceived   decimal.Decimal `json:"cashReceived"`
	CashToGiveBack decimal.Decimal `json:"cashToGiveBack"`
	Amount         decimal.Decimal `json:"amount"`
	ID             int             `json:"id"`
}

type PocketBaseTime struct {
	time.Time
}

func (ct *PocketBaseTime) UnmarshalJSON(b []byte) error {
	str := strings.Trim(string(b), `"`)
	parsedTime, err := time.Parse("2006-01-02 15:04:05.999Z", str)
	if err != nil {
		return err
	}
	ct.Time = parsedTime
	return nil
}

type Item struct {
	Data
	ID             string         `json:"id"`
	CollectionID   string         `json:"collectionId"`
	CollectionName string         `json:"collectionName"`
	Created        string         `json:"created"`
	Updated        string         `json:"updated"`
	OrderDate      PocketBaseTime `json:"orderDate"`
}
type Response struct {
	Page       int    `json:"page"`
	PerPage    int    `json:"perPage"`
	TotalPages int    `json:"totalPages"`
	TotalItems int    `json:"totalItems"`
	Items      []Item `json:"items"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  struct {
		Id    string `json:"id"`
		Email string `json:"email"`
	} `json:"user"`
}
