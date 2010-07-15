
function Session(id, date, title, speakers) {
	this.id = id
	this.date = date
	this.title = title
	this.speakers = speakers
}

function isInMySessions(id) {
	return localStorage.getItem(id)!=null
}

function toDate(d) {
	tokens = d.split(' ')
	dayOfTheWeek = tokens[0]
	timeAmPm = tokens[1]
	time = timeAmPm.substring(0, timeAmPm.length-2)
	if (/PM$/.test(timeAmPm)) {
		timeTokens = time.split(':')
		time =  '' + (parseInt(timeTokens[0])+ 12) + ':' + timeTokens[1]
	}
	if (dayOfTheWeek=='Wed') {
		day = 'September 15, 2010'
	} else {
		day = 'September 16, 2010'
	}
	return new Date(day + ' ' + time)
}

function getMySessions() {
	sessions = []
	for (i=0; i<localStorage.length; i++) {
		id = localStorage.key(i)
		session = localStorage.getItem(id)
		tokens = session.split('|')
		sessions.push(new Session(id, tokens[0], tokens[1], tokens[2]))
	}
	return sessions.sort(function(a,b) { 
		da = toDate(a.date)
		db = toDate(b.date)
		if (da < db) return -1
		if (da > db) return 1
		return 0
	})
}

function addToMySessions(id, date, title, speakers) {
	 localStorage.setItem(id, date + '|' + title + "|" + speakers)
}

function removeFromMySessions(id) {
	 localStorage.removeItem(id)
}

function rebuildMySessions() {
	listHtml = ''
	lastDate = ''
	sessions = getMySessions()
	for (i in sessions) {
		session = sessions[i]
		if (lastDate != session.date) {
			listHtml += '<li class="sep">' + session.date + '</li>'
			lastDate = session.date
		}
		listHtml += '<li><a href="#' + session.id + '" class="topic-link">' + session.title + '</a><span class="speaker-title3">' + session.speakers + '</span></li>'
	}
	$('#my-sessions > .edgetoedge').html(listHtml)
}

$(document).ready(function() {
	
	rebuildMySessions()
	
	// add/remove topic into/from local storage once slider changes and rebuild my sessions list
	$('.toggle-yes-no input').click(function() {
		id = $(this).attr('topic')
		title = $("#" + id + ' .topic').attr('innerHTML')
		date = $("#" + id + ' .toolbar h1').attr('innerHTML')
		speakers = $("#" + id + ' .speaker').attr('speakers')
		if (this.checked) {
			addToMySessions(id, date, title, speakers)
		} else {
			removeFromMySessions(id)
		}
	})
	
	$('#my-sessions').bind('pageAnimationStart', function() {
		rebuildMySessions()
	})
		
	// set the state for the slider based on what's saved in local storage	
	$('.topic-page').bind('pageAnimationStart', function() {
		id = $(this).attr('id')
		slider = $('#' + id + " .attend-slider")
		slider.attr('checked', isInMySessions(id))
	})
	
})
