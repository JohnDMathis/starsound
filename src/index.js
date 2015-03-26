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

host.on( "socket.client.identified", function( data ) {
	player.startNofication( host.socket );
} );

_.each( config.dataStreamMap, function( item ) {
	console.log( 'import and add dataStream', item );
	var stream = importer.import( "./data/" + item );
	player.addDataStream( item, stream );
} );

_.each( config.levelAdjustments, function( level, key ) {
	console.log( 'add level adjustment for [%s] to [%s]:', key, level );
	player.addTransformer( key, function( stream ) {
		return Transform( stream )
			.multiply( level )
			.result();
	} );
} );

function subscribe() {
	commands.subscribe( "action", function( actionNum ) {
		if ( actionNum === 6 ) {
			adjustVolume();
		} else {
			playSource( actionNum );
		}
	} );

	commands.subscribe( "analog.changed.*", function( percentage ) {
		var stretchVals = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
		var i = Math.round( percentage / stretchVals.length - 1 );
		setStretch( stretchVals[ i ] );
	} );
}

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

var currentLevel = 0;
var multiplyValues = [ 1, 1.5, 2, 2.5, 3, 3.5 ];
function adjustVolume() {
	currentLevel++;
	if ( currentLevel === multiplyValues.length ) {
		currentLevel = 0;
	}
	customTransformValues.multiply = multiplyValues[ currentLevel ];
	console.log( 'Adjust Volume to [%s]', customTransformValues.multiply );
	player.useTransformer( 'custom' );
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
	host.socket.notify( "stretch.changed", { value: customTransformValues.stretch } );
}

function contract() {
	customTransformValues.stretch -= 1;
	player.useTransformer( 'custom' );
	host.socket.notify( "stretch.changed", { value: customTransformValues.stretch } );
}

function setStretch( newStretch ) {
	customTransformValues.stretch = newStretch;
	player.useTransformer( 'custom' );
	host.socket.notify( "stretch.changed", { value: newStretch } );
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
function stop() {
	console.log( 'Stop' );
	player.stop();
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


var keyMap = {
	'1': playSource,
	'2': playSource,
	'3': playSource,
	'4': playSource,
	'5': playSource,
	'6': playSource,
	'7': playSource,
	'8': playSource,
	'9': playSource,
	'a': transform,
	'b': transform,
	'c': transform,
	'd': transform,
	't': truncate,
	'backspace': clearTransform,
	'`': clearTransform,
	'up': magnify,
	'down': demagnify,
	'left': contract,
	'right': expand,
	'-': contract,
	'=': expand,
	'.': stop,
	' ': dump
};

if ( KeyReader ) {
	KeyReader( keyMap );
}

function handleWebKeypress( data ) {
	if ( data && data.key && keyMap[ data.key ] ) {
		keyMap[ data.key ]( data.key );
	}
}

host.socket.on( "keypress", handleWebKeypress );


setTimeout( function() {
	subscribe();
}, 2000 );