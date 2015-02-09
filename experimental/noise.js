var j5 = require( 'johnny-five' );
var songs = require( 'j5-songs' );

var board = new j5.Board();
var btn1pin = 4;
var btn2pin = 5;
var btn3pin = 6;
var btn4pin = 7;
var piezo;

playSong = function( songName ) {
	piezo.off();
	// Load a song object
	var song = songs.load( songName );

	// Play it !
	piezo.play( song );

	// List all songs
	songs.list( function( err, tunes ) {
		console.log( tunes );
		// Object literal with all the songs
	} );

};

function onButton( btn ) {
	console.log( 'button: ', btn );
	switch (btn) {
		case 1:
			piezo.tone( 100, 1000 );
			break;
		case 2:
			piezo.tone( 200, 1000 );
			break;
		case 3:
			piezo.tone( 300, 1000 );
			break;
		case 4:
			piezo.tone( 440, 1000 );
			break;
	}
}


board.on( 'ready', function() {
	piezo = new j5.Piezo( 8 );

	new j5.Button( btn1pin ).on( 'release', function() {
		onButton( 1 );
	} );
	new j5.Button( btn2pin ).on( "release", function() {
		onButton( 2 );
	} );
	new j5.Button( btn3pin ).on( "release", function() {
		onButton( 3 );
	} );
	new j5.Button( btn4pin ).on( "release", function() {
		onButton( 4 );
	} );
} );