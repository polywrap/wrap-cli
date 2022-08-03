from json import dumps
from typing import Any, Dict


def filter_results(result: Any, filter: Dict[str, Any]) -> Any:
    if not result:
        return result

    if not isinstance(result, dict):
        raise ValueError(
            f"""The result given is not a dict. 
            Filters can only be given on results that are of 'dict' type.\n
            Filter: ${dumps(filter)}"""
        )

    filtered = {}
    for key in filter:
        if result[key] is not None:
            if isinstance(filter[key], bool):
                filtered[key] = result[key]
            else:
                filtered[key] = filter_results(result[key], filter[key])
        else:
            filtered[key] = None

    return filtered
