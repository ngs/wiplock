package app

import (
	"crypto/md5"
	"encoding/hex"
)

func GetAssetHash() (string, error) {
	data, err := Asset("assets/build/bundle.js")
	if err != nil {
		return "", err
	}
	h := md5.Sum(data)
	return hex.EncodeToString(h[:]), nil
}
