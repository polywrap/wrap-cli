node ../../../../cli/bin/w3 test-env up
node ../../../../cli/bin/w3 build --ipfs http://localhost:5001 --test-ens rust-sanity.eth
node ../../../../cli/bin/w3 query ./recipes/e2e.json
node ../../../../cli/bin/w3 test-env down
