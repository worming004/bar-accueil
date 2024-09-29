package main

import (
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
type Item struct {
	ID             string `json:"id"`
	CollectionID   string `json:"collectionId"`
	CollectionName string `json:"collectionName"`
	Created        string `json:"created"`
	Updated        string `json:"updated"`
	Data           Data   `json:"data"`
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
