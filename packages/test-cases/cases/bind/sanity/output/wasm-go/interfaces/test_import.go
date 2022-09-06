package interfaces

import "github.com/consideritdone/polywrap-go/polywrap"

func TestImportImplementations() []string {
	return polywrap.WrapGetImplementations("testimport.uri.eth")
}
