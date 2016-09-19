package app

import (
	"errors"
	"github.com/garyburd/redigo/redis"
	"os"
	"time"
)

func (app *App) SetupRedis() error {
	if url := os.Getenv("REDIS_URL"); url != "" {
		conn, err := redis.DialURL(url)
		if err != nil {
			return err
		}
		app.RedisConn = conn
		return nil
	} else {
		conn, err := redis.DialTimeout("tcp", ":6379", 0, 1*time.Second, 1*time.Second)
		if err != nil {
			return err
		}
		app.RedisConn = conn
		return nil
	}
	return errors.New("Could not connect to Redis")
}
