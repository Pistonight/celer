echo "=== Celer Devtool Setup Script ==="
ARCH=$(uname -m)
OS=$(uname -s) | tr '[:upper:]' '[:lower:]' # Darwin for mac, Linux for linux
if [[ ! $ARCH == x86_64 ]]
then
  echo "Your architecture is currently not supported. Only x86_64 is supported for now."
  exit 1
fi

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

if [[ $OPTION == $OPTION_INSTALL ]]
then
# prompt install location /usr/local/bin or $HOME/.celer
# (windows) prompt add to path - yes/no (no will not be able to automatically uninstall)
# (windows) yes: add to powershell profile $PSHOME
# query gh release api
# download zip to install path
# unzip
# copy executable to install path
# tell user to restart shell

  DEFAULT_INSTALL_PATH=/usr/local/bin
  read -p "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH) " INSTALL_PATH
  if [[ -z $INSTALL_PATH ]]
  then
    INSTALL_PATH=$DEFAULT_INSTALL_PATH
  else
    echo "You didn't choose the default location. Make sure to add the location to the PATH variable for your shell after the install."
    sleep 1
  fi
  URL=$(curl -s https://api.github.com/repos/iTNTPiston/celer/releases/latest \
| grep "browser_download_url.*-"$ARCH"-"$OS".zip" \
| cut -d : -f 2,3 \
| tr -d \")
  echo $URL
  echo "Downloading..."
  

else
# uninstall
# which celer (sh) or Get-Command celer to find out install path
# (windows) read powershell $PSHOME
# (windows) Get-Content/Set-Content for ps to remove path
# delete CELER_PATH/celer 
    echo 2
fi