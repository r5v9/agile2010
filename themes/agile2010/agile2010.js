function isInMySessions(id) {
    return localStorage.getItem(id) !== null;
}

function addToMySessions(id) {
    localStorage.setItem(id, true);
}

function removeFromMySessions(id) {
    localStorage.removeItem(id);
}

function differentialTime(date) {
    now = new Date();
    diff = now - new Date(date);
    millisecondsInDay = 24 * 60 * 60 * 1000;
    millisecondsInHour = 60 * 60 * 1000;
    millisecondsInMinute = 60 * 1000;
    days = 0;
    hours = 0;
    minutes = 0;
    if (diff > millisecondsInDay) {
        days = Math.floor(diff / millisecondsInDay);
        diff = diff - days * millisecondsInDay;
    }
    if (diff > millisecondsInHour) {
        hours = Math.floor(diff / millisecondsInHour);
        diff = diff - hours * millisecondsInHour;
    }
    if (diff > millisecondsInMinute) {
        minutes = Math.floor(diff / millisecondsInMinute);
    }
    var s = "";
    if (days > 0) {
        s = ", " + days + " day" + (days > 1 ? "s" : "");
    }
    if (hours > 0) {
        s += ", " + hours + " hour" + (hours > 1 ? "s" : "");
    }
    if (minutes > 0 && days === 0) {
        //s += ", " + minutes + " minutes" + (minutes>1 ? "s" : "")
        s += ", " + minutes + " min";
    }
    if (s === "") {
        s = "less than 1 minute ago";
    } else {
        s = s.substring(2) + " ago";
    }
    return s;
}

function changeIcons(){
	$(".icon-img").each(function(index, s) {
		var src = $(this).attr('src');
		$(this).attr('src', src.replace('on', 'off'));
	});
	
	var src = $(event.target).attr('src');  
	$(event.target).attr('src', src.replace('off', 'on'));
}

function requestTweetsJson() {
    $('#twitter-feed').html('<div style="text-align:center;"><img src="themes/jqt/img/loading.gif" align="center" width="31" height="31" style="margin-top:50px"></div>');
    $.getScript("http://search.twitter.com/search.json?q=agileaus&callback=rebuildTweets");
}

function rebuildTweets(json) {
    results = json.results;
    postsHtml = '';
    for (i in results) {
        result = results[i];
        dateDiff = differentialTime(result.created_at);
        postsHtml += '<li><img src="' + result.profile_image_url + '" class="tweet-profile-image"/><div class="tweet">' + result.text + '</div><div><span class="tweet-user"> via twitter : ' + result.from_user + '</span><span class="tweet-date">, ' + dateDiff + '</span></div></li>';
    }
    $('#twitter-feed').html('<ul class="edgetoedge">' + postsHtml + '</ul>');
}

//you will find that jQTouch fails to appropriately identify the initial orientation
//do to the fact that not all components are loaded before firing $.ready
$(window).load(function() {
    $(document.body).trigger('orientationchange');
    $('.current').trigger('pageAnimationStart');
});

function buildDateStringForSession(session) {
    var dateString = "September ";
    var dateParts = session.date.split(' ');
    if (dateParts[0] == "Wed") {
        dateString += "15, "; //15th of sept
    } else {
        dateString += "16, "; //16th of sept
    }
    dateString += "2010 ";
    var hours = dateParts[1].substr(0, 2);
    var minutes = dateParts[1].substr(3, 2);
    if (dateParts[1].indexOf("PM") != -1 && hours != 12) {
        hours = (parseInt(hours, 10) + 12) + "";
    }

    dateString += hours + ":" + minutes + ":00";
    return dateString;
}


function sortSessionsByTime(session1, session2) {
    var session1Date = new Date(buildDateStringForSession(session1));
    var session2Date = new Date(buildDateStringForSession(session2));
    if (session1Date > session2Date) {
        return 1;
    } else if (session1Date == session2Date) {
        return 0;
    } else {
        return -1;
    }
}

function getSortedSessionsForDay(sessions, day) {
    var sessionsForDay = [];
    for (sessionID in sessions) {
        var session = sessions[sessionID];
        if (session.date.indexOf(day) != -1) {
            session.id = sessionID;
            sessionsForDay.push(session);
        }
    }
    sessionsForDay.sort(sortSessionsByTime);
    return sessionsForDay;
}

function cleanSpeakerID(speakerID) {
    return speakerID.replace(" ","").replace("%20","");
}

