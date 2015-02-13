var osInfo = require( './osInfo.js' );

module.exports = function( host ) {
	return {
		name: 'app',
		actions: {
			host: {
				url: '/host',
				method: 'GET',
				topic: 'get',
				handle: function( env ) {
					env.reply( { data: { ipAddress: osInfo.getIpAddress() } } );
				}
			}
		}
	};
};