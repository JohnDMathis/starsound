var _ = require( 'lodash' );
var Baudio = require( 'baudio' );
var baudio;
var speedFactor = 1; // 1=.5, 2=.3333, 3=.25, 4=, 5=.125
var freq = 200;
var TAU = 2 * Math.PI;

var socket;

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
var currentTransformerName;

function startNofication( _socket ) {
	socket = _socket;
}

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

function getStreamName() {
	return streamName ? streamName : "none";
}

function getTransformer( id ) {
	return transformers[ id ];
}

function getTransformerName() {
	return currentTransformerName;
}
function useTransformer( id ) {
	id = id.toString();
	if ( id && transformers[ id ] ) {
		currentTransformer = transformers[ id ];
		currentTransformerName = id;
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

function stretch() {
	return _stretch;
}

function currentStream( streamId ) {
	if ( streamId && _streams[ streamId ] ) {
		// check for a transformer matching streamId
		// if present, apply it
		console.log( "setting stream to", streamId );
		var strm;
		if ( transformers[ streamId ] ) {
			var t = getTransformer( streamId );
			console.log( t );
			strm = t( _streams[ streamId ] );
		} else {
			strm = _streams[ streamId ];
		}

		if ( currentTransformer ) {
			stream = currentTransformer( strm );
		} else {
			stream = strm;
		}
		streamName = streamId;
		if ( socket ) {
			socket.notify( "stream.changed", {
				id: streamId,
				stream: stream,
				transformer: currentTransformerName
			} );
		}
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


function modeSimple( t ) {
	return stream[ pos ];
}

function play( streamId ) {
	if ( !baudio ) {
		baudio = new Baudio( processor );

	}
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
		baudio.play();
		publicApi.isPlaying = true;
	}
}

function stop() {
	if ( publicApi.isPlaying ) {
		baudio.end();
		baudio = null;
		publicApi.isPlaying = false;
		socket.notify( "stream.stopped" );
	}
}

var publicApi = {
	startNofication: startNofication,
	addDataStream: addDataStream.bind( state ),
	getStream: getStream.bind( state ),
	getStreamName: getStreamName,
	addTransformer: addTransformer,
	getTransformer: getTransformer,
	getTransformerName: getTransformerName,
	useTransformer: useTransformer,
	clearTransformer: clearTransformer,
	mode: mode.bind( state ),
	stretch: stretch.bind( state ),
	play: play.bind( state ),
	stop: stop.bind( state ),
	isPlaying: false,
	currentStream: currentStream.bind( state )
};

module.exports = publicApi;