package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

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

type Data struct {
	ItemWithCount []struct {
		Name   string `json:"name"`
		Tokens []struct {
			Name         string          `json:"name"`
			DisplayColor string          `json:"displayColor"`
			Shape        string          `json:"shape"`
			Value        decimal.Decimal `json:"value"`
		} `json:"tokens"`
		Count int `json:"count"`
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

func (a *App) auth() error {
	requestBody, err := json.Marshal(map[string]string{
		"identity": a.User,
		"password": a.Pass,
	})
	if err != nil {
		return err
	}
	res, err := http.Post("https://pocketbase.bar.craftlabit.be/api/collections/users/auth-with-password", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var authResponse AuthResponse
	err = json.Unmarshal(body, &authResponse)
	if err != nil {
		return err
	}

	a.Token = authResponse.Token
	return nil
}

func (a *App) defaultRequest() *http.Request {
	request, err := http.NewRequest("GET", "https://pocketbase.bar.craftlabit.be/api/collections/paiement/records?perPage=10000", nil)
	if err != nil {
		panic(err)
	}
	request.Header.Add("Authorization", "Bearer "+a.Token)

	return request
}

func (a *App) getData() ([]Item, error) {
	getPerPage := func(page int) (Response, error) {
		request := a.defaultRequest()
		client := http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			return Response{}, err
		}
		defer resp.Body.Close()

		records := Response{}
		err = json.NewDecoder(resp.Body).Decode(&records)
		if err != nil {
			return Response{}, err
		}

		return records, nil
	}

	total := 0
	counter := 0
	res := []Item{}

	for {
		response, err := getPerPage(counter)
		if err != nil {
			return nil, err
		}
		total = response.TotalItems
		res = append(res, response.Items...)
		if total > len(res) {
			break
		}
	}

	return res, nil
}

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

	for _, record := range response {
		fmt.Printf("Id: %s, Data: %v\n", record.ID, record.Data)
	}

}

func buildDefaultApp() *App {
	app := App{}
	user := os.Getenv("USER")
	pass := os.Getenv("PASS")
	app.Auth = Auth{User: user, Pass: pass}
	return &app
}
