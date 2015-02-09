var _ = require( 'lodash' );
var baudio = require( 'baudio' );
var speedFactor = 1; // 1=.5, 2=.3333, 3=.25, 4=, 5=.125
var freq = 200;
var TAU = 2 * Math.PI;

var state = {};
var _stretch = 0;
var _mode = "simple";
var _modes = {
	simple: modeSimple
};
var _streams = {};
var stream;
var streamName;
var _currentModeFn = _modes.simple;
var pos = 0;

var transformers = {};
var currentTransformer;

function addTransformer( id, fn ) {
	transformers[ id ] = fn;
}

function addDataStream( id, stream ) {
	if ( !_streams ) {
		_streams = {};
	}
	if ( !_.isString( id ) || !_.isArray( stream ) ) {
		return;
	}
	_streams[ id ] = stream;
}

function getStream( id ) {
	return _streams[ id ];
}

function getTransformer( id ) {
	return transformers[ id ];
}

function useTransformer( id ) {
	id = id.toString();
	console.log( 'useTransformer', id, transformers );
	if ( id && transformers[ id ] ) {
		currentTransformer = transformers[ id ];
		console.log( 'assigning transformer', currentTransformer );
		if ( publicApi.isPlaying ) {
			currentStream( streamName );
		}
	}
}
function clearTransformer() {
	currentTransformer = null;
	if ( publicApi.isPlaying ) {
		currentStream( streamName );
	}
}
function mode( newMode ) {
	if ( newMode === undefined ) {
		return _mode;
	}
}

function playState() {
	return _playState;
}

function stretch() {
	return _stretch;
}

function currentStream( streamId ) {
	if ( streamId && _streams[ streamId ] ) {
		if ( currentTransformer ) {
			console.log( 'use transformer' );
			stream = currentTransformer( _streams[ streamId ] );
		} else {
			console.log( 'just stream' );
			stream = _streams[ streamId ];
		}
		// stream = currentTransformer ?
		// 	currentTransformer( _streams[ streamId ] )
		// 	: _streams[ streamId ];
		console.log( 'stream changed from [ %s ] to [ %s ]', streamName, streamId, stream.length );
		streamName = streamId;
	}
	return stream;
}

function processor( t ) {
	if ( pos >= stream.length ) {
		pos = -1;
	}
	pos += 1;
	return _currentModeFn( t );
}

var b = baudio( processor );

function modeSimple( t ) {
	return stream[ pos ];
}

function play( streamId ) {
	if ( streamId ) {
		if ( !_streams[ streamId ] ) {
			return;
		}
		currentStream( streamId );
	} else if ( !stream ) {
		var keys = _.keys( _streams );
		if ( keys.length === 0 ) {
			return;
		}
		streamId = keys[ 0 ];
		currentStream( streamId );
	}

	if ( !publicApi.isPlaying ) {
		b.play();
		publicApi.isPlaying = true;
	}
}

function stop() {
	if ( publicApi.isPlaying ) {
		b.end();
		publicApi.isPlaying = false;
	}
}

var publicApi = {
	addDataStream: addDataStream.bind( state ),
	getStream: getStream.bind( state ),
	addTransformer: addTransformer,
	getTransformer: getTransformer,
	useTransformer: useTransformer,
	clearTransformer: clearTransformer,
	mode: mode.bind( state ),
	playState: playState.bind( state ),
	stretch: stretch.bind( state ),
	play: play.bind( state ),
	stop: stop.bind( state ),
	isPlaying: false,
	currentStream: currentStream.bind( state )
};

module.exports = publicApi;