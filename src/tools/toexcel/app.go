package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
)

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
	request, err := http.NewRequest("GET", "https://pocketbase.bar.craftlabit.be/api/collections/paiement/records?perPage=40&sort=-id", nil)
	if err != nil {
		panic(err)
	}
	request.Header.Add("Authorization", "Bearer "+a.Token)

	return request
}

func (a *App) getData() ([]Item, error) {
	getPerPage := func(page int) (Response, error) {
		request := a.defaultRequest()
		u, err := url.Parse(request.URL.String() + "&page=" + strconv.Itoa(page))
		if err != nil {
			return Response{}, err
		}
		request.URL = u
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

	grandTotal := 0
	pageCounter := 1
	res := []Item{}

	for {
		response, err := getPerPage(pageCounter)
		if err != nil {
			return nil, err
		}
		fmt.Printf("Page %d/%d. Len: %d\n", pageCounter, response.TotalPages, len(response.Items))
		printIfFound(response, "00z8")
		pageCounter++
		grandTotal = response.TotalItems
		res = append(res, response.Items...)
		if grandTotal <= len(res) {
			break
		}
	}

	return res, nil
}
func buildDefaultApp() *App {
	app := App{}
	user := os.Getenv("USER")
	pass := os.Getenv("PASS")
	app.Auth = Auth{User: user, Pass: pass}
	return &app
}

func printIfFound(r Response, id string) {
	for _, item := range r.Items {
		if strings.HasPrefix(item.ID, id) {
			fmt.Printf("%+v\n", item)
			return
		}
	}
}
