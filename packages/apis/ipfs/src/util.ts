export function encodeURIComponent(str: string): string {
    var hexDigits = '0123456789ABCDEF';
    var ret = '';
    for( var i=0; i<str.length; i++ ) {
        var c = str.charCodeAt(i);
        if( (c >= 48/*0*/ && c <= 57/*9*/) ||
            (c >= 97/*a*/ && c <= 122/*z*/) ||
            (c >= 65/*A*/ && c <= 90/*Z*/) ||
            c == 45/*-*/ || c == 95/*_*/ || c == 46/*.*/ || c == 33/*!*/ || c == 126/*~*/ ||
            c == 42/***/ || c == 92/*\\*/ || c == 40/*(*/ || c == 41/*)*/ ) {
                ret += str[i];
        }
        else {
            ret += '%';
            ret += hexDigits[ (c & 0xF0) >> 4 ];
            ret += hexDigits[ (c & 0x0F) ];
        }
    }
    return ret;
  };