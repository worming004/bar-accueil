package store

import (
	"context"
	"github.com/volatiletech/authboss/v3"
)

type PsqlStorer struct{}

func NewPsqlStorer() *PsqlStorer {
	return &PsqlStorer{}
}

var storer authboss.ServerStorer = &PsqlStorer{}

// Load implements authboss.ServerStorer.
func (p *PsqlStorer) Load(ctx context.Context, key string) (authboss.User, error) {
	panic("unimplemented")
}

// Save implements authboss.ServerStorer.
func (p *PsqlStorer) Save(ctx context.Context, user authboss.User) error {
	panic("unimplemented")
}
