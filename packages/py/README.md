![Public Release Announcement](https://user-images.githubusercontent.com/5522128/177473887-2689cf25-7937-4620-8ca5-17620729a65d.png)

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

- `python 3.10` -> Make sure you're running the correct version of python by running: `which python3`

- `poetry 1.2.1` -> To make sure you're it's installed properly, run `poetry`; learn more [here](https://python-poetry.org/docs/)
  
- `result` -> `pip3 install result` 
  

## Running the Python Client Locally

1. Clone the repository
   - `git clone https://github.com/polywrap/toolchain.git`

2. Use the `cd` command to navigate into the `toolchain/packages/py/` subfolder and select the module you want to use. In this case we'll check `polywrap-msgpack` From there, leverage `poetry` to install all the additional dependencies.
   - `cd ./toolchain/packages/py/polywrap-msgpack`
   - `poetry shell` to start env
   - `poetry install`

This should take a couple of seconds to execute, and when it's done you should be ready to use the module.

## Running Tests 

In order to assure the integrity of the modules Polywrap Python Client uses [pytest 7.1.3](https://docs.pytest.org/en/7.1.x/contents.html) as a testing framework.

To run the tests locally, from the terminal `cd` into the appropriate module, for example `./toolchain/packages/py/polywrap-wasm` or `./toolchain/packages/py/polywrap-client`, and run this command:
 - `poetry shell` to start env
 - `poetry install` to have all dependencies locally
 - `poetry run pytest` to test your module 

This last command will run a series of scripts that verify that the specific module of the client is performing as expected in your local machine. The output on your console should look something like this:

```c
$ poetry run pytest
>>
================================= test session starts =================================
platform darwin -- Python 3.10.0, pytest-7.1.3, pluggy-1.0.0
rootdir: /Users/robertohenriquez/pycode/polywrap/toolchain/packages/py, configfile: pytest.ini
collected 26 items                                                                    

tests/test_msgpack.py ..........................                                [100%]
```

You should expect to see the tests passing with a 100% accuracy. To better understand and read these outputs, check [this quick guide](https://docs.pytest.org/en/7.1.x/how-to/output.html)

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
from polywrap_client import PolywrapClient
from polywrap_core import Uri, InvokerOptions

async def get_eth_transactions(accountAddress):
    client = PolywrapClient()
    #uri = Uri("wrap://ens/defiwrapper.polywrap.eth")
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrap.wasm").absolute()}')
    args = {
        "accountAddress": "'0x123EtherumAddress12312'"
    }
    options = InvokerOptions(uri=uri, method="simpleMethod", args=args, encode_result=False)
    result = await client.invoke(options)
    return result.result

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
