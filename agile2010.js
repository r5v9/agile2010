
function Session(id, date, title) {
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


$(document).ready(function() { 
	
	$('.speaker').after('<a href="#" class="attend-button grayButton" style="font-size: 12pt;"></a>')
	
	$('.schedule a').click(function() { 
		id = $(this).attr('href').substring(1)
		attend = isInMySessions(id)
		$('#' + id + " .attend-button").html(attend ? "I attend" : "I don't attend")
	})
	
	$('.attend-button').click(function() {
		id = $(this).parent().attr('id')
		title = $(this).parent().children('.topic').attr('innerHTML')
		date = $(this).parent().children('.toolbar').children('h1').attr('innerHTML')
		if (this.innerHTML == 'I attend') {
			addToMySessions(id, date, title)
			this.innerHTML = "I don't attend"
		} else {
			removeFromMySessions(id)
			this.innerHTML = 'I attend'
		}
		return false
	})
	
	$('#my-sessions-link').click(function() {
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
	})
})