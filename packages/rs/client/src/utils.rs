pub fn index_of_array(source: &[u8], search: &[u8]) -> Option<usize> {
  let mut run = true;
  let mut start = 0;

  while run {
    let mut iterator = source.iter();

    while start > 0 {
      iterator.next();
      start -= 1;
    }

    let d = Value::from(5);

    let idx = iterator.position(|&r| r == search[0]);

    if idx.is_none() {
      run = false;
      continue;
    }

    let sub_buff = &source.clone()[idx.unwrap()..idx.unwrap() + search.len()];

    let mut retry = false;
    let mut i = 0;

    while i < search.len() && !retry {
      if sub_buff[i] != search[i] {
        retry = true;
      }

      i += 1;
    }

    if retry {
      start = idx.unwrap() + 1;
      continue;
    } else {
      return Some(idx.unwrap());
    }
  }

  None
}