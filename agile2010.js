
function Session(id, date, title, author) {
	this.id = id
	this.date = date
	this.title = title
	this.author = author
}

function isInMySessions(id) {
	return localStorage.getItem(id)!=null
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
		if (a.date < b.date) return -1
		if (a.date > b.date) return 1
		return 0
	})
}

function addToMySessions(id, date, title, author) {
	 localStorage.setItem(id, date + '|' + title + "|" + author)
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
		listHtml += '<li><a href="#' + session.id + '">' + session.title + '</a></li>'
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
		author = $("#" + id + ' .speaker-name').attr('innerHTML')
		if (this.checked) {
			addToMySessions(id, date, title, author)
		} else {
			removeFromMySessions(id)
		}
		rebuildMySessions()
	})
		
	// set the state for the slider based on what's saved in local storage
	$('topic-link').click(function() {
		id = $(this).attr(href).substring(1)
		slider = $('#' + id + " .attend-slider")
		slider.checked = isInMySessions(id)
	})
	
})
