var KeyReader = require( './keyReader.js' );
var importer = require( './importer.js' );
var _ = require( 'lodash' );
var Transform = require( './transformer.js' );
var player = require( './player.js' );
var G117 = importer.import( "G117-rel-flux-t1" );
var comp1 = importer.import( "G117-rel-flux-c2" );
var comp2 = importer.import( "G117-rel-flux-c3" );
var gd66 = importer.import( "GD66-rel-flux-T" );
var comp3 = importer.import( "GD66-rel-flux-c2" );

var playState = false;

player.addDataStream( 'G117', G117 );
player.addDataStream( 'comp1', comp1 );
player.addDataStream( 'comp2', comp2 );
player.addDataStream( 'gd66', gd66 );
player.addDataStream( 'comp3', comp3 );
player.addDataStream( 'boring', [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2 ] );

player.addDataStream( 'G117a',
	Transform( G117 )
		.stretch( 4 )
		.normalize()
		.multiply( 30 )
		.setBase( 0.10001 )
		.result() );

player.addDataStream( 'comp1a', Transform( comp1 )
	.stretch( 4 )
	.normalize()
	.multiply( 30 )
	.setBase( 0.0001 )
	.result()
);
player.addDataStream( 'comp2a', Transform( comp2 )
	.stretch( 4 )
	.normalize()
	.multiply( 30 )
	.setBase( 0.0001 )
	.result()
);
player.addDataStream( 'gd66a', Transform( gd66 )
	.stretch( 6 )
	.normalize()
	.multiply( 30 )
	// .setBase( 0.0001 )
	.result()
);
player.addDataStream( 'comp3a', Transform( comp3 )
	.stretch( 6 )
	.normalize()
	.multiply( 30 )
	// .setBase( 0.0001 )
	.result()
);

playSource( 1 );

function playSource( source ) {
	var sourceMap = {
		1: 'G117',
		2: 'comp1',
		3: 'boring',
		4: 'G117a',
		5: 'comp1a',
		6: 'comp2a',
		7: 'gd66',
		8: 'gd66a',
		9: 'comp3a'
	};
	console.log( 'change to source #%s (%s)', source, sourceMap[ source ] );

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
function dump() {
	console.log( player.currentStream() );
}

var keyActionMap = {
	1: playSource,
	2: playSource,
	3: playSource,
	4: playSource,
	5: playSource,
	6: playSource,
	7: playSource,
	8: playSource,
	9: playSource,
	p: togglePlayState,
	'up': tuneUp,
	'down': tuneDown,
	m: changeMode,
	b: setBaseTone,
	'+': magnify,
	'=': magnify,
	'-': demagnify,
	' ': dump
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