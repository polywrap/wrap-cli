use crate::Context;
use std::io::Cursor;

#[derive(Debug)]
pub struct DataView {
    pub(crate) buffer: Cursor<Vec<u8>>,
    pub(crate) context: Context,
}

impl DataView {
    pub fn new(buf: &[u8], context: Context) -> Result<Self, String> {
        Ok(Self {
            buffer: Cursor::new(buf.to_vec()),
            context,
        })
    }

    pub fn get_buffer(&self) -> Vec<u8> {
        self.buffer.clone().into_inner()
    }

    pub fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
