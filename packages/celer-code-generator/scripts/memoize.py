"""Memoize"""
# Memoize the function once.
# Only call the function the first time and
# return a memoized result from second time on
def memoized_thunk(thunk):
    """Return a memoized version of the function"""
    executed = False
    result = None
    def memoized_func():
        nonlocal executed
        nonlocal result
        if not executed:
            result = thunk()
            executed = True
        return result
    return memoized_func
