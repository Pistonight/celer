import hashlib

def compact_name(name):
    return name.replace(" ","").replace("'","")

# https://stackoverflow.com/questions/3431825/generating-an-md5-checksum-of-a-file
BUFFER_SIZE = 4096
def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(BUFFER_SIZE), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def source_file(name):
    with open(f"src/{name}", "r") as file:
        return file.read()
