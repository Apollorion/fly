#!/bin/bash

function rebuild(){
  echo "Rebuilding"
  yarn build
  export FLY_RELEASE_VERSION="0.0.1"
  envsubst < ./extension/manifest.json > ./dist/manifest.json
  cp ./extension/img.png ./dist/img.png
  echo "Happy Coding!"
}
export -f rebuild

yarn install
rebuild

fswatch -o ./extension | xargs -t -n1 -P2 bash -c 'rebuild "$@"' _