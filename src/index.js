var KeyReader = require( './keyReader.js' );
var importer = require( './importer.js' );
var _ = require( 'lodash' );
var Transform = require( './transformer.js' );
var player = require( './player.js' );

var G117 = importer.import( "G117-rel-flux-t1" );
var comp1 = importer.import( "G117-rel-flux-c2" );
var comp2 = importer.import( "G117-rel-flux-c3" );
var comp2b = importer.import( "G117-rel-flux-c3-b" );
var gd66 = importer.import( "GD66-rel-flux-T" );
var comp3 = importer.import( "GD66-rel-flux-c2" );

var playState = false;

player.addDataStream( 'G117', G117 );
player.addDataStream( 'gd66', gd66 );
player.addDataStream( 'comp1', comp1 );
player.addDataStream( 'comp2', comp2 );
player.addDataStream( 'comp2b', comp2b );
player.addDataStream( 'comp3', comp3 );
player.addDataStream( 'boring', [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2 ] );

player.addTransformer( 'a', function( stream ) {
	return Transform( stream )
		.truncateAt( 0.95 )
		.stretch( 4 )
		.normalize()
		.multiply( 30 )
		.setBase( 0.10001 )
		.result();
} );

player.addTransformer( 'b', function( stream ) {
	return Transform( stream )
		.truncateAt( 0.95 )
		.stretch( 6 )
		.normalize()
		.multiply( 30 )
		// .setBase( 0.0001 )
		.result();
} );

var customTransformValues = {
	stretch: 1,
	multiply: 1,
	truncateAt: -1,
	normalize: 0
};

player.addTransformer( 'custom', function( stream ) {
	return Transform( stream )
		.truncateAt( customTransformValues.truncateAt )
		.normalize( customTransformValues.normalize )
		.multiply( customTransformValues.multiply )
		.stretch( customTransformValues.stretch )
		.result();
} );

playSource( 1 );

function playSource( source ) {
	var sourceMap = {
		1: 'G117',
		2: 'gd66',
		3: 'comp1',
		4: 'comp2',
		5: 'comp2b'
	};
	console.log( 'change to source #%s (%s)', source, sourceMap[ source ] );

	player.play( sourceMap[ source ] );
	playState = true;
}

function transform( id ) {
	player.useTransformer( id );
}

function clearTransform() {
	player.clearTransformer();
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
	customTransformValues.stretch += 1;
	console.log( 'expand', customTransformValues.stretch );
	player.useTransformer( 'custom' );
}

function contract() {
	customTransformValues.stretch -= 1;
	console.log( 'contract', customTransformValues.stretch );
	player.useTransformer( 'custom' );
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
	a: transform,
	b: transform,
	c: transform,
	d: transform,
	p: togglePlayState,
	'backspace': clearTransform,
	'=': tuneUp,
	'-': tuneDown,
	m: changeMode,
	x: setBaseTone,
	'up': magnify,
	'down': demagnify,
	'left': contract,
	'right': expand,
	' ': dump
};

KeyReader( keyActionMap );