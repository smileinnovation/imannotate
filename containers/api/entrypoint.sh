#!/bin/sh
$(fixuid -q)

echo "----------> WORKING DIR: $PWD"
echo "----------> Getting packages"
glide install

echo "----------> Starting $@ ..."
exec $@
