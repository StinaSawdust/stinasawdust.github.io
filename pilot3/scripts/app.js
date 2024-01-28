



    /////////////////////////
   //                     //
  //   Racetrack Tiles   //
 //                     //
/////////////////////////


var tilesNames = [

	'1a',
	'2a', '2b',
	'3a', '3b',
	'4a',
	'5a', '5b', '5c', '5d',
	'6a', '6b'
],
tileIndex = 0

function tiler(){

	var 
	tiles = Array.prototype.slice.call( document.querySelectorAll( '#tiles .card' )),
	tile  = tiles[ tileIndex ]

	if( tile.classList.contains( 'flip' )){

		tile.querySelector( '.front' ).style.backgroundImage = 'url(media/tiles/' + tilesNames.random() + '.png)'
		tile.classList.remove( 'flip' )
	}
	else {

		tile.querySelector( '.back' ).style.backgroundImage = 'url(media/tiles/' + tilesNames.random() + '.png)'
		tile.classList.add( 'flip' )
	}
	tileIndex = ( tileIndex + 1 ) % tiles.length
}




    //////////////////
   //              //
  //   Racecars   //
 //              //
//////////////////


var cars = [

	{ x: -180, r: 0, v: 0.20 },
	{ x: -240, r: 0, v: 0.25 },
	{ x: -360, r: 0, v: 0.30 }
]

function racer( timeNow ){

	var max = parseFloat( window.getComputedStyle( document.body ).width )

	if( timePrevious === null ) timePrevious = timeNow
	timeElapsed  = timeNow - timePrevious
	timePrevious = timeNow
	cars.forEach( function( car, i ){
		
		var
		carElement,
		wheelRearElement,
		wheelFrontElement

		car.x += car.v * timeElapsed
		if( car.x > max + 180 ) car.x = -400
		carElement = document.getElementById( 'car-'+ ( i + 1 ))
		carElement.style.left = car.x + 'px'

		car.r += car.v * timeElapsed
		if( car.r > 360 ) car.r = car.r % 360
		wheelRearElement = carElement.querySelector( '.wheel-rear' )
		wheelRearElement.style.transform = 'rotate('+ car.r +'deg)'
		wheelRearElement.style[ '-webkit-transform' ] = 'rotate('+ car.r +'deg)'
		wheelFrontElement = carElement.querySelector( '.wheel-front' )
		wheelFrontElement.style.transform = 'rotate('+ car.r +'deg)'
		wheelFrontElement.style[ '-webkit-transform' ] = 'rotate('+ car.r +'deg)'
	})
	requestAnimationFrame( racer )
}




    //////////////
   //          //
  //   Boot   //
 //          //
//////////////


window.requestAnimationFrame = window.requestAnimationFrame 
	|| window.mozRequestAnimationFrame 
	|| window.webkitRequestAnimationFrame 
	|| window.oRequestAnimationFrame

var timePrevious = null

document.addEventListener( 'DOMContentLoaded', function(){


	//  Get those racetrack tiles in order.

	Array.prototype.slice.call( document.querySelectorAll( '#tiles .front' )).forEach( function( tile ){


		tile.style.backgroundImage = 'url(media/tiles/' + tilesNames.random() + '.png)'
	})
	window.setInterval( tiler, 1000 )


	//  Cars got to race!

	requestAnimationFrame( racer )


	//  Enabled RSVP’ing after a ’lil pause cause spam.

	setTimeout( function(){

		var
		rsvpYes = document.getElementById( 'rsvp-yes' ),
		rsvpNo  = document.getElementById( 'rsvp-no' )

		rsvpYes.setAttribute( 'href', 

			'mailto:hello@stinasmith.com,stewart@stewd.io'
			+ '?subject=' + encodeURIComponent( 'Pilot RSVP YES' )
			+ '&body=' + encodeURIComponent( 'Yup, we’ll be at Pilot’s party on Saturday, October 4th between 11am and 2pm at 408 Myrtle Avenue, apartment 3! I’ll call Stina’s mobile (646-465-2843) or Stewart’s mobile (347-439-7930) if I run into trouble.' )
		)
		rsvpNo.setAttribute( 'href', 

			'mailto:hello@stinasmith.com,stewart@stewd.io'
			+ '?subject=' + encodeURIComponent( 'Pilot RSVP NO' )
			+ '&body=' + encodeURIComponent( 'Sorry, I can’t make it!' )
		)
	
	}, 500 )
})



