package types

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

type Env struct {
	Prop    string
	OptProp *string
	OptMap  map[string]*int32
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
