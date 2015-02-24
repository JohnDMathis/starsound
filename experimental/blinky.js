var j5 = require( 'johnny-five' );
var board = new j5.Board();

var LEDPIN = 13;
var BTNPIN = 2;
var ledOn = false;

board.on( 'ready', function() {
	var led = new j5.Led( LEDPIN );
	var btn = new j5.Button( {
		pin: BTNPIN,
		isPullup: true
	} );
	led.off();
	btn.on( 'release', function() {
		console.log( 'btn', ledOn );
		if ( ledOn ) {
			led.off();
		} else {
			led.on();
		}
		ledOn = !ledOn;
	} );

	// btn.on( 'release', function() {
	// 	console.log( 'release' );
	// 	led.off();
	// } );
} );