class WasmAbortError(RuntimeError):
    def __init__(self, message: str):
        return super().__init__(
            f"""
            WasmWrapper: Wasm module aborted execution
            URI:
            Method:
            Args:
            Message: {message}"""
        )


class ExportNotFoundError(Exception):
    """raises when an export isn't found in the wasm module"""
