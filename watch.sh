#!/bin/sh

files_to_watch="aaserver/data/*.yml build-html.rb index.html"

while [ true ]; do
	current_timestamp=`ls -lT $files_to_watch`
	
	if [[ "$current_timestamp" != "$old_timestamp" ]]; then
		echo `date` "started rebuilding"
		ruby build-html.rb
		echo `date` "finished rebuilding"
		old_timestamp="$current_timestamp"
	fi
	
	sleep 1
done