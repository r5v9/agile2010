jQExtensions is a collection of extensions for the jQTouch mobile 
web app framework based on jQuery. jQExtensions has no affiliation 
with the developers of jQTouch.

/**************************************************************/

!!!!!!Important Notice!!!!
These extensions require at least revision 119 of jQTouch beta

/***************************************************************/

The primary implementation of these scripts only requires the css file
(scrolling.css) be included and the JavaScript extension file for the 
effect that you desire (i.e.: jqt.scrolling.js is required for vertical
and horizontal scrolling).

Once you have included the appropriate files simply add the class to a
container like so:

Vertical scroll example

	<div id="psuedo-page">
		<div class="toolbar">
			<h1>Example</h1>
		</div>
		<div class="vertical-scroll">
			<!-- 
				this div has a set height and width based on the orientation
				of the phone
			-->
			<div>
				<!-- this div is the one being scrolled -->
				...
				
				your content goes here
				
				...
			</div>
		</div>
	</div>

Horizontal scroll example

	<div id="psuedo-page">
		<div class="toolbar">
			<h1>Example</h1>
		</div>
		<div class="horizontal-scroll">
			<!-- 
				this div has a set width based on the orientation of the phone
			-->
			<table>
				<!-- this table is being scrolled -->
				...
				
				your content goes here
				
				...
			</table>
		</div>
	</div>


These extensions are *VERY* likely to *break* the slideSelector option in jQTouch.
So you will probably need to change that option when initializing jQTouch,
for example:

	var jQT = new jQTouch({
						slideSelector: '#jQT li a'
					});

This is only an example you can use whatever selector works best for you.
Be careful that you use the correct selector for the version of jQTouch
that your web app implements, as this selector may change. 

It might be better to just use a class selector then add that class to all
the links that you want to implement the slide animation. Like:

	var jQT = new jQTouch({
						slideSelector: '.slide-right'
					});
	
	
	
	<a href="#page-2" class="slide-right">Page 2</a>
	
	

There is another issue with jQTouch that can cause problems for these extensions,
and that is that jQTouch does not always properly update the orientation class (landscape & profile),
which is required for these extensions to display properly (I have submitted an 
issue ticket recently). A work around for this must be implemented by you the user 
do to the fact that the listener must be registered after jQTouch registers it's
orientationchange listener (in some versions of jQTouch this is not necessary, but some versions it is).
The work around code should be place after the jQTouch initialization.

	var jQT = new jQTouch({
						slideSelector: '.slide-right'
					});
					
	$(function()
	{
		$(window).bind('load orientationchange', function()
		{
			$('#jqt').removeClass('profile landscape').addClass(Math.abs(window.orientation) == 90 ? 'landscape' : 'profile');
			scrollTo(0,0);
		});
	});



There are examples with different versions of jQTouch at http://code.google.com/p/jqextensions/downloads/list

Please report any issues with the extensions at http://code.google.com/p/jqextensions/issues/list

