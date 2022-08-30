package module

import (
	"bytes"

	"github.com/testorg/testrepo/wrap/types"
)

func BytesMethod(args *types.ArgsBytesMethod) []byte {
	return bytes.Join(
		[][]byte{
			args.Arg.Prop,
			[]byte("Sanity!"),
		},
		[]byte(" "),
	)
}
