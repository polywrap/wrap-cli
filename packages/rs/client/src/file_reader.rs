pub trait FileReader {
  fn read_file(&self, file_path: &str) -> Result<Vec<u8>, std::io::Error>;
}

pub struct BaseFileReader {}

impl FileReader for BaseFileReader {
  fn read_file(&self, file_path: &str) -> Result<Vec<u8>, std::io::Error> {
    let contents = std::fs::read(file_path)?;
    Ok(contents)
  }
}