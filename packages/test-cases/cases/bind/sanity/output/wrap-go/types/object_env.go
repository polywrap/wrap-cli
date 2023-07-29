package types

import (
	"github.com/polywrap/go-wrap/msgpack"
)

type Env struct {
	Prop    string `json:"prop"`
	OptProp *string `json:"optProp"`
	OptMap  map[string]*int32 `json:"optMap"`
}

func EnvToBuffer(value *Env) []byte {
	return serializeEnv(value)
}

func EnvFromBuffer(data []byte) *Env {
	return deserializeEnv(data)
}

func EnvWrite(writer msgpack.Write, value *Env) {
	writeEnv(writer, value)
}

func EnvRead(reader msgpack.Read) *Env {
	return readEnv(reader)
}
