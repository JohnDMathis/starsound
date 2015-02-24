var j5 = require( 'johnny-five' );
var postal = require( 'postal' );
var commands = postal.channel( 'commands' );
var _ = require( 'lodash' );
var board = new j5.Board( { isBlocked: true } );
var pins = [ 2, 4, 6, 8, 10, 12 ];

board.on( 'ready', function() {
	_.each( pins, function( num, index ) {
		console.log( 'mapping pin [%s] action [%s]', num, index + 1 );
		new j5.Button( { pin: num, isPullup: true } )
			.on( 'release', function() {
				commands.publish( 'action', index + 1 );
			} );
	} );


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