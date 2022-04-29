# Prompt for install/update or uninstall
# install/update
# prompt install location /usr/local/bin or $HOME/.celer
# (windows) prompt add to path - yes/no (no will not be able to automatically uninstall)
# (windows) yes: add to powershell profile $PSHOME
# query gh release api
# download zip to install path
# unzip
# copy executable to install path
# tell user to restart shell

# uninstall
# which celer (sh) or Get-Command celer to find out install path
# (windows) read powershell $PSHOME
# (windows) Get-Content/Set-Content for ps to remove path
# delete CELER_PATH/celer 