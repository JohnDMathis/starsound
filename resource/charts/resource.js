module.exports = function( host ) {
	return {
		name: 'charts',
		actions: {
			get: {
				url: '/',
				method: 'GET',
				topic: 'get',
				handle: function( env ) {
					env.reply( { data: 'Hello there' } );
				}
			}
		}
	};
};