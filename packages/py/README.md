# Polywrap Python Client
[Polywrap](https://polywrap.io) is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.

This Python client enables the execution of WebAssembly Polywrappers *(or just "wrappers") on a python environment. It is built from the functionality of the JavaScript Polywrap Client, which at the moment is further ahead in development and might have additional capabilities than this Python MVP client.

In the future, the Polywrap DAO will continue improving this client to reach feature parity with the JS client, as well as the possibiity of creating WASM wrappers with Python code.

## What WASM wrappers can you execute today?

Check these resources to browse a variety available wrappers, for DeFi, decentralised storage, and other development utilites:

- [Wrappers.io](https://wrappers.io/)
- [Polywrap Integrations Repository](https://github.com/polywrap/integrations)

# Example call

Calling a function of a wrapper from the python client is as simple as creating a file in the `xxx` directory, importing the Polywrap Python Client, calling the Uri where the WASM wrapper is hosted, and specifying any required arguments.

```python
# filename.py
import Client from polywrap-core

async def update_ethereum_contract():
    Client.invoke({'uri': Uri('wrap://ens/ethereum.polywrap.eth'),
        'args':''
        'env'})

if __name__ == "__main__":
    pass
```


# Working Features


| Feature | Python | Javascript |
| -- | -- | -- |
| Invoke wrappers | yes | yes |
| Types | | |
| Asyncify|replaced with wasmtime | yes |
| UriResolution | | |
| MsgPack| yes, tested 100% | yes |
| Subinvoke | not yet implemented | |
| Utils | | |
| tests | wip | |
|e2e tests | tbd | no |


# Pre-reqs

- `python 3.10` -> To make sure you're running the correct version of python, run: `which python3`

- `poetry 1.2.1` -> Learn more [here](ttps://python-poetry.org/)

- `pytest 7.1.3` -> Read the [docs](https://docs.pytest.org/en/7.1.x/contents.html)
## Get started with Polywrap's python client

1. Clone the repository
- `git clone https://github.com/polywrap/toolchain.git`

2. poetry

poetry shell to start env

poetry install

## Running Tests 

The project uses [pytest](#) as a testing framework.

Right now you can test the `polywrap-msgpack` and `polywrap-core` modules.

To run the tests locally, from the terminal `cd` into the appropriate folder and run this command

 - `poetry run pytest`


## Contributing
Learn more [here](https://github.com/polywrap/toolchain#contributing)

## Contact Us:
[Join our discord](https://discord.polywrap.io) and ask your questions right away!


# Resources
[Polywrap Documentation](https://docs.polywrap.io)
[Polywrap Integrations Repository](https://github.com/polywrap/integrations)
[Building tests with Pytest](https://realpython.com/pytest-python-testing/)
[Running operations concurrently with python's asyncio](https://realpython.com/async-io-python/#the-10000-foot-view-of-async-io)
[Intro Video](TODO)