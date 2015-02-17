var config = require( "configya" )(
	{
		file: "./config.json",
		defaults: { dataStreamMap: {}, useArduino: false }
	} );

var KeyReader;
if ( config.useArduino ) {
	require( "./duino.js" );
}
if ( config.useConsole ) {
	KeyReader = require( './keyReader.js' );
}

var host = require( 'autohost' );
var importer = require( './importer.js' );
var _ = require( 'lodash' );
var Transform = require( './transformer.js' );
var player = require( './player.js' );
var postal = require( 'postal' );

var commands = postal.channel( 'commands' );

host.init( {
	port: 8810,
	socketIO: true,
	websocket: false
} );

host.on( "socket.client.closed", function( data ) {
	console.log( "got socket.client.closed for id", data.id );
} );

host.on( "socket.client.identified", function( data ) {
	console.log( "client identified", data.id );
	player.startNofication( host.socket );
} );

commands.subscribe( "action", function( actionNum ) {
	console.log( "got action", actionNum );
	playSource( actionNum );
} );

commands.subscribe( "analog.changed.*", function( percentage ) {
	var stretchVals = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	var i = Math.round( percentage / stretchVals.length - 1 );
	setStretch( stretchVals[ i ] );
} );


_.each( config.dataStreamMap, function( item ) {
	console.log( 'import and add dataStream', item );
	var stream = importer.import( "./data/" + item );
	player.addDataStream( item, stream );
} );


player.addTransformer( 'a', function( stream ) {
	return Transform( stream )
		.truncateAt( 0.925 )
		.stretch( 4 )
		.normalize( 0 )
		.multiply( 10 )
		.result();
} );

player.addTransformer( 'b', function( stream ) {
	return Transform( stream )
		.truncateAt( 0.925 )
		.stretch( 6 )
		.normalize( 0 )
		.multiply( 10 )
		.result();
} );

function playSource( source ) {

	var sourceName = config.dataStreamMap[ source.toString() ];

	console.log( 'selected', sourceName );

	if ( sourceName ) {

		if ( player.getStreamName() === sourceName && player.isPlaying ) {
			player.stop();
		} else {
			player.play( sourceName );
		}

	} else {
		console.log( 'not found', source );
	}
}

function transform( id ) {
	player.useTransformer( id );
}

function clearTransform() {
	player.clearTransformer();
}

function expand() {
	customTransformValues.stretch += 1;
	console.log( 'expand', customTransformValues.stretch );
	player.useTransformer( 'custom' );
}

function contract() {
	customTransformValues.stretch -= 1;
	player.useTransformer( 'custom' );
}

function setStretch( newStretch ) {
	customTransformValues.stretch = newStretch;
	player.useTransformer( 'custom' );
}

function magnify() {
	customTransformValues.multiply += 0.25;
	player.useTransformer( 'custom' );
}

function demagnify() {
	customTransformValues.multiply -= 0.25;
	player.useTransformer( 'custom' );
}
function truncate() {
	var i = customTransformValues.truncateValueSelected;
	i++;
	if ( i >= customTransformValues.truncateValues.length ) {
		i = 0;
	}
	if ( !i ) {
		i = 0;
	}

	customTransformValues.truncateValueSelected = i;
	player.useTransformer( 'custom' );
}
function dump() {
	console.log( 'Playing [ %s ]', player.getStreamName() );
	var transformerName = player.getTransformerName();
	if ( transformerName ) {
		console.log( ' Transformer: [ %s ]', transformerName );
		if ( transformerName === 'custom' ) {
			_.each( customTransformValues, function( val, key ) {
				console.log( ' - %s: %s', key, val );
			} );
		}
	}
}

var customTransformValues = {
	stretch: 1,
	multiply: 1,
	truncateValues: [ -1, 0.98, 0.95, 0.925, 0.9, 0.85, 0.8 ],
	truncateValueSelected: 0,
	normalize: 0
};

player.addTransformer( 'custom', function( stream ) {
	return Transform( stream )
		.truncateAt( customTransformValues.truncateValues[ customTransformValues.truncateValueSelected ] )
		.normalize( customTransformValues.normalize )
		.multiply( customTransformValues.multiply )
		.stretch( customTransformValues.stretch )
		.result();
} );


if ( KeyReader ) {
	KeyReader( {
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
		t: truncate,
		'backspace': clearTransform,
		'up': magnify,
		'down': demagnify,
		'left': contract,
		'right': expand,
		' ': dump
	} );
}