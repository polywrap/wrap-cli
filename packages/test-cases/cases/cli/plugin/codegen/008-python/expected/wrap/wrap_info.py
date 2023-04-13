# NOTE: This is an auto-generated file. All modifications will be overwritten.
# type: ignore
from __future__ import annotations

import json
from base64 import b64decode

from polywrap_manifest import WrapManifest

abi = json.loads(b64decode("eyJtb2R1bGVUeXBlIjp7ImtpbmQiOjEyOCwibWV0aG9kcyI6W3siYXJndW1lbnRzIjpbeyJraW5kIjozNCwibmFtZSI6ImRhdGEiLCJyZXF1aXJlZCI6dHJ1ZSwic2NhbGFyIjp7ImtpbmQiOjQsIm5hbWUiOiJkYXRhIiwicmVxdWlyZWQiOnRydWUsInR5cGUiOiJTdHJpbmcifSwidHlwZSI6IlN0cmluZyJ9XSwia2luZCI6NjQsIm5hbWUiOiJzYW1wbGVNZXRob2QiLCJyZXF1aXJlZCI6dHJ1ZSwicmV0dXJuIjp7ImtpbmQiOjM0LCJuYW1lIjoic2FtcGxlTWV0aG9kIiwicmVxdWlyZWQiOnRydWUsInNjYWxhciI6eyJraW5kIjo0LCJuYW1lIjoic2FtcGxlTWV0aG9kIiwicmVxdWlyZWQiOnRydWUsInR5cGUiOiJTdHJpbmcifSwidHlwZSI6IlN0cmluZyJ9LCJ0eXBlIjoiTWV0aG9kIn1dLCJ0eXBlIjoiTW9kdWxlIn0sInZlcnNpb24iOiIwLjEifQ==").decode("utf-8"))

manifest = WrapManifest.parse_obj({
    "name": "Sample",
    "type": "plugin",
    "version": "0.1",
    "abi": abi,
})
