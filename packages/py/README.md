# Polywrap Python Client
[Polywrap](https://polywrap.io) is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.
This client enables the execution of WebAssembly Polywrappers *(or just "wrappers") on a python environment.

## To see a list of available WASM wrappers: [wrappers.io](https://wrappers.io/)

Calling a function of a wrapper from the python client:
```python
import Client from polywrap-core

async def update_ethereum_contract():
    Client.invoke({'uri': Uri('wrap://ens/ethereum.polywrap.eth'),
        'args':''
        'env'})
```


# Working Features

| feature | python | javascript |
| -- | -- | -- |
| invoke | yes | yes |
|types|||
|asyncify|replaced with wasmtime|yes|
|uri resolution|||
|msgpack|yes, tested|yes|
|subinvoke|||
|utils|||
|tests|wip||
|e2e tests|tbd|no|


### Pre-reqs
`python 3.10`
`poetry` -> https://python-poetry.org/
`pytest` -> https://docs.pytest.org/en/7.1.x/contents.html
## Get started

`git clone https://github.com/polywrap/toolchain.git`
poetry
poetry shell to start env
poetry install

## Running Tests 

The project uses [pytest](#) as a testing framework.
To run the tests locally, from the terminal `cd` into the appropriate folder and runthis command
 - `poetry run pytest`


## Contributing
Learn more [here](https://github.com/polywrap/toolchain#contributing)

## Contact Us:
[Join our discord](https://discord.polywrap.io) and ask your questions right away!


# Resources
[Building tests with Pytest](https://realpython.com/pytest-python-testing/)
[Running operations concurrently with python's asyncio](https://realpython.com/async-io-python/#the-10000-foot-view-of-async-io)
[Intro Video](TODO)