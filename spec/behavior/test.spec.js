require( 'should' );

describe( "test", function() {
	var test;
	before( function() {
		test = require( './test.js' );
	} );

	describe( "getState", function() {
		var s;
		before( function() {
			s = test.getState();
		} );
		it( 'returns state', function() {
			s.should.have.property( 'foo' );
			s.foo.should.equal( 'bam' );
		} );
	} );

	describe( "setBoo", function() {
		var s;
		before( function() {
			test.setBoo();
		} );
		it( 'says boo', function() {
			s = test.getState();
			s.foo.should.equal( 'boo' );
		} );
	} );

	describe( "setState", function() {
		var s;
		before( function() {
			test.setVar( 'whoop' );
		} );
		it( 'says whoop', function() {
			s = test.getState();
			s.foo.should.equal( 'whoop' );
		} );
	} );

	describe( "consuming a public prop", function() {
		it( "works", function() {
			test.prop.should.equal( 'wham' );
		} );
	} );

	describe( "setting a public prop", function() {
		it( "works", function() {
			test.prop = "wow";
			test.getProp().should.equal( "wow" );
		} );
	} );

} );