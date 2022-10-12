rs![Public Release Announcement](https://user-images.githubusercontent.com/5522128/177473887-2689cf25-7937-4620-8ca5-17620729a65d.png)

# Polywrap Python Client

## [Polywrap](https://polywrap.io) is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.

# Working Features

This Python client enables the execution of WebAssembly Polywrappers *(or just "wrappers")* on a python environment. It is built from the functionality of the JavaScript Polywrap Client, which at the moment is more fleshed out and battle tested, as well as it might have additional capabilities than this Python MVP client.

In the future, the Polywrap DAO will continue improving this Python client to reach feature parity with the JS client, as well as the possibiity of creating WASM wrappers with Python code. 

Right now, you can see which features have been implemented on each language, and make the decision of which one to use for your project.

| Feature | Python | Javascript |
| -- | -- | -- |
| Invoke wrappers | yes | yes |
| Types | | |
| Asyncify | replaced with wasmtime | yes |
| UriResolution | | |
| MsgPack| yes, tested 100% | yes |
| Subinvoke | not yet implemented | |
| Utils | | |
| Tests | wip | |
| e2e Tests | tbd | no |
| Creating Plugins | no | yes |
| Creating Python Wrappers | no | yes |

# Getting Started

Have questions or want to get involved? Join our community [Discord](https://discord.polywrap.io) or [open an issue](https://github.com/polywrap/toolchain/issues) on Github.

For detailed information about Polywrap and the WRAP standard, visit our [developer documentation](https://docs.polywrap.io/).


## Pre-reqs

- `python 3.10` -> To make sure you're running the correct version of python, run: `which python3`

- `poetry 1.2.1` -> To make sure you're it's installed properly, run `poetry`. To learn more [here](ttps://python-poetry.org/)

- `pytest 7.1.3` -> Read the [docs](https://docs.pytest.org/en/7.1.x/contents.html)
  

## Running the python client  Locally

1. Clone the repository
   - `git clone https://github.com/polywrap/toolchain.git`

2. Use the `cd` command to navigate into the `/packages/py/` subfolder and use poetry to install all the additional dependencies.
   - `poetry shell to start env`
   - `poetry install`

## Running Tests 

The Polywrap Python Client uses [pytest](https://docs.pytest.org) as a testing framework.

> Right now you can test the `polywrap-msgpack` and `polywrap-core` modules.

To run the tests locally, from the terminal `cd` into the appropriate folder, for example `cd polywrap-msgpack`, and run this command:
 - `poetry run pytest`

This will run a series of scripts that verify that the specific module of the client is performing as expected in your local machine. The output on your console should look something like this:

```
$ poetry run pytest
>>
================================= test session starts =================================
platform darwin -- Python 3.10.0, pytest-7.1.3, pluggy-1.0.0
rootdir: /Users/robertohenriquez/pycode/polywrap/toolchain/packages/py, configfile: pytest.ini
collected 26 items                                                                    

tests/test_msgpack.py ..........................                                [100%]
```

You should expect to see the tests passing with a 100% accuracy.

If anything fails (F), or if there are any Warnings raised, you can debug them by running a verbose version of the test suite:
- `poetry run pytests -v` or `poetry run pytests -vv` for even more detail
- Reach out to the devs on the Discord explaining your situation, and what configuration you're using on your machine.


## What WASM wrappers can you execute today?

Check these resources to browse a variety available wrappers, for DeFi, decentralised storage, and other development utilites:

- [Wrappers.io](https://wrappers.io/)
- [Polywrap Integrations Repository](https://github.com/polywrap/integrations)

# Example call

Calling a function of a wrapper from the python client is as simple as creating a file in the `xxx TBD` directory, importing the Polywrap Python Client, calling the Uri where the WASM wrapper is hosted, and specifying any required arguments.

```python
# get_eth_txns.py
from polywrap-core import client 

portfolio_address = '0x123EtherumAddress12312'
options = TBD

async def get_eth_transactions(accountAddress):
    query_result = await client.invoke(
        uri="wrap://ens/defiwrapper.polywrap.eth",
        method="getTransactions",
        args={
            "accountAddress": accountAddress,
            "options": options,
            ...
        }
    );
    return query_result

if __name__ == "__main__":
    return get_eth_transactions(portfolio_address)
```

## Creating your own tests

    TODO: It is suggested to follow a TDD approach to build your own implementations. 

# Contributing

The Polywrap project is completely open-source and we welcome contributors of all levels. Learn more about how you can contribute [here](https://github.com/polywrap/toolchain#contributing).



# Contact Us:

[Join our discord](https://discord.polywrap.io) and ask your questions right away!


# Resources

- [Polywrap Documentation](https://docs.polywrap.io)
- [Polywrap Integrations Repository](https://github.com/polywrap/integrations)
- [Building tests with Pytest](https://realpython.com/pytest-python-testing/)
- [Running operations concurrently with python's asyncio](https://realpython.com/async-io-python/#the-10000-foot-view-of-async-io)
- [Intro Video](TODO)