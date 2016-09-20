package app

import (
	"errors"
	"github.com/garyburd/redigo/redis"
	"os"
	"time"
)

func (app *App) SetupRedis() error {

	connectTimeout := 1 * time.Second
	readTimeout := 1 * time.Second
	writeTimeout := 1 * time.Second

	if url := os.Getenv("REDIS_URL"); url != "" {
		conn, err := redis.DialURL(url,
			redis.DialConnectTimeout(connectTimeout),
			redis.DialReadTimeout(readTimeout),
			redis.DialWriteTimeout(writeTimeout))
		if err != nil {
			return err
		}
		app.RedisConn = conn
		return nil
	} else {
		conn, err := redis.Dial("tcp", ":6379",
			redis.DialConnectTimeout(connectTimeout),
			redis.DialReadTimeout(readTimeout),
			redis.DialWriteTimeout(writeTimeout))

		if err != nil {
			return err
		}
		app.RedisConn = conn
		return nil
	}
	return errors.New("Could not connect to Redis")
}
