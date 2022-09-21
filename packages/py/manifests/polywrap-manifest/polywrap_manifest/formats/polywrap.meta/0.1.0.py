# generated by datamodel-codegen:
#   filename:  0.1.0.json
#   timestamp: 2022-09-21T13:12:40+00:00

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Extra, Field, constr


class Format(Enum):
    field_0_1_0 = '0.1.0'
    field_0_1 = '0.1'


class Link(BaseModel):
    class Config:
        extra = Extra.forbid

    name: str = Field(..., description='Web link name.')
    icon: Optional[
        constr(
            regex=r'^\\.?\\.?(\\/[\\w\\-\\.]+|\\/\\.\\.|\\/\\.)*\\/[\\w\\-\\.]+\\.(svg|png)$'
        )
    ] = Field(None, description='Web link icon.')
    url: constr(
        regex=r'^((h|H)(t|T)(t|T)(p|P)(s|S)?:\\/\\/)?((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*(\\?[;&a-zA-Z\\d%_.~+=-]*)?(\\#[-a-zA-Z\\d_]*)?$'
    ) = Field(..., description='Url to the web link.')


class Model(BaseModel):
    class Config:
        extra = Extra.forbid

    format: Format = Field(
        ..., description='Polywrap wrapper metadata manifest format version.'
    )
    displayName: Optional[str] = Field(None, description='Name of the wrapper.')
    subtext: Optional[str] = Field(
        None, description='Short or summary description of the wrapper.'
    )
    description: Optional[str] = Field(
        None, description='Long description for the wrapper.'
    )
    repository: Optional[
        constr(
            regex=r'^((h|H)(t|T)(t|T)(p|P)(s|S)?:\\/\\/)?((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*(\\?[;&a-zA-Z\\d%_.~+=-]*)?(\\#[-a-zA-Z\\d_]*)?$'
        )
    ] = Field(None, description='Reference to the repository holding source code.')
    tags: Optional[List[constr(regex=r'^[a-zA-Z0-9\\-\\_]+$')]] = Field(
        None, description='List of relevant tag keywords.'
    )
    icon: Optional[
        constr(
            regex=r'^\\.?\\.?(\\/[\\w\\-\\.]+|\\/\\.\\.|\\/\\.)*\\/[\\w\\-\\.]+\\.(svg|png)$'
        )
    ] = Field(None, description='Path to wrapper icon.')
    links: Optional[List[Link]] = Field(None, description='Relevant web links.')
