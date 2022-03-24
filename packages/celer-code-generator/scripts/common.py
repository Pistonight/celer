"""Common utilities"""
import hashlib

def compact_name(name):
    """Remove spaces and other special characthers"""
    return name.replace(" ","").replace("'","")

# https://stackoverflow.com/questions/3431825/generating-an-md5-checksum-of-a-file
BUFFER_SIZE = 4096
def md5(fname):
    """Return md5 checksum as string"""
    hash_md5 = hashlib.md5()
    # pylint: disable-next=unspecified-encoding
    with open(fname, "rb") as in_file:
        for chunk in iter(lambda: in_file.read(BUFFER_SIZE), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def source_file(name):
    """Return content of entire file"""
    with open(f"src/{name}", "r", encoding="utf-8") as file:
        return file.read()
