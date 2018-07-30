#!/bin/sh

if [ -f package.json ]; then
    npm install
fi

exec $@
