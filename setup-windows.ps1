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

$BIN= (Get-Command -Name celer -ErrorVariable CelerDNEError -ErrorAction SilentlyContinue).Path 
if ($CelerDNEError) {
  Write-Output "Celer binary not detected"
}else{
  $BIN_DIR = Split-Path -parent $BIN
  Write-Output "Celer binary detected at $BIN"
}

if ($OPTION_NUM -eq "1"){
  if ($BIN_DIR -eq $null) {
    $DEFAULT_INSTALL_PATH="$HOME\.celer"
  }else{
    $DEFAULT_INSTALL_PATH=$BIN_DIR
  }
  $INSTALL_PATH = Read-Host -Prompt "Where do you want to install celer? (default: $DEFAULT_INSTALL_PATH)"
  if ($INSTALL_PATH -eq "") {
      $INSTALL_PATH = $DEFAULT_INSTALL_PATH
  }
  mkdir -Force -p $INSTALL_PATH | Out-Null
  $INSTALL_PATH = (Resolve-Path $INSTALL_PATH).Path
  Write-Output "Will install celer to $INSTALL_PATH"

  (Invoke-RestMethod -Uri https://api.github.com/repos/iTNTPiston/celer/releases/latest).assets | Foreach-Object -Process {
    if ($_.browser_download_url -match "-$ARCH-$OS.tar.gz") {
      $URL = $_.browser_download_url
    }
  }

  Write-Output "Downloading from $URL"
  Invoke-WebRequest -Uri $URL -OutFile temp.tar.gz
  Write-Output "Extracting"
  tar -xzf temp.tar.gz
  Remove-Item temp.tar.gz
  Write-Output "Moving binary"
  Move-Item -Force "celer.exe" $INSTALL_PATH
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
