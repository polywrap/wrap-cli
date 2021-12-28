use std::convert::TryInto;

/// FFI representation for function result type.
///
/// [`wasm_result`] effectively has three variants:
///
/// - Error variant.
/// - Receipt variant.
/// - No data, just okay state.
///
/// Please note that [`wasm_result`] implements [`std::ops::Try`], so you can
/// effectively use `?` everywhere and it will automatically return a
/// [`wasm_result::new_error()`] if necessary.
///
/// # Memory management
///
/// All [`wasm_result`] instances allocate memory using the system allocator,
/// so it's very easy to free contents from C and other languages.
///
/// ```c, no_run
/// free(result->receipt);
/// free(result->error);
/// ```
#[allow(non_camel_case_types)]
#[derive(Debug, Clone, PartialEq, Eq)]
#[repr(C)]
pub struct wasm_result {
    receipt: *mut u8,
    error: *mut u8,
    buf_size: u32,
}

impl wasm_result {
    /// A successful [`wasm_result`], with neither a receipt nor error information.
    pub const OK: Self = Self {
        receipt: std::ptr::null_mut(),
        error: std::ptr::null_mut(),
        buf_size: 0,
    };

    /// Creates a new [`wasm_result`] which contains an error.
    pub fn new_error(data: &[u8]) -> Self {
        let mut new_data = Vec::with_capacity(data.len());
        new_data.extend_from_slice(data);

        Self {
            receipt: std::ptr::null_mut(),
            error: new_data.leak().as_mut_ptr(),
            buf_size: data.len().try_into().unwrap(),
        }
    }

    /// Creates a new [`wasm_result`] which contains a receipt.
    pub fn new_receipt(data: &[u8]) -> Self {
        let mut new_data = Vec::with_capacity(data.len());
        new_data.extend_from_slice(data);

        Self {
            receipt: new_data.leak().as_mut_ptr(),
            error: std::ptr::null_mut(),
            buf_size: data.len().try_into().unwrap(),
        }
    }

    /// Panics if `self` contains an error. If it doesn't, either returns
    /// [`None`] if there is no receipt or a [`Some`] with the receipt.
    pub fn unwrap(self) -> Option<Vec<u8>> {
        if self.error.is_null() && self.receipt.is_null() {
            None
        } else if self.error.is_null() {
            Some(unsafe {
                Vec::from_raw_parts(self.receipt, self.buf_size as usize, self.buf_size as usize)
            })
        } else {
            let err_bytes =
                unsafe { std::slice::from_raw_parts(self.error, self.buf_size as usize) };
            panic!("Error: {}", std::str::from_utf8(err_bytes).unwrap());
        }
    }

    /// Returns [`Some(bytes)`] if and only if `self` is a receipt.
    pub fn receipt(&self) -> Option<&[u8]> {
        if !self.receipt.is_null() {
            unsafe {
                Some(std::slice::from_raw_parts(
                    self.receipt,
                    self.buf_size as usize,
                ))
            }
        } else {
            None
        }
    }

    /// Returns whether `self` is either a receipt or simply equal to
    /// [`wasm_result::OK`].
    ///
    /// # Examples
    ///
    /// ```rust
    /// use polywrap_wasm_rs::wasm_result;
    ///
    /// assert!(wasm_result::OK.is_ok());
    /// ```
    pub fn is_ok(&self) -> bool {
        self.error.is_null()
    }

    /// Returns whether `self` is not equal to [`wasm_result::OK`].
    ///
    /// # Examples
    ///
    /// ```rust
    /// use polywrap_wasm_rs::wasm_result;
    ///
    /// assert!(!wasm_result::OK.is_err());
    /// assert!(wasm_result::new_error(b"err foobar").is_err());
    /// ```
    pub fn is_err(&self) -> bool {
        !self.is_ok()
    }
}

impl std::ops::Drop for wasm_result {
    fn drop(&mut self) {
        let len = self.buf_size as usize;
        unsafe {
            let _error = Vec::from_raw_parts(self.error, len, len);
            let _receipt = Vec::from_raw_parts(self.receipt, len, len);
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_receipt() {
        assert_eq!(
            wasm_result::new_receipt(b"foobar").receipt().unwrap(),
            b"foobar"
        );
    }
}
