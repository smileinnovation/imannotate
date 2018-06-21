#!/bin/sh
echo "----------> WORKING DIR: $PWD"
echo "---------> Getting packages"
go get -v ./...

#echo "---------> Install current project"
#go install -v ./...

echo "---------> Starting $@ ..."
exec $@
