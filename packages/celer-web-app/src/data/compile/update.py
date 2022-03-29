# Update bundle scripts from iTNTPiston/celer-compiler
import urllib.request

ref = "iTNTPiston/celer-compiler/main"

repoUrl = f"https://raw.githubusercontent.com/{ref}"

def download(filename):
    url = f"{repoUrl}/{filename}"
    print(f"Dowloading from {url}")
    with urllib.request.urlopen(url) as response:
        data = response.read().decode("utf-8").replace("\r\n", "\n")
        print(f"Writing {filename}")
        with open(filename, "w+") as f:
            f.write(data)
            print("Done")

download("gbundle.py")
download("gbundle-watch.py")
