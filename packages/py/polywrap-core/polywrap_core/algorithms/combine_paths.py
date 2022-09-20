def combine_paths(a: str, b: str) -> str:
    # Normalize all path separators
    a = a.replace("/\\/g", "/")
    b = b.replace("/\\/g", "/")

    if a[-1] != "/":
        a += "/"

    # Remove any leading separators from
    while b[0] == "/" or b[0] == ".":
        b = b[1:]

    return a + b
