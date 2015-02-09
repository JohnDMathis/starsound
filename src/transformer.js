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

function stretch( values, factor ) {
	// make the input array longer, by 'factor'
	var intValues = [];
	var leftVal;
	var rightVal;
	var skippedVal;
	var lerpVals;
	var i;
	for (i = 1; i <= values.length; i++) {
		leftVal = Number( values[ i - 1 ] );
		rightVal = Number( values[ i ] );
		// console.log( 'i:%s: %s | %s', i, leftVal, rightVal );
		if ( _.isNaN( rightVal ) ) {
			intValues.push( leftVal );
		} else {
			lerpVals = lerp( leftVal, rightVal, factor );
			intValues = intValues.concat( lerpVals );
			// console.log( 'intValues', intValues );
		}
	}
	return intValues;
}

function normalize( values ) {
	// adjust all values equally, such that average values are set to 0

	var average = sum( values ) / values.length;

	return _.map( values, function( val ) {
		return val - average;
	} );
}

function multiply( values, factor ) {
	// multiply each value by factor
	return _.map( values, function( val ) {
		return val * factor;
	} );
}
module.exports = {
	stretch: stretch,
	normalize: normalize,
	multiply: multiply
};