var baudio = require( 'baudio' );
var keypress = require( 'keypress' );
var fs = require( 'fs' );
var _ = require( 'lodash' );

var freq = 200;
var tau = 2 * Math.PI;
var values = [];
var frequencyChangeIndexes = [];
keypress( process.stdin );
process.stdin.on( 'keypress', function( ch, key ) {
	if ( !key ) {
		return;
	}

	if ( key.ctrl && key.name == 'c' ) {
		// saveData( values );
		console.log( 'frequency changes', frequencyChangeIndexes );
		process.exit();
		return;
	}

	if ( key.name == 'up' ) {
		freq += 100;

	} else if ( key.name == 'down' ) {
		freq -= 100;
	}
	console.log( 'frequency', freq );
	frequencyChangeIndexes.push( { index: values.length, frequency: freq } );
} );

process.stdin.setRawMode( true );
process.stdin.resume(); // var a = [
// 1
// ]

function saveData( data ) {
	var dataStr = "";
	_.forEach( data, function( item ) {
		dataStr += item.toString() + String.fromCharCode( 13 );
	} );
	fs.writeFileSync( 'values.txt', dataStr );
}


var n = 0;
var b = baudio( function( t ) {
	function sin( freq ) {
		return Math.sin( tau * t * freq );
	}
	// console.log( t, freq, t * freq, Math.sin( t * freq ) );
	var x = sin( freq ) * sin( freq / 3 ) * sin( freq / 4 ); // + Math.sin( n / 4 ) );
	// n += Math.sin( t );
	// console.log( t, n, x );
	values.push( x );
	return x;
} );
b.play();

// 033614625035