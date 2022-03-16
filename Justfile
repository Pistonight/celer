install:
    cargo install wasm-pack
    just packages/celer-ui/install

build: 
    cargo build

clean:
    cargo clean
    rm -rf packages/celer-ui/build

clean-node: clean
    rm -rf packages/celer-ui/node_modules
    