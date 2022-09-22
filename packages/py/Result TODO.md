Change rustedpy/result to include proper error
```python
import sys
import types
import inspect

def exception_with_traceback(message):
    tb = None
    frame = inspect.currentframe()
    frame = frame.f_back
    tb = types.TracebackType(tb, frame, frame.f_lasti, frame.f_lineno)

    return Exception(message).with_traceback(tb)
    
def div(a, b):
    return a / b if b != 0 else exception_with_traceback("ZERO")
    
    
raise div(1, 0)
```