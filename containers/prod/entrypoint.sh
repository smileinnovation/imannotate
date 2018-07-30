#!/bin/sh


mkdir -p /ui
rsync --delete -rab /ui-tmp/ /ui
exec $@
