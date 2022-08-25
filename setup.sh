#!usr/bin/bash

# This is the script for both linux and mac
echo "=== Celer Devtool Setup Script ==="

# Get OS info
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]') # darwin for mac, linux for linux
if [[ ! $ARCH == x86_64 ]]
then
  echo "Your architecture is currently not supported. Only x86_64 is supported for now."
  exit 1
fi

# Get install info
BIN=$(which celer)

if [[ ! -z $BIN ]]
then
  echo
  # Installation found, prompt update or remove
  BIN_DIR=$(dirname $BIN)
  PS3="Choose an option (1 or 2): "
  OPTION_INSTALL="Update"
  OPTION_UNINSTALL="Uninstall"

  select OPTION in $OPTION_INSTALL $OPTION_UNINSTALL
  do
    if [[ $OPTION == $OPTION_INSTALL ]] || [[ $OPTION == $OPTION_UNINSTALL ]]
    then
      break
    fi
  done
else
  OPTION_INSTALL="Install"
  OPTION=$OPTION_INSTALL
fi

echo ""
echo "Confirm: $OPTION celer devtool?"
read -p "Press Enter to continue or Ctrl + C to abort"

if [[ $OPTION == $OPTION_INSTALL ]]
then
  if [[ -z $BIN_DIR ]]
  then
    DEFAULT_INSTALL_PATH=/usr/local/bin
  else
    echo "Existing installation is detected at $BIN_DIR"
    DEFAULT_INSTALL_PATH=$BIN_DIR
  fi
  if [[ $OPTION == "Install" ]]
  then
    read -p "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH) " INSTALL_PATH
  else
    read -p "Press Enter to update existing installation or enter a new location: " INSTALL_PATH
  fi

  if [[ -z $INSTALL_PATH ]]
  then
    INSTALL_PATH=$DEFAULT_INSTALL_PATH
  else
    echo "You didn't choose the default location. Make sure the location is added to the PATH variable for your shell."
    sleep 1
  fi

  # Make sure that target location doesn't contain celer or it's a file (not a directory)
  if [[ -d "$INSTALL_PATH/celer" ]]
  then
    echo "Installation failed: There's a directory in the location named \"celer\", which conflicts with the binary"
    exit 1
  fi

  URL=$(curl -s https://api.github.com/repos/iTNTPiston/celer/releases/latest \
| grep "browser_download_url.*-"$ARCH"-"$OS".tar.gz" \
| cut -d : -f 2,3 \
| tr -d \")
  
  rm -rf $INSTALL_PATH/celer.tar.gz
  echo "Downloading from" $URL
  wget -q -O $INSTALL_PATH/celer.tar.gz $URL
  echo "Extracting"
  tar -xzf $INSTALL_PATH/celer.tar.gz -C $INSTALL_PATH
  rm $INSTALL_PATH/celer.tar.gz
  echo "$OPTION complete. run celer --help to verify"

else
  echo "Removing binary at $BIN"
  rm $BIN
  echo "Done"
fi
