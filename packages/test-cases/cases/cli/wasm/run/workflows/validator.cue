package e2e

cases: {
  $0: {
    data: =~"^0x[A-Fa-f0-9]{40}$",
    error?: _|_, // Never fails
  }
  case1: {
    $0: {
      data: {
        txReceipt: =~"^0x[A-Fa-f0-9]{64}$",
        value: uint
      },
      error?: _|_,
    }
    $1: { 
      data: uint, 
      error?: _|_ 
    }
  }
}

