var j5 = require( 'johnny-five' );
var postal = require( 'postal' );
var commands = postal.channel( 'commands' );
var _ = require( 'lodash' );
var board = new j5.Board( { isBlocked: true } );
var pins = [ 2, 4, 6, 8, 10 ];
// var btn1pin = 2;
// var btn2pin = 3;
// var btn3pin = 4;
// var btn4pin = 5;
// var btn5pin = 6;
// var btn6pin = 9;
// var btn7pin = 10;
// var btn8pin = 11;

board.on( 'ready', function() {
	_.each( pins, function( num, index ) {
		console.log( 'mapping pin [%s] action [%s]', num, index + 1 );
		new j5.Button( { pin: num, isPullup: true } )
			.on( 'release', function() {
				commands.publish( 'action', index + 1 );
			} );
	} );

	// new j5.Button( btn1pin ).on( 'release', function() {
	// 	commands.publish( 'action', 1 );
	// } );
	// new j5.Button( btn2pin ).on( "release", function() {
	// 	commands.publish( 'action', 2 );
	// } );
	// new j5.Button( btn3pin ).on( "release", function() {
	// 	commands.publish( 'action', 3 );
	// } );
	// new j5.Button( btn4pin ).on( "release", function() {
	// 	commands.publish( 'action', 4 );
	// } );
	// new j5.Button( btn5pin ).on( "release", function() {
	// 	commands.publish( 'action', 5 );
	// } );
	// new j5.Button( btn6pin ).on( "release", function() {
	// 	commands.publish( 'action', 6 );
	// } );
	// new j5.Button( btn7pin ).on( "release", function() {
	// 	commands.publish( 'action', 7 );
	// } );
	// new j5.Button( btn8pin ).on( "release", function() {
	// 	commands.publish( 'action', 8 );
	// } );

	var pot10K = new j5.Pin( { pin: "A0", mode: 0 } );
	var lastVal = -1;
	var lastPct = 0;
	var gate = 20;
	function showVal( val ) {
		if ( lastVal < val - 1 || lastVal > val + 1 ) {
			lastVal = val;
			console.log( 'val', val );
		}
	}
	function reportVal( val ) {
		var max = 1023;
		var pct;
		var halfGate = gate / 2;
		if ( lastVal < val - 1 || lastVal > val + 1 ) {
			pct = Math.round( ( val / max ) * 100 );
			if ( lastPct < ( pct - halfGate ) || lastPct > ( pct + halfGate ) ) {
				lastPct = pct;
				commands.publish( 'analog.changed.1', pct );
			}
		}
	}
	pot10K.on( 'data', function() {
		pot10K.read( reportVal );
	} );

} );

wrapper = {};
module.exports = wrapper;