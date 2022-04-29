
Write-Output "=== Celer Devtool Setup Script ==="
$ARCH = "x86_64"
$OS = "windows"
Write-Output ""

$OPTION_INSTALL="Install/Update"
$OPTION_UNINSTALL="Uninstall"

do {
  Write-Output "1) $OPTION_INSTALL"
  Write-Output "2) $OPTION_UNINSTALL"
  $OPTION_NUM = Read-Host -Prompt "Choose an option (1 or 2)"
}
until (($OPTION_NUM -eq "1") -or ($OPTION_NUM -eq "2"))

try {
  $BIN= (Get-Command celer).Path
  $BIN_DIR = Split-Path -parent $BIN
  Write-Output "Celer binary detected at $BIN"
} catch {
  Write-Output "Celer binary not detected"
}


if ($OPTION_NUM -eq "1"){
  if ($BIN_DIR -eq $null) {
    $DEFAULT_INSTALL_PATH="~/.celer"
  }else{
    $DEFAULT_INSTALL_PATH=$BIN_DIR
  }
  $INSTALL_PATH = Read-Host -Prompt "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH)"
  if ($INSTALL_PATH -eq "") {
      $INSTALL_PATH = $DEFAULT_INSTALL_PATH
  }
  
} else{
  echo 2
}

# # Prompt for install/update or uninstall
# # install/update
# # prompt install location /usr/local/bin or $HOME/.celer
# # (windows) prompt add to path - yes/no (no will not be able to automatically uninstall)
# # (windows) yes: add to powershell profile $PSHOME
# # query gh release api
# # download zip to install path
# # unzip
# # copy executable to install path
# # tell user to restart shell
#   if [[ -z $BIN_DIR ]]
#   then
#     DEFAULT_INSTALL_PATH=/usr/local/bin
#   else
#     echo "Celer binary is detected at $BIN_DIR"
#     DEFAULT_INSTALL_PATH=$BIN_DIR
#   fi
#   read -p "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH) " INSTALL_PATH
#   if [[ -z $INSTALL_PATH ]]
#   then
#     INSTALL_PATH=$DEFAULT_INSTALL_PATH
#   else
#     echo "You didn't choose the default location. Make sure the location is added to the PATH variable for your shell."
#     sleep 1
#   fi

#   URL=$(curl -s https://api.github.com/repos/iTNTPiston/celer/releases/latest \
# | grep "browser_download_url.*-"$ARCH"-"$OS".tar.gz" \
# | cut -d : -f 2,3 \
# | tr -d \")
#   echo "Downloading from" $URL
#   wget -q -O temp.tar.gz $URL
#   echo "Extracting"
#   tar -xzf temp.tar.gz
#   rm temp.tar.gz
#   echo "Moving files"
#   mv celer $INSTALL_PATH
#   echo "Done"

# else


# # uninstall
# # which celer (sh) or Get-Command celer to find out install path
# # (windows) read powershell $PSHOME
# # (windows) Get-Content/Set-Content for ps to remove path
# # delete CELER_PATH/celer 
#   echo "Deleting $BIN"
#   rm $BIN
#   echo "Done"
# fi
