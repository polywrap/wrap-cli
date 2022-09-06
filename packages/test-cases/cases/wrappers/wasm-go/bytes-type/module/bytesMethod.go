package module

import (
	"bytes"

	"github.com/testorg/testrepo/wrap/types"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build
func BytesMethod(args *types.MethodArgsBytesMethod) []byte {
	return bytes.Join(
		[][]byte{
			args.Arg.Prop,
			[]byte("Sanity!"),
		},
		[]byte(" "),
	)
}
