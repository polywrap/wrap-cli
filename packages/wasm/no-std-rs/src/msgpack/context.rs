//! Context stores debug information in a stack, and
//! prints it in a clear format

use alloc::{
    fmt, format,
    string::{String, ToString},
    vec,
    vec::Vec,
};

#[derive(Clone, Debug, Default)]
pub struct Context<'a> {
    pub description: &'a str,
    nodes: Vec<Node>,
}

impl<'a> Context<'a> {
    pub fn new() -> Self {
        Self {
            description: "context description not set",
            nodes: vec![],
        }
    }

    pub fn is_empty(&self) -> bool {
        self.nodes.len() == 0
    }

    pub fn get_length(&self) -> i32 {
        self.nodes.len() as i32
    }

    pub fn push(&mut self, node_item: &str, node_type: &str, node_info: &str) {
        let node = Node {
            node_item: node_item.to_string(),
            node_type: node_type.to_string(),
            node_info: node_info.to_string(),
        };
        self.nodes.push(node);
    }

    pub fn pop(&mut self) {
        if self.is_empty() {
            panic!("Error: tried to pop an item from an empty Context stack");
        }
        let _ = self.nodes.pop();
    }

    pub fn context_to_string(&self) -> String {
        self.print_with_tabs(0, 2)
    }

    pub fn print_with_context(&self, message: &str) -> String {
        [message, "\n", &self.print_with_tabs(1, 0)].concat()
    }

    fn print_with_tabs(&self, tabs: i32, size: i32) -> String {
        let width = (tabs + 1) * size;
        let pad_start = format!("{:width$}", " ", width = width as usize);
        let pad_end = format!("\n{:width$}", " ", width = (width + 1) as usize);

        let mut result = String::new();
        result.push_str(&pad_start);

        let ctx = ["Context: ", self.description].concat();
        result.push_str(&ctx);

        if self.is_empty() {
            result.push_str(&pad_end);
            result.push_str("context stack is empty");
            return result;
        }
        let len = self.get_length() as usize;
        for i in (0..len).rev() {
            let node = &self.nodes[i];
            result.push_str(&pad_end);
            let msg = format!(
                "at {} : {} >> {}",
                node.node_item, node.node_type, node.node_info
            );
            result.push_str(&msg);
        }
        result
    }
}

#[allow(dead_code)]
#[derive(Clone, Debug, Default)]
pub struct Node {
    node_item: String,
    node_type: String,
    node_info: String,
}

impl<'a> fmt::Display for Context<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {:?})", self.description, self.nodes)
    }
}
