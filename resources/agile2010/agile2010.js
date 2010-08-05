
function isInMySessions(id) {
	return localStorage.getItem(id)!=null
}

function addToMySessions(id) {
	 localStorage.setItem(id, true)
}

function removeFromMySessions(id) {
	 localStorage.removeItem(id)
}

function differentialTime(date) {
	now = new Date()
	diff = now - new Date(date)
	millisecondsInDay = 24*60*60*1000
	millisecondsInHour = 60*60*1000
	millisecondsInMinute = 60*1000
	days = 0;
	hours = 0;
	minutes = 0;
	if (diff > millisecondsInDay) {
		days = Math.floor(diff/millisecondsInDay)
		diff = diff - days * millisecondsInDay
	}
	if (diff > millisecondsInHour) {
		hours = Math.floor(diff/millisecondsInHour)
		diff = diff - hours * millisecondsInHour
	}
	if (diff > millisecondsInMinute) {
		minutes = Math.floor(diff/millisecondsInMinute)
	}
	var s=""
	if (days>0) {
		s = ", " + days + " day" + (days>1 ? "s" : "")
	}
	if (hours>0) {
		s += ", " + hours + " hour" + (hours>1 ? "s" : "")
	}	
	if (minutes>0 && days==0) {
		//s += ", " + minutes + " minutes" + (minutes>1 ? "s" : "")
		s += ", " + minutes + " min"
	}
	if (s=="") {
		s = "less than 1 minute ago"
	} else {
		s = s.substring(2) + " ago"
	}
	return s
}

function requestTweetsJson() {
	$('#twitter-feed').html('<div style="text-align:center;"><img src="themes/jqt/img/loading.gif" align="center" width="31" height="31" style="margin-top:50px"></div>')
	$.getScript("http://search.twitter.com/search.json?q=agile&rpp=10&callback=rebuildTweets")
}

function rebuildTweets(json) {
	results = json['results']
	postsHtml = ''
	for(i in results) {
		result = results[i]
		dateDiff = differentialTime(result['created_at'])
		postsHtml += '<li><img src="' + result['profile_image_url'] + '" class="tweet-profile-image"/><div class="tweet">' + result['text'] + '</div><div><span class="tweet-user">' + result['from_user'] + '</span><span class="tweet-date">, ' + dateDiff + '</span></div></li>'
	}
	$('#twitter-feed').html('<ul class="edgetoedge">' + postsHtml + '</ul>')		
}

function localiser() {
    if ($("#map_canvas").html()) return;

    if ((window.orientation == (-90)) || (window.orientation == (90))) {
        var width = 520; var height = 285;
        $('#map_canvas').css("width",width+"px");
        $('#map_canvas').css("height",height+"px");
        $('#map-overflow').css("width",(width-40)+"px");
        $('#map-overflow').css("height",(height-10)+"px");
    } else {
        var width = 360; var height = 435;
        $('#map_canvas').css("width",width+"px");
        $('#map_canvas').css("height",height+"px");
        $('#map-overflow').css("width",(width-40)+"px");
        $('#map-overflow').css("height",(height-10)+"px");
    }

    var myOptions = {
      zoom: 15,
      center: new google.maps.LatLng(-37.81943, 144.96009),
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
	addMarkerToMap(map, new google.maps.LatLng(-37.816526, 144.963763), 'After Party Venue', 'ThoughtWorks, 303 Collins St, Melbourne', 'http://www.thoughtworks.com.au/');
	addMarkerToMap(map, new google.maps.LatLng(-37.824332, 144.956869), 'Conference Venue', 'Crown Towers, 8 Whiteman St, Southbank', 'http://www.crowntowers.com.au/');
}

function addMarkerToMap(map, latLong, title, content, link) {
    var marker = new google.maps.Marker({
      position: latLong,
      map: map,
      title: title
    });
	google.maps.event.addListener(marker, "click", function() {
		$('#map_text').html('<h3>'+ title + '</h3><p>' + content + '</p><p><a href="' + link + '" target="_blank">More information</a></div>')
	}); 
}

$(document).ready(function() {
	
	// add/remove topic into/from local storage once slider changes and rebuild my sessions list
	$('.toggle-yes-no input').click(function() {
		id = $(this).attr('topic')
		if (this.checked) {
            addToMySessions(id)
		} else {
			removeFromMySessions(id)
		}
	})
		
	// set the state for the slider based on what's saved in local storage	
	$('.uses_local_data').bind('pageAnimationStart', function() {
		$(this).find("input.attend-slider").each(function() {
            slider = $(this)
            id = slider.attr('topic')
		    slider.attr('checked', isInMySessions(id))
        })
	})

	$('#twitter').bind('pageAnimationStart', function() {
		requestTweetsJson()
	})
	
    $('body').bind('turn', function(event, info){
        var curr = $(".current").attr("id");
        switch (curr) {
        case "map":
          if (info.orientation == "landscape") {
              var width = 520; var height = 285
              $('#map_canvas').css("width",width+"px")
              $('#map_canvas').css("height",height+"px")
              $('#map-overflow').css("width",(width-40)+"px")
              $('#map-overflow').css("height",(height-10)+"px")
          } else {
              var width = 360; var height = 435
              $('#map_canvas').css("width",width+"px")
              $('#map_canvas').css("height",height+"px")
              $('#map-overflow').css("width",(width-40)+"px")
              $('#map-overflow').css("height",(height-10)+"px")
          }
          break
       }
    })

    $('#map').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            localiser();
        }
    });
	
})