function registerJQTHandlers() {
    // add/remove topic into/from local storage once slider changes and rebuild my sessions list
    $('.toggle.yes-no input, .toggle.go-skip input').click(function() {
        id = $(this).attr('topic');
        if (this.checked) {
            addToMySessions(id);
        } else {
            removeFromMySessions(id);
        }
    });

    $('.uses_local_data').bind('pageAnimationStart', function() {
        $(this).find("input.attend-slider").each(function() {
            slider = $(this);
            id = slider.attr('topic');
            slider.attr('checked', isInMySessions(id));
        });
    });

    $('#twitter').bind('pageAnimationStart', function() {
        requestTweetsJson();
    });
}

function buildSessionDom(conference) {
    var domBuilder = new ConferenceDOMBuilder(conference);
    domBuilder.updateSessionsDOM();
    domBuilder.updateIndexPageDOM();
    registerJQTHandlers();
}

function buildSpeakerDom(conference) {
    var domBuilder = new ConferenceDOMBuilder(conference);
    domBuilder.updateSpeakersDOM();
}

function AgileConference() {
    this.days = [
        {'full': "Wednesday", 'shortName': "Wed", 'cssClass': "current"},
        {'full': "Thursday", 'shortName': "Thu"}
    ];
    this.conferenceSpeakers = $.parseJSON(localStorage.getItem('speakers'));
    this.conferenceSessions = $.parseJSON(localStorage.getItem('sessions'));
}

AgileConference.prototype.loadSpeakerInfo = function() {
    var conference = this;
    
    $.getJSON('http://agileaustralia2010.appspot.com/speakersTimestamp?callback=?',
        function(speakersTimestamp) {
            if (localStorage.getItem('speakersTimestamp') !== speakersTimestamp['timestamp']) {
                $.getJSON('http://agileaustralia2010.appspot.com/speakers?callback=?',
                    function(speakersData) {
                        localStorage.setItem("speakers", $.toJSON(speakersData));
                        localStorage.setItem('speakersTimestamp', speakersTimestamp['timestamp']);
                        conference.conferenceSpeakers = speakersData;
                        buildSpeakerDom(conference);
                    }
                );
            }
        }
    );       
};

AgileConference.prototype.loadSessionInfo = function() {
    var conference = this;

    $.getJSON('http://agileaustralia2010.appspot.com/topicsTimestamp?callback=?',
        function(sessionsTimestamp) {
            if (localStorage.getItem('sessionsTimestamp') !== sessionsTimestamp['timestamp']) {
                $.getJSON('http://agileaustralia2010.appspot.com/topics?callback=?',
                    function(sessionsData) {
                        localStorage.setItem("sessions", $.toJSON(sessionsData));
                        localStorage.setItem('sessionsTimestamp', sessionsTimestamp['timestamp']);
                        conference.conferenceSessions = sessionsData;
                        buildSessionDom(conference);
                    }
                );
            }
        }
    );
};

AgileConference.prototype.getPrettySpeakersList = function(speakerIDs) {
    if (speakerIDs.length === 0) {
        return "";
    }
    var _this = this;
    return $.map(speakerIDs, function(id, i) {
        return _this.conferenceSpeakers[cleanSpeakerID(id)].name;
    }).join(' and ');
}

function ConferenceDOMBuilder(conference) {
    this.conference = conference;
}

ConferenceDOMBuilder.prototype.buildSpeakerDOM = function(speakerID, speaker) {
    var speakerDiv = $('<div id="' + speakerID + '" class="content"></div>');
    speakerDiv.append($('<div class="toolbar"><h1>' + speaker.name + '</h1><a class="button back" href="#">Back</a></div>'));
    speakerDiv.append($('<div class="speaker-info description scroll"><img src="themes/agile2010/img/speakers/' + speakerID + '.gif" width="80" height="120" class="speaker-photo"/><div class="speaker-title2">' + speaker.title + '</div>' + speaker.description + '</div>'));
    return speakerDiv;
};

ConferenceDOMBuilder.prototype.updateSpeakersDOM = function() {
    for (speakerID in this.conference.conferenceSpeakers) {
        var cleanID = cleanSpeakerID(speakerID);
        $("#"+cleanID).remove();
        this.buildSpeakerDOM(cleanID,
            this.conference.conferenceSpeakers[cleanID]).insertBefore("#Wednesday");
    }
};

