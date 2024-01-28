

var 
applicationTitle = 'Stina Sawdust',
hashIsUpdatable = false




$( document ).ready( function(){

	
	//  We need to do a handshake with Google Analytics
	//  so let's get that rolling while we setup the rest.

	addGoogleAnalytics()


	//  Our document loads in at zero opacity
	//  so now would be a good time to fade it in.

	$( 'body' ).animate({ opacity: 1 }, { 
		
		duration: SECOND,
		queue: false
	 })


	//  At the moment an email link is clicked
	//  we must reveal the correct email address.

	$( 'a[user][host]' ).click( function(){

		var e = $( this )
		e.attr( 'href', 'mailto:' + e.attr( 'user' ) +'@'+ e.attr( 'host' ))
		return true
	})


	//  We have some click-through slideshows we need to enable;
	//  creating the navigation and attaching that to the DOM.

	$( '.slideshow' ).each( function(){
			
		var
		slideshowContainer = $( this ),
		slideNumber        = 0,
		slideNumberLast    = slideshowContainer.find( '.slide' ).length - 1,
		slideNumberLabel   = $( '<span>' ).text( ' / ' ),
		slideNumberUpdate  = function(){
			
			slideshowContainer.find( '.slide' ).each( function( i, slide ){

				$( slide ).animate({

					left: ( slideshowContainer.width() * ( i - slideNumber )) + 'px'
				
				}, 500, 'easeInOutCubic' )
			})
			slideNumberLabel.html(
			
				' '+ ( slideNumber + 1 ) +' <span class="soft">/ '+ ( slideNumberLast + 1 ) +'</span> '
			)
		},
		slideNext = function(){

			slideNumber = ( slideNumber + 1 ) % ( slideNumberLast + 1 )
			slideNumberUpdate()
			return false
		},
		slidePrevious = function(){

			slideNumber --
			if( slideNumber < 0 ) slideNumber = slideNumberLast
			slideNumberUpdate()
			return false
		}

		slideshowContainer.find( '.slide' ).each( function( i, slide ){

			//  We've also added an 'e-resize' cursor to img.slide in base.css.
			if( slide.nodeName.toLowerCase() === 'img' ){

				$( slide ).click( slideNext )
			}
		})
		slideshowContainer.after(
		
			$( '<div>' )
			.addClass( 'slideshowControls' )
			.append(
			
				$( '<a>' )
				.addClass( 'stealth' )
				.attr( 'href', '#' )
				.html( '&larr;' )
				.click( slidePrevious )
			)
			.append( slideNumberLabel )
			.append(
			
				$( '<a>' )
				.addClass( 'stealth' )
				.attr( 'href', '#' )
				.html( '&rarr;' )
				.click( slideNext )
			)
		)
		slideNumberUpdate()
	})


	//  To make things efficient for visitors on slow connections
	//  we load in very low res versions of our poster images
	//  and then here we'll do a request for the full res versions.

	$( 'img[fullres]' ).each( function( i, e ){

		var e = $( e )
		e.css({
			
			backgroundImage: 'url(' + e.attr( 'src' ) + ')',
			backgroundSize: '100% 100%'
		})
		e.attr( 'src', e.attr( 'fullres' ))
	})


	//  Did our page load with a URL hash already in place?
	//  If so we should honor that request by scrolling down the page.
	//  The browser seems to not like this idea initially
	//  which is why we use setTimeout() to wait 1 millisecond.

	setTimeout( scrollToHashTarget, 1 )


	//  Now that we're in business we need to start a loop
	//  that will check if we need to write a new URL hash
	//  at about 60 frames per second.

	setInterval( updateHash, 16 )
})




//  A visitor has clicked on a link that uses a hash
//  so we need to write that hash to the document's URL,
//  then scroll down the page to that hash's target.

function writeToHash( hash ){

	hashIsUpdatable = false
	document.location.hash = hash
	updateGoogleAnalytics()
	scrollToHashTarget()
	return false
}
function scrollToHashTarget(){

	var 
	hash = document.location.hash.substr( 1 ),
	a = $( $( '[anchor='+ hash +']' )[0] )

	if( a.length ){

		var
		y = a.offset().top,
		h = $( '#header' ).height() + 36,
		documentHeight = $( document ).height(),
		viewportHeight = $( 'body' ).height(),
		target = [ y - h, documentHeight - viewportHeight ].minimum()

		$( 'html, body' ).animate({

			scrollTop: y - h

		}, SECOND, 'easeInOutCubic', function(){

			hashIsUpdatable = true
		})
	}
	else hashIsUpdatable = true
}




//  As the visitor scrolls up and down the page
//  we need to automagically update the document's URL hash
//  to correspond to what they're looking at.
//  Is the hash updatable? 
//  If the user is just casually scrolling around, probably yes.
//  But if the user has clicked a hash link and we're 
//  automatically scrolling them up or down to where they need to be
//  then definitely NO! 
//  Other wise as soon as we tried to scroll them 
//  their hash target would be overwritten with whatever project
//  is currently in view!

function updateHash(){

	if( hashIsUpdatable === true ){
	
		var
		documentScrolledTo = $( document ).scrollTop(),
		documentHeight = $( document ).height(),
		viewportHeight = $( 'body' ).height(),
		hash  = document.location.hash,
		title = ''

		$( '[anchor]' ).each( function( i, e ){

			var
			anchorY = $( e ).offset().top - ( $( '#header' ).height() + 36 ),
			anchorHeight = $( e ).height()
			
			if( documentScrolledTo < 12 ){

				hash  = ''
				title = applicationTitle
			}
			else if(( anchorY <= documentScrolledTo && documentScrolledTo <= anchorY + anchorHeight ) || 
				( documentScrolledTo + viewportHeight > documentHeight - 12 && 
					documentScrolledTo <= anchorY )){

				hash  = '#' + $( e ).attr( 'anchor' )
				title = applicationTitle + ' — ' + $( e ).attr( 'label' )
			}
		})
		if( hash != document.location.hash ){

			if( hash ) document.location.hash = hash
			else removeHash()
			document.title = title
			updateGoogleAnalytics()
		}
	}
}
function removeHash(){ 

	var 
	scrollV,
	scrollH,
	loc = window.location

	if( 'pushState' in history ){

		history.pushState( '', document.title, loc.pathname + loc.search )
	}
	else {
		
		scrollV  = document.body.scrollTop
		scrollH  = document.body.scrollLeft
		loc.hash = ''
		document.body.scrollTop  = scrollV
		document.body.scrollLeft = scrollH
	}
}




function addGoogleAnalytics(){

	var ga, s
	window._gaq = window._gaq || []
	
	_gaq.push([ '_setAccount', 'UA-37360927-1' ])
	_gaq.push([ '_setAllowAnchor', true ])
	_gaq.push([ '_trackPageview', document.location.pathname + document.location.search + document.location.hash ])
	
	ga       =  document.createElement( 'script' )
	ga.type  = 'text/javascript'
	ga.async =  true
	ga.src   = ( 'https:' == document.location.protocol ? 'https://ssl' : 'http://www' ) + '.google-analytics.com/ga.js'
	
	s = document.getElementsByTagName( 'script' )[0]
	s.parentNode.insertBefore( ga, s )
}
function updateGoogleAnalytics(){

	_gaq.push([ '_trackPageview', document.location.pathname + document.location.search + document.location.hash ])
}



