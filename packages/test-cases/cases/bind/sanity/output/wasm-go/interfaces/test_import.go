package interfaces

import "github.com/polywrap/go-wrap/polywrap"

func TestImportImplementations() []string {
	return polywrap.WrapGetImplementations("testimport.uri.eth")
}
