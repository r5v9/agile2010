#!/usr/bin/env ruby

require 'yaml'
require 'erb'
require 'time'
require 'fileutils'

class Main

  def build_html
    topics = YAML::load(File.open('topics.yml'))
    speakers = YAML::load(File.open('speakers.yml'))
    topic_keys = { 'Wed' => topic_keys_sorted(topics, 'Wed'), 'Thu' => topic_keys_sorted(topics, 'Thu') }

		if !check_speakers(topics, speakers)
		  return
		end
  
    b = binding
    template = ERB.new(File.read('index.erb'))

    index_file = File.new('index.html', 'w')
    index_file.puts template.result(b)
    index_file.close
  end
  
  def topic_keys_sorted(topics, day)
    return topics.select { |k,v| v['date'].match(/#{day}/) } \
	        .sort { |a,b| Time.parse(a[1]['date'])<=>Time.parse(b[1]['date']) } \
	        .map { |a| a[0] }
  end
  
  def check_speakers(topics, speakers)
    valid = true
    topics.each_key do |id|
      topic_speakers = topics[id]['speakers']
      if topic_speakers!=nil
        topic_speakers.split(',').each do |speaker_id|
          speaker_id.strip!
          if speakers[speaker_id] == nil
            puts "topic #{id} points to speaker #{speaker_id} which is not in speakers.yml"
            valid = false
          end
        end
      end
    end
    return valid
  end

  def build_iphone_app
    FileUtils.cp_r(%w(index.html resources/ jqtouch/ themes/), 'phonegap-iphone/www')
  end

end

if __FILE__ == $0
  main = Main.new
  main.build_html
  main.build_iphone_app
end

