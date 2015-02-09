require( 'should' );
var pequire = require( 'proxyquire' );

var bFn;
var bPlayed = false;
var bStopped = false;

var baudioMock = function( fn ) {
	bFn = fn;
	return {
		play: function() {
			bPlayed = true;
		},
		end: function() {
			bStopped = true;
		}
	};
};

describe( "player", function() {
	var player;
	var s;
	var stream1 = [ 1 ];
	var stream2 = [ 2 ];

	before( function() {
		player = pequire( '../../src/player.js', { baudio: baudioMock } );
	} );

	describe( "default player values", function() {

		it( "mode is simple", function() {
			player.mode().should.equal( "simple" );
		} );
		it( "stretch is 0", function() {
			player.stretch().should.equal( 0 );
		} );
		it( "is paused", function() {
			player.isPlaying.should.equal( false );
		} );


	} );

	describe( "when setting an input stream array", function() {

		describe( "with string key and array", function() {
			before( function() {
				player.addDataStream( "s1", stream1 );
				s = player.getStream( "s1" );
			} );
			it( 'stores and retrieves the stream', function() {
				s.should.equal( stream1 );
			} );
		} );

		describe( "with non-string key", function() {
			before( function() {
				player.addDataStream( 3, stream1 );
				s = player.getStream( 3 );
			} );
			it( 'does not store stream', function() {
				( s === undefined ).should.be.true; //jshint ignore:line
			} );
		} );
		describe( "with non-array value", function() {
			before( function() {
				player.addDataStream( "foo", "boo" );
				s = player.getStream( "foo" );
			} );
			it( 'does not store stream', function() {
				( s === undefined ).should.be.true; //jshint ignore:line
			} );
		} );

	} );

	describe( "playing without specifying a stream or mode", function() {
		before( function() {
			player.addDataStream( "s1", stream1 );
			player.play();
		} );
		it( 'sets first stream as current stream', function() {
			player.currentStream().should.equal( stream1 );
		} );
		it( 'plays the stream', function() {
			bPlayed.should.be.true; // jshint ignore:line
		} );
		it( "uses current mode", function() {
			player.mode().should.equal( "simple" );
		} );
		it( 'indicates it is playing', function() {
			player.isPlaying.should.be.true; // jshint ignore:line
		} );
	} );

	describe( "when stopping the player", function() {
		before( function() {
			player.addDataStream( "s1", stream1 );
			player.play( "s1" );
			player.stop();
		} );
		it( "stops the audio", function() {
			bStopped.should.be.true; // jshint ignore:line
		} );
		it( "indicates it is stopped", function() {
			player.isPlaying.should.be.false; // jshint ignore:line
		} );
	} );

	describe( "playing and specifying a stream", function() {
		before( function() {
			player.addDataStream( "s1", stream1 );
			player.addDataStream( "s2", stream2 );
			player.play( "s2" );
		} );
		it( "plays the specified stream", function() {
			player.currentStream().should.equal( stream2 );
		} );
		it( 'indicates it is playing', function() {
			player.isPlaying.should.be.true; // jshint ignore:line
		} );
	} );

	describe( "playing without specifying a stream but there is a current stream", function() {
		before( function() {
			player.addDataStream( "s1", stream1 );
			player.addDataStream( "s2", stream2 );
			player.play( "s2" );
			player.play();
		} );
		it( "plays the current stream", function() {
			s = player.currentStream();
			s.should.equal( stream2 );
		} );
		it( 'indicates it is playing', function() {
			player.isPlaying.should.be.true; // jshint ignore:line
		} );
	} );



} );