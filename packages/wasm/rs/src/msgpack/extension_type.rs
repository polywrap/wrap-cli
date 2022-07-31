#[derive(Clone, Copy, Debug, PartialEq)]
pub enum ExtensionType {
    // must be in range 0-127
    GenericMap,
    Unknown(u8)
}

impl ExtensionType {
    pub fn from_u8(val: u8) -> ExtensionType {
        match val {
            1 => ExtensionType::GenericMap,
            _ => ExtensionType::Unknown(val)
        }
    }

    pub fn to_u8(&self) -> u8 {
        match *self {
            ExtensionType::GenericMap => 1,
            ExtensionType::Unknown(val) => val
        }
    }
}

impl std::fmt::Display for ExtensionType {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl From<u8> for ExtensionType {
    #[inline]
    fn from(val: u8) -> ExtensionType {
        ExtensionType::from_u8(val)
    }
}

impl Into<u8> for ExtensionType {
    #[inline]
    fn into(self) -> u8 {
        self.to_u8()
    }
}
