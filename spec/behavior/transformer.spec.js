require( 'should' );
var Transform = require( '../../src/transformer.js' );

describe( "transformer", function() {
	describe( "when creating a transformer for a stream", function() {
		var transformedStream;
		before( function() {
			transformedStream = Transform( [ "1", "2" ] ).result();
		} );
		it( 'converts each entry to a number (just in case)', function() {
			transformedStream.should.eql( [ 1, 2 ] );
		} );
	} );

	describe( "multiplying a stream by a factor", function() {
		var stream = [ 1, 2, 3 ];
		var expectedStream = [ 2, 4, 6 ];
		var transformedStream;
		before( function() {
			transformedStream = Transform( stream ).multiply( 2 ).result();
		} );
		it( "multiplies each value in stream by factor", function() {
			transformedStream.should.eql( expectedStream );
		} );

	} );

	describe( "normalizing a stream", function() {
		var stream = [ 1, 2, 3, 2, 1, 2, 3 ];
		var expectedStream = [ -1, 0, 1, 0, -1, 0, 1 ];
		var transformedStream;
		before( function() {
			transformedStream = Transform( stream ).normalize().result();
		} );
		it( "adjusts all values equally such that average is 0", function() {
			transformedStream.should.eql( expectedStream );
		} );

	} );

	describe( "set stream to a minimum base value", function() {
		var stream = [ -10, 5, 8 ];
		var expectedStream = [ 0.5, 15.5, 18.5 ];
		var transformedStream;
		before( function() {
			transformedStream = Transform( stream ).setBase( 0.5 ).result();
		} );
		it( "adjusts all values such that minimum value is x", function() {
			transformedStream.should.eql( expectedStream );
		} );

	} );

	describe( "chaining normalize and setBase", function() {
		var stream = [ -10, 5, 8 ];
		var expectedStream = [ 0.5, 15.5, 18.5 ];
		var transformedStream;
		before( function() {
			transformedStream = Transform( stream )
				.normalize()
				.setBase( 0.5 ).result();
		} );
		it( "adjusts all values such that minimum value is x", function() {
			transformedStream.should.eql( expectedStream );
		} );
	} );
	describe( "stretching a stream (ascending)", function() {
		var stream = [ 1.0, 5.0, 10.0, 14.0 ];
		var factor = 5;
		var expectedStream = [ 1, 1.6666666666666665, 2.333333333333333, 2.9999999999999996, 3.666666666666666, 4.333333333333333, 5, 5.833333333333333, 6.666666666666666, 7.499999999999999, 8.333333333333332, 9.166666666666666,
		10, 10.666666666666666, 11.333333333333332, 11.999999999999998, 12.666666666666664, 13.33333333333333, 14 ];
		var transformedStream;

		before( function() {
			transformedStream = Transform( stream ).stretch( factor ).result();
		} );
		it( 'length is expected length', function() {
			transformedStream.length.should.equal( expectedStream.length );
		} );
		it( "interpolates \'factor\' values between each data point", function() {
			transformedStream.should.eql( expectedStream );
		} );

	} );

	describe( "stretching a stream (negative, ascending)", function() {
		var stream = [ -20, -10, -4, -2, 5 ];
		var factor = 3;
		var expectedStream = [ -20, -17.5, -15, -12.5, -10, -8.5, -7,
		-5.5, -4, -3.5, -3, -2.5, -2, -0.25, 1.5, 3.25, 5 ];
		var transformedStream;
		before( function() {
			transformedStream = Transform( stream ).stretch( factor ).result();
		} );
		it( 'length is expected length', function() {
			transformedStream.length.should.equal( expectedStream.length );
		} );
		it( "interpolates \'factor\' values between each data point", function() {
			transformedStream.should.eql( expectedStream );
		} );

	} );

	describe( "stretching a stream (descending)", function() {
		var stream = [ 5, -2, -4, -10, -20 ];
		var factor = 2;
		var expectedStream = [ 5, 2.6666666666666665, 0.33333333333333304, -2, -2.6666666666666665, -3.333333333333333,
		-4, -6, -8, -10, -13.333333333333334, -16.666666666666668, -20 ];
		var transformedStream;

		before( function() {
			transformedStream = Transform( stream ).stretch( factor ).result();
		} );
		it( 'length is expected length', function() {
			transformedStream.length.should.equal( expectedStream.length );
		} );
		it( "interpolates \'factor\' values between each data point", function() {
			transformedStream.should.eql( expectedStream );
		} );

	} );


} );