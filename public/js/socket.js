require( [], function() {

	function connect() {
		console.log( 'connecting' );
	}

	return {
		connect: connect
	};

} );