package interfaces

import "github.com/polywrap/go-wrap/wrap"

func TestImport_GetImplementations() []string {
	return wrap.WrapGetImplementations("testimport.uri.eth")
}
