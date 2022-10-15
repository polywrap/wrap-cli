#[derive(Default)]
pub struct InvokeState {
    pub result: Option<Vec<u8>>,
    pub error: Option<String>,
}

#[derive(Default)]
pub struct State {
    pub method: Vec<u8>,
    pub args: Vec<u8>,
    pub invoke: InvokeState,
}
