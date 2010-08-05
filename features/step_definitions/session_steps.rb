
Given /I open the app/ do
  $browser.goto "#{Dir.getwd}/index.html"
end

When /the home page appears/ do
  $browser.title.should == "Agile 2010"
end

Then /I should see (\w+) selected/ do |schedule_day|
end

Then /the the following time slot should be (\w+)/ do |time_slot|
end

Then /the title should be (\w+)/ do |title|
end

Then /the speaker should be (\w+)/ do |speaker|
end

Then /the following (.+) contains the (\w+)/ do |time_slot, sessions|
end
