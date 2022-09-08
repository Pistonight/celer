
Write-Output "=== Celer Devtool Setup Script ==="

# Get OS info
$ARCH = "x86_64"
$OS = "windows"

# Get install info
$BIN= (Get-Command -Name celer -ErrorVariable CelerDNEError -ErrorAction SilentlyContinue).Path 
if ($CelerDNEError) {
  $BIN=""
  $OPTION_INSTALL="Install"
  $OPTION_NUM="1"
}else{
  $BIN_DIR = Split-Path -parent $BIN
  Write-Output ""

  $OPTION_INSTALL="Update"
  $OPTION_UNINSTALL="Uninstall"

  do {
    Write-Output "1) $OPTION_INSTALL"
    Write-Output "2) $OPTION_UNINSTALL"
    $OPTION_NUM = Read-Host -Prompt "Choose an option (1 or 2)"
  }
  until (($OPTION_NUM -eq "1") -or ($OPTION_NUM -eq "2"))
}

Write-Output ""
if ($OPTION_NUM -eq "1"){
  Write-Output "Confirm: $OPTION_INSTALL celer devtool?"
}else{
  Write-Output "Confirm: $OPTION_UNINSTALL celer devtool?"
}
Read-Host "Press Enter to continue or Ctrl + C to abort"

if ($OPTION_NUM -eq "1"){
  if ($null -eq $BIN_DIR) {
    $DEFAULT_INSTALL_PATH="~/.celer"
  }else{
    Write-Output "Existing installation is detected at $BIN_DIR"
    $DEFAULT_INSTALL_PATH=$BIN_DIR
  }

  if ($OPTION_INSTALL -eq "Install"){
    $INSTALL_PATH = Read-Host -Prompt "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH)"
  }else{
    $INSTALL_PATH = Read-Host -Prompt "Press Enter to update existing installation or enter a new location: "
  }

  if ($INSTALL_PATH -eq "") {
      $INSTALL_PATH = $DEFAULT_INSTALL_PATH
  }

  if (Test-Path -Path $INSTALL_PATH/celer.exe -PathType container) {
    Write-Output "Installation failed: There's a directory in the location named `"celer.exe`", which conflicts with the binary"
    exit 1
  }

  New-Item $INSTALL_PATH -Force -ItemType directory | Out-Null
  $INSTALL_PATH = (Resolve-Path $INSTALL_PATH).Path

  (Invoke-RestMethod -Uri https://api.github.com/repos/iTNTPiston/celer/releases/latest).assets | Foreach-Object -Process {
    if ($_.browser_download_url -match "-$ARCH-$OS.tar.gz") {
      $URL = $_.browser_download_url
    }
  }

  if (Test-Path -Path $INSTALL_PATH/celer.tar.gz -PathType container) {
    Remove-Item -Recurse  $INSTALL_PATH/celer.tar.gz
  }
  Write-Output "Downloading from $URL"
  Invoke-WebRequest -Uri $URL -OutFile $INSTALL_PATH/celer.tar.gz
  Write-Output "Extracting"
  tar -xzf $INSTALL_PATH/celer.tar.gz -C $INSTALL_PATH
  Remove-Item $INSTALL_PATH/celer.tar.gz

  if($CelerDNEError){
    Write-Output "Adding path to $PSHOME\Profile.ps1"
    $WRITE_CONTENT = '$env:Path += '+"';$INSTALL_PATH' # Add Celer to Path"
    Add-Content -Path $PSHOME\Profile.ps1 -Value $WRITE_CONTENT
  }

  Write-Output "Done"
  Write-Output "You need to restart powershell to complete the installation"
  
} else{
  if($CelerDNEError){
    Write-Output "Celer cannot be automatically uninstalled because we cannot find it on your computer"
    Exit 1
  }
  Write-Output "Removing binary from $BIN"
  Remove-Item $BIN
  Write-Output "Removing path from $PSHOME\Profile.ps1"
  Set-Content -Path $PSHOME\Profile.ps1 -Value (Get-Content -Path $PSHOME\Profile.ps1 | Select-String -Pattern '# Add Celer to Path$' -NotMatch)
  Write-Output "Done"
}
