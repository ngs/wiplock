package app

import (
	"crypto/md5"
	"encoding/hex"
)

func (app *App) GetAssetHash() error {
	data, err := Asset("assets/build/bundle.js")
	if err != nil {
		return err
	}
	h := md5.Sum(data)
	app.AssetHash = hex.EncodeToString(h[:])
	return nil
}
