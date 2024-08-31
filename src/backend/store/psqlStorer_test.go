package store

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPsqlStorer(t *testing.T) {
	pstorer := NewPsqlStorer()

	assert.NotNil(t, pstorer)

	user, err := pstorer.Load(context.Background(), "test")
	assert.Nil(t, err)
	assert.NotNil(t, user)
}
