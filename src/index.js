var KeyReader = require( './keyReader.js' );
var importer = require( './importer.js' );
var _ = require( 'lodash' );
var transform = require( './transformer.js' );
var player = require( './player.js' );
var G117 = importer.import( "G117-rel-flux-t1" );
var comp1 = importer.import( "G117-rel-flux-c1" );
var playState = false;

player.addDataStream( 'G117', G117 );
player.addDataStream( 'comp1', comp1 );
player.addDataStream( 'boring', [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2 ] );

// var t1= transform(G117)
// 			.normalize()
// 			.stretch(100)
// 			.multiply(10);

player.addDataStream( 'G117-transform1', )
playSource( 1 );

function playSource( source ) {
	console.log( 'change to source', source );
	var sourceMap = {
		1: 'G117',
		2: 'comp1',
		3: 'boring'
	};
	player.play( sourceMap[ source ] );
	playState = true;
}

function changePlayState( newState ) {
	if ( newState === undefined ) {
		newState = !playState;
	}
	playState = newState;
	console.log( playState ? "playing" : "paused" );
	if ( playState ) {
		player.play();
	} else {
		player.stop();
	}
}

function togglePlayState() {
	changePlayState();
}
function pause() {
	changePlayState( false );
}

function play() {
	changePlayState( true );
}

function expand() {
	console.log( 'expand' );
}

function contract() {
	console.log( 'contract' );
}

function tuneUp() {
	console.log( 'tuneUp' );
}

function tuneDown() {
	console.log( 'tuneDown' );
}

function changeMode() {
	console.log( 'changeMode' );
}

function setBaseTone() {
	console.log( 'setBaseTone' );
}

function magnify() {
	console.log( 'magnify' );
	player.magnify();
}

function demagnify() {
	console.log( 'demagnify' );
	player.demagnify();
}

var keyActionMap = {
	1: playSource,
	2: playSource,
	3: playSource,
	p: togglePlayState,
	'up': tuneUp,
	'down': tuneDown,
	m: changeMode,
	b: setBaseTone,
	'+': magnify,
	'=': magnify,
	'-': demagnify
};

KeyReader( keyActionMap );


// var stretch2 = transformer.stretch( G117, 2 );

// var stretch5 = transformer.stretch( G117, 5 );

// var stretch10 = transformer.stretch( G117, 10 );


// NEXT:
// loop over values, using them inside baudio func
// add buttons to increase/decrease rate
// var len = stretch10.length;
// var pos = 0;
// var n = 0;
// var b = baudio( function( t ) {
// 	function sin( freq ) {
// 		// console.log( t, freq, tau * freq * t );
// 		return Math.sin( tau * freq * t );
// 	}
// 	// modes
// 	// simple
// 	var x = stretch10[ pos ];
// 	// var x = G117[ pos ];
// 	// var x = sin( G117[ pos ] * 100 ) * sin(400);

// 	// sin
// 	// var x = sin( stretch10[ pos ] );


// 	// var x = sin( 440 ) * sin( G117[ pos ] ) * sin( comp1[ pos ] );
// 	// var x = Math.sin( stretch10[ pos ] * 1200 ) * Math.sin( t * ( 800 / t ) );
// 	if ( pos >= len ) {
// 		pos = 0;
// 	} else {
// 		n++;
// 		if ( n == speedFactor ) {
// 			n = 0;
// 			pos += 1;
// 		}
// 	}
// 	// console.log( t, n, x );
// 	return x;
// } );
// b.play();