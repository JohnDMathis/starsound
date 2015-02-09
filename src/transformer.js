// var lerp = require( './lerper.js' );
var _ = require( 'lodash' );


function sum( values ) {
	var total = 0;
	for (var i = values.length; i--; ) {
		total += values[ i ];
	}
	return total;
}

function lerp( a, b, factor ) {
	insertions = factor + 1;
	var delta = ( b - a ) / insertions;
	var vals = [ a ];
	var x = a;
	for (var i = 1; i < insertions; i++) {
		x += delta;
		vals.push( x );
	}

	return vals;
}

function stretch( factor ) {
	// make the input array longer, by 'factor'
	var intValues = [];
	var leftVal;
	var rightVal;
	var skippedVal;
	var lerpVals;
	var i;
	for (i = 1; i <= _processedStream.length; i++) {
		leftVal = Number( _processedStream[ i - 1 ] );
		rightVal = Number( _processedStream[ i ] );
		// console.log( 'i:%s: %s | %s', i, leftVal, rightVal );
		if ( _.isNaN( rightVal ) ) {
			intValues.push( leftVal );
		} else {
			lerpVals = lerp( leftVal, rightVal, factor );
			intValues = intValues.concat( lerpVals );
			// console.log( 'intValues', intValues );
		}
	}
	_processedStream = intValues;

	return publicApi;
}

function normalize( newMin ) {
	if ( _.isNull( newMin ) || _.isUndefined( newMin ) ) {
		return publicApi;
	}
	// adjust all values equally, such that average values are set to 0
	var t = sum( _processedStream );
	var average = t / _processedStream.length;

	// console.log( 'normalize; sum: %s, len: %s, average: %s', t, _processedStream.length, average );
	_processedStream = _.map( _processedStream, function( val ) {
		return val - average;
	} );
	if ( newMin !== 0 ) {
		setBase( newMin );
	}
	return publicApi;
}

function setBase( newMin ) {
	// adjust all values such that the minimum value becomes newMin
	var min = Math.min.apply( null, _processedStream );
	var delta = newMin - min;

	_processedStream = _.map( _processedStream, function( val ) {
		return val + delta;
	} );

	return publicApi;
}

function multiply( factor ) {
	// multiply each value by factor
	_processedStream = _.map( _processedStream, function( val ) {
		return val * factor;
	} );
	return publicApi;
}

function truncateAt( lengthOrPercent ) {
	if ( lengthOrPercent < 0 ) {
		return publicApi;
	}
	var len = ( lengthOrPercent > 1 ) ? lengthOrPercent : _processedStream.length * lengthOrPercent;

	_processedStream = _processedStream.slice( 0, len );
	console.log( lengthOrPercent, len, _processedStream.length );
	return publicApi;
}

function result() {
	return _processedStream;
}
var _baseStream;
var _processedStream;
var _outputStream;

var publicApi = {
	stretch: stretch,
	normalize: normalize,
	multiply: multiply,
	setBase: setBase,
	truncateAt: truncateAt,
	result: result
};

module.exports = function transformer( stream ) {
	_baseStream = _processedStream = _.map( stream, function( val ) {
		return Number( val );
	} );
	return publicApi;
};