ConferenceDOMBuilder.prototype.buildSessionSpeakerList = function(session) {
    var speakers = (session.speakers === null ? [] : session.speakers.split(','));
    var speakerList = $('<ul class="speaker" speakers="' + this.conference.getPrettySpeakersList(speakers) + '"></ul>');
    for (var i = 0; i < speakers.length; ++i) {
        var speakerID = cleanSpeakerID(speakers[i]);
        var speaker = this.conference.conferenceSpeakers[speakerID];
        speakerList.append('<li class="arrow speaker-names"><a href="#' + speakerID + '" class="slide">' + speaker.name + '<div class="speaker-title">' + speaker.title + '</div></li>');
    }
    return speakerList;
};

ConferenceDOMBuilder.prototype.buildSessionDOM = function(sessionID, session) {
    var sessionDiv = $('<div id="' + sessionID + '" class="uses_local_data content"></div>');
    sessionDiv.append($('<div class="toolbar"><a href="#" class="back">Back</a><h1>' + session.date + '</h1></div>'));
    var contentDiv = $('<div class="scroll"></div>');
    sessionDiv.append(contentDiv);
	contentDiv.append($('<div class="description"><span class="session-header">' + session.title + '</span><span style=""><span class="toggle go-skip" style="display: inline-block;"><input type="checkbox" topic="' + sessionID + '" class="attend-slider"/></span></span></div>'));
	contentDiv.append($('div class="topic">' + session.topic + '</div>'));
    contentDiv.append(this.buildSessionSpeakerList(session));
    contentDiv.append($('<div class="description">' + session.description + '</div>'));
    return sessionDiv;
};

ConferenceDOMBuilder.prototype.updateSessionsDOM = function() {
    for (sessionID in this.conference.conferenceSessions) {
        $("#"+sessionID).remove();
        this.buildSessionDOM(sessionID, this.conference.conferenceSessions[sessionID]).insertBefore("#Wednesday");
    }
};

ConferenceDOMBuilder.prototype.updateDayMenu = function(day, dayDiv) {
    var dayList = $('.segmented', dayDiv);
    dayList.empty();
    var numberOfDays = this.conference.days.length;
    for (var dayIndex = 0; dayIndex < numberOfDays; ++dayIndex) {
        var day_button_header = this.conference.days[dayIndex];
        dayList.append($('<li style="width:' + 100 / numberOfDays + '%">'
                + '<a class="dissolve ' + (day == day_button_header ? "selected" : "") + '"'
                + ' href="#' + day_button_header.full
                + '">'
                + day_button_header.full + '</a></li>'));
    }
};

ConferenceDOMBuilder.prototype.updateTopicList = function(day, dayDiv) {
    var topicKeys = { "Wed" : getSortedSessionsForDay(this.conference.conferenceSessions, "Wed"),
        "Thu" : getSortedSessionsForDay(this.conference.conferenceSessions, "Thu")};
    var topicList = $('ul.edgetoedge', dayDiv);
    topicList.empty();
    var previousDate = '';
    var dayTopics = topicKeys[day.shortName];
    for (var sessionIndex = 0; sessionIndex < dayTopics.length; sessionIndex++) {
        var session = dayTopics[sessionIndex];
        var sessionDate = session.date.split(' ')[1].replace(" ", "");
        if (sessionDate != previousDate) {
            topicList.append($('<li class="sep">' + sessionDate + '</li>'));
            previousDate = sessionDate;
        }
        var speakers = (session.speakers === null ? [] : session.speakers.split(','));
        topicList.append($('<li><a href="#' + session.id + '" class="topic-link slide">' + session.title + '</a><span class="speaker-title3">' + this.conference.getPrettySpeakersList(speakers) + '</span><span class="toggle go-skip"><input type="checkbox" topic="' + session.id + '" class="attend-slider"/></span></li>'));
    }
};

ConferenceDOMBuilder.prototype.updateConferenceDaySchedule = function(day) {
    var dayDiv = $("#" + day.full);
    if (day.cssClass !== undefined) {
        dayDiv.addClass(day.cssClass);
    }
    this.updateDayMenu(day, dayDiv);
    this.updateTopicList(day, dayDiv);
};

ConferenceDOMBuilder.prototype.updateIndexPageDOM = function() {
    for (var dayIndex = 0; dayIndex < this.conference.days.length; ++dayIndex) {
        this.updateConferenceDaySchedule(this.conference.days[dayIndex]);
    }
};

$(document).ready(function() {
    var conference = new AgileConference();
    buildSpeakerDom(conference);
    buildSessionDom(conference);
    registerJQTHandlers();
    
    conference.loadSpeakerInfo();
    conference.loadSessionInfo();
});
