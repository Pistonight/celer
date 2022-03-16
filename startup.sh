#!/usr/bin/bash

if [[ -z $(which node) ]] || [[ ! $(node -v)=~"v16.*" ]]
then
    echo "Node 16 is not installed. Please install node 16 with"
    echo "    curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -"
    echo "    sudo apt -y install nodejs"
    exit 1
fi

if [[ -z $(which cargo) ]]
then
    echo "Installing rust"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi
echo "cargo installed at $(which cargo)"


if [[ -z $(which just) ]]
then
    echo "Installing just"
    cargo install just
fi
echo "just installed at $(which just)"
just install