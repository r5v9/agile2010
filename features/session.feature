Feature: As an Attendee, I want	the app to open on Wednesday schedule, so that	I immediately see what sessions are on

	Scenario Outline: Sessions with only one session per time
		Given I open the app
		When the home page appears
		Then I should see <schedule_day> selected
			And the the following time slot should be <time_slot>
			And the title should be <title>
			And the speaker should be <speaker> 

		Examples:
			| schedule_day | time_slot | title                                     | speaker       |
	  		| Wednesday    | 07:00AM   | Executive Breakfast with Jim Highsmith    | Jim Highsmith | 
	  		| Wednesday    | 10:00AM   | The Essence of Agile Software Development | Martin Fowler |
 
	Scenario Outline: Sessions with multiple sessions per time
		Given I open the app
		When the home page appears
		Then I should see <schedule_day> selected
			And the following <time_slot> contains the <sessions>

		Examples:
		  | schedule_day | time_slot | sessions |                                    
		  | Wednesday    | 12:15PM   | It's the culture, stupid! - Agile as an organisational paradigm BY Rob Thomsett AND_ALSO Case study - energy utility, Jemena BY Paula Ngov AND_ALSO You can take your Agile Maturity Assessment and... BY Jason Yip and Marina Chiovetti |
