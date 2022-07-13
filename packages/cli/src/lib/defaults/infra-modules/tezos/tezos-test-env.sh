#!/bin/sh

# declare enviroment variables with default values
BLOCK_TIME=${TEZOS_POLYWRAP_BLOCK_TIME:-5}
PROTOCOL="${TEZOS_POLYWRAP_PROTOCOL:-Jakarta}"
ROOT_PATH="${TEZOS_POLYWRAP_ROOT_PATH:-/tmp/mini-net}"

export bob="$(flextesa key bob)"
export alice="$(flextesa key alice)"

# flextesa startup script 
startup() {
    echo "starting tezos node with protocol ${PROTOCOL} ...."
    flextesa mini-net \
        --root "$ROOT_PATH" --size 3 "$@" \
        --set-history-mode N000:archive \
        --number-of-b 1 \
        --balance-of-bootstrap-accounts tez:100_000_000 \
        --time-b "$BLOCK_TIME" \
        --add-bootstrap-account="$bob@2_000_000_000_000" \
        --add-bootstrap-account="$alice@2_000_000_000_000" \
        --no-daemons-for=bob \
        --no-daemons-for=alice \
        --until-level 200_000_000 \
        --protocol-kind "$PROTOCOL"
}

# get bootstrapped accounts
accounts() {
    cat >&2 <<EOF
$(echo $bob)
$(echo $alice)
EOF
}

"$@"