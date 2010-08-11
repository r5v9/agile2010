#!/usr/bin/env ruby

require 'yaml'
require 'erb'
require 'time'
require 'fileutils'

class Main

  def check_speakers
    topics = YAML::load(File.open('topics.yml'))
    speakers = YAML::load(File.open('speakers.yml'))
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
    FileUtils.cp_r(%w(index.html jqtouch/ themes/), 'phonegap-iphone/www')
    #TODO: invoke the xcode build script for 'release'
  end

end

if __FILE__ == $0
  main = Main.new
  main.check_speakers
  main.build_iphone_app
end

