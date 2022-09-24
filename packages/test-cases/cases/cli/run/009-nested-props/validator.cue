package e2e

cases: {
  $0: {
    data: {
    	value: 2
    },
    error?: _|_, // Never fails
  }
  case1: {
    $0: {
      data: 4,
      error?: _|_,
    }
	}
}

