#!/bin/sh

files_to_watch="build-html.rb index.erb topics.yml speakers.yml"

old_timestamp=`ls -lT $files_to_watch`

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