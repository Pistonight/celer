#!usr/bin/bash

echo "=== Celer Devtool Setup Script ==="
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]') # Darwin for mac, Linux for linux
if [[ ! $ARCH == x86_64 ]]
then
  echo "Your architecture is currently not supported. Only x86_64 is supported for now."
  exit 1
fi
echo

PS3="Choose an option (1 or 2): "
OPTION_INSTALL="Install/Update"
OPTION_UNINSTALL="Uninstall"

select OPTION in $OPTION_INSTALL $OPTION_UNINSTALL
do
  if [[ $OPTION == $OPTION_INSTALL ]] || [[ $OPTION == $OPTION_UNINSTALL ]]
  then
    break
  fi
done

BIN=$(which celer)

if [[ ! -z $BIN ]]
then
  BIN_DIR=$(dirname $BIN)
fi

if [[ $OPTION == $OPTION_INSTALL ]]
then
  if [[ -z $BIN_DIR ]]
  then
    DEFAULT_INSTALL_PATH=/usr/local/bin
  else
    echo "Celer binary is detected at $BIN_DIR"
    DEFAULT_INSTALL_PATH=$BIN_DIR
  fi
  read -p "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH) " INSTALL_PATH
  if [[ -z $INSTALL_PATH ]]
  then
    INSTALL_PATH=$DEFAULT_INSTALL_PATH
  else
    echo "You didn't choose the default location. Make sure the location is added to the PATH variable for your shell."
    sleep 1
  fi

  URL=$(curl -s https://api.github.com/repos/iTNTPiston/celer/releases/latest \
| grep "browser_download_url.*-"$ARCH"-"$OS".tar.gz" \
| cut -d : -f 2,3 \
| tr -d \")
  echo "Downloading from" $URL
  wget -q -O temp.tar.gz $URL
  echo "Extracting"
  tar -xzf temp.tar.gz
  rm temp.tar.gz
  echo "Moving binary"
  mv celer $INSTALL_PATH
  echo "Done"

else
  echo "Removing binary at $BIN"
  rm $BIN
  echo "Done"
fi
