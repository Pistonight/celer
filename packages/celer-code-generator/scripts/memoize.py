
# Memoize the function once. Only call the function the first time and return a memoized result from second time on
def memoized_thunk(thunk):
    executed = False
    result = None
    def f():
        nonlocal executed
        nonlocal result
        if not executed:
            result = thunk()
            executed = True
        return result
    return f