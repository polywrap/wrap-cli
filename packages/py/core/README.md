
# Polywrap Python Package

[Polywrap](https://polywrap.io/#/) is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.

## Setup for building and testing
- Requirement: Python ^3.10
- If you are using a linux system or WSL, which comes with Python3.8, then you will need to upgrade Python3.8 to Python3.10 and also fix the pip and distutil as upgrading to Python3.10 will break them. You may follow [this guide](https://cloudbytes.dev/snippets/upgrade-python-to-latest-version-on-ubuntu-linux) to upgrade: 
- Clone the repo. 
```
git clone https://github.com/polywrap/toolchain
```
- Navigate to the python core package.
```
cd toolchain/packages/py/core
```
- We will be using [Poetry](https://python-poetry.org/docs/#installing-manually) for building and testing our packages. 

- Each of the package folders consists the pyproject.toml file and the poetry.lock file. In pyproject.toml file, one can find out all the project dependencies mentioned. These files will be utilized by Poetry to build and test the package.

- For example, we can build and test the core package using Poetry. 

- So next, create a virtual environment and install Poetry in the virtual environment: 
```
python3 -m venv venv
source venv/bin/activate

pip install -U pip setuptools
pip install poetry
```  

- Install dependencies using Poetry. 
```
poetry install
```
- As we can see in the pyproject.toml file, we installed [PyTest](https://docs.pytest.org/en/7.1.x/) package. We will be using the same as our testing framework. 
- Now we are ready to build and test the core package using Poetry and PyTest. 
```
poetry run pytest
```
- As we see the mentioned tests passing, we are ready to update and test the package. 
