package e2e

cases: {
  $0: {
    data: 2,
    error?: _|_, // Never fails
  }
  case1: {
    $0: {
      data: 3,
      error?: _|_,
    }
    case12: {
		  $0: {
			  data: 4,
			  error?: _|_,
		  }
		}
	}
   case2: {
    $0: {
      data: 4,
      error?: _|_,
    }
  }
}

