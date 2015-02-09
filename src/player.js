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
var _currentStream;
var _currentModeFn = _modes.simple;
var pos = 0;



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
		_currentStream = _streams[ streamId ];
	}
	return _currentStream;
}

function processor( t ) {
	if ( pos >= _currentStream.length ) {
		pos = -1;
	}
	pos += 1;
	return _currentModeFn( t );
}

var b = baudio( processor );

function modeSimple( t ) {
	return _currentStream[ pos ];
}

function play( streamId ) {
	if ( streamId ) {
		if ( !_streams[ streamId ] ) {
			return;
		}
		currentStream( streamId );
	} else if ( !_currentStream ) {
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
	mode: mode.bind( state ),
	playState: playState.bind( state ),
	stretch: stretch.bind( state ),
	play: play.bind( state ),
	stop: stop.bind( state ),
	isPlaying: false,
	currentStream: currentStream.bind( state )
};

module.exports = publicApi;