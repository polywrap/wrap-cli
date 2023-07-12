package interfaces

import "github.com/polywrap/go-wrap/wrap"

func TestImportImplementations() []string {
	return wrap.WrapGetImplementations("testimport.uri.eth")
}
