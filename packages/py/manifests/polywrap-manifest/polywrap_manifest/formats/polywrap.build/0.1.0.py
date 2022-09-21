# generated by datamodel-codegen:
#   filename:  0.1.0.json
#   timestamp: 2022-09-21T13:12:40+00:00

from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Extra, Field, constr


class Format(Enum):
    field_0_1_0 = '0.1.0'
    field_0_1 = '0.1'


class Buildx(BaseModel):
    class Config:
        extra = Extra.forbid

    cache: Optional[
        Union[
            constr(
                regex=r'^\\.?\\.?\\/?((\\/[\\w\\-\\.]+|\\/\\.\\.|\\/\\.)+\\/)?[\\w\\-\\.]+\\.?[\\w\\-\\.]*$'
            ),
            bool,
        ]
    ] = Field(
        None,
        description='Path to cache directory, set to true for default value, set to false to disable caching.',
    )
    removeBuilder: Optional[bool] = Field(
        None, description='Remove the builder instance.'
    )


class Docker(BaseModel):
    class Config:
        extra = Extra.forbid

    name: Optional[constr(regex=r'^[a-zA-Z0-9\\-\\_]+$')] = Field(
        None, description='Docker image name.'
    )
    dockerfile: Optional[
        constr(
            regex=r'^\\.?\\.?(\\/[\\w\\-\\.]+|\\/\\.\\.|\\/\\.)*\\/Dockerfile(.mustache)?$'
        )
    ] = Field(None, description='Docker image file name.')
    buildx: Optional[Buildx] = Field(
        None,
        description='Configuration options for Docker Buildx, set to true for default value.',
    )
    removeImage: Optional[bool] = Field(None, description='Remove the image.')


class LinkedPackage(BaseModel):
    class Config:
        extra = Extra.forbid

    name: str = Field(..., description='Package name.')
    path: str = Field(..., description='Path to linked package directory.')
    filter: Optional[str] = Field(
        None,
        description='Ignore files matching this regex in linked package directory.',
    )


class Model(BaseModel):
    class Config:
        extra = Extra.forbid

    format: Format = Field(..., description='Polywrap build manifest format version.')
    docker: Optional[Docker] = None
    config: Optional[Dict[str, Any]] = Field(
        None, description='Custom build image configurations.'
    )
    linked_packages: Optional[List[LinkedPackage]] = Field(
        None, description='Locally linked packages into docker build image.'
    )
