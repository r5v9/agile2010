#!/usr/bin/env ruby

require 'yaml'
require 'erb'
require 'time'
require 'fileutils'
require 'rubygems'
require 'json'

class Main

  def check_speakers
    puts "Loading topics"
    topics = YAML::load(File.open('aaserver/data/topics.yml'))

    puts "Loading speakers"
    speakers = YAML::load(File.open('aaserver/data/speakers.yml'))
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
    
    now = DateTime.now
    
    data = <<-DATA
    var defaultSpeakerData = { 
      'timestamp': '#{now}',
      'data': #{speakers.to_json}
    }
    var defaultSessionData = {
      'timestamp': '#{now}',
      'data': #{topics.to_json}
    }
    DATA
    
    File.open("themes/agile2010/defaultData.js", "w") { |f| f.puts data }
    
    return valid
  end

  def build_iphone_app
    iphone_app_project_dir = 'iphone/AgileAus2010'
    FileUtils.remove_dir(iphone_app_project_dir + '/www', force = true)
    FileUtils.makedirs(iphone_app_project_dir + '/www/themes')
    FileUtils.cp_r(%w(index.html jqtouch/), iphone_app_project_dir + '/www')
    FileUtils.cp_r(%w(themes/agile2010), iphone_app_project_dir + '/www/themes')
    FileUtils.cp('themes/agile2010/icon.png', iphone_app_project_dir + '/icon.png')
    FileUtils.cp('themes/agile2010/startup.png', iphone_app_project_dir + '/Default.png')
    #TODO: invoke the xcode build script for 'release'
  end

end

if __FILE__ == $0
  main = Main.new
  main.check_speakers
  main.build_iphone_app
end

