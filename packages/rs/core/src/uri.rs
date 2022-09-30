struct Uri {
    authority: String;
    path: String;
    uri: String;
}

impl Uri {
    pub fn new(uri: String) -> Self {
        Uri::from_string(uri)
    }

    // TODO: compare uri === uri

    pub fn from_string(uri: String) -> Uri {
        // TODO: parse string
    }

    pub fn to_string(&self) -> String {
        self.uri
    }
}

impl From<String> for Uri {
    fn from(uri: String) -> Self {
        Uri::from_string(uri)
    }
}

impl Into<String> for Uri {
    fn into(self) -> String {
        self.to_string()
    }
}

impl std::fmt::Display for Uri {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", self.uri)
    }
}
