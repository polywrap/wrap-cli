pub mod wrap;
use wrap::{
    *,
    imported::{
        ArgsGetFile, ArgsTryResolveUri,
    }
};

pub fn try_resolve_uri(args: ArgsTryResolveUri, _env: Option<Env>) -> Option<UriResolverMaybeUriOrManifest> {
    if args.authority != "test" {
        return None;
    }
  
    match args.path.as_str() {
        "from" => Some(UriResolverMaybeUriOrManifest {
            manifest: None,
            uri: Some("test/to".to_string())
        }),
        "package" => Some(UriResolverMaybeUriOrManifest {
            manifest: Some(vec![0]),
            uri: None
        }),
        "error" => panic!("Test error"),
        _ => None
    }
}

pub fn get_file(_args: ArgsGetFile, _env: Option<Env>) -> Option<Vec<u8>> {
    return None;
}
