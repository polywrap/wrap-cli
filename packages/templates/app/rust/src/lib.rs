mod wrap;

use polywrap::ByteBuf;
use wrap::types::*;

pub fn main() {
    let ipfs_provider = "http://localhost:5001";
    let data = "hello world";
    let ipfs = IpfsModule::new(None, None, None);
    let ipfs_add_result = ipfs.add_file(&IpfsModuleArgsAddFile{
      data: IpfsFileEntry {
          name: "hello.txt".to_string(),
          data: ByteBuf::from(data.as_bytes().to_vec()),
      },
      ipfs_provider: ipfs_provider.to_string(),
      timeout: None,
      add_options: None
    }, None, None, None).unwrap();

    let cid = ipfs_add_result.hash;

    let data = ipfs.cat(&IpfsModuleArgsCat{
      cid: cid.clone(),
      ipfs_provider: ipfs_provider.to_string(),
      timeout: None,
      cat_options: None
    }, None, None, None).unwrap();

    assert_eq!(data, ByteBuf::from("hello world".as_bytes().to_vec()));
}

#[cfg(test)]
mod client_tests {

  #[test]
  fn test_client() {
    super::main();
  }
}
