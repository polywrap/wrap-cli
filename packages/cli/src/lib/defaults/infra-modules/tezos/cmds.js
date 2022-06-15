const CMDS = {
    up: `docker-compose up --detach`,
    down: `docker-compose down`,
    accounts: `docker container exec TEZOS_POLYWRAP_SANDBOX "/bin/sh" tezos-test-env.sh accounts`
}

module.exports = CMDS