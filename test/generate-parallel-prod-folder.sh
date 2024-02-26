#!/bin/bash

cd "$(git rev-parse --show-toplevel)" || exit 1;

src="./test/lib"
dest="./test/prod"

rm -rf "$dest"
mkdir -p "$dest"

cp -r "$src/"* "$dest/"

find "$dest" -type f -exec sed -i 's|/pf-iframe/lib/|/pf-iframe/prod/|g; s|\.js|\.min.js|g; s|\.css|\.min.css|g' {} \;
