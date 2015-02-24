var keypress = require( 'keypress' );
var _ = require( 'lodash' );
var config;

module.exports = function( _config ) {
	config = _config;
	keypress( process.stdin );
	process.stdin.on( 'keypress', function( ch, key ) {
		if ( key && key.ctrl && key.name == 'c' ) {
			process.exit();
			return;
		}

		if ( _.isUndefined( config ) ) {
			if ( !ch ) {
				ch = '';
			}
			if ( !key ) {
				key = { name: '', ctrl: false };
			}
			console.log( "keypress: ch:[%s]; key:[%s]; ctrl: %s", ch, key.name, key.ctrl );
			return;
		}

		if ( ch && config[ ch ] ) {
			config[ ch ]( ch );
			return;
		}

		if ( key && key.name && config[ key.name ] ) {
			config[ key.name ]( key.name, key.ctrl );
			return;
		}

	} );

	process.stdin.setRawMode( true );
	process.stdin.resume();
};