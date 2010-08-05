require 'spec/expectations'
require "watir"

Watir::Browser.default = 'safari'

$browser = Watir::Browser.new

Kernel::at_exit do 
  $browser.close
end
