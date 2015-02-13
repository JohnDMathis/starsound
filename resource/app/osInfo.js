var os = require( "os" );
var _ = require( "lodash" );

function getIpAddress() {
	var ifaces = os.networkInterfaces();

	var preferredNics = [ "en0", "vnic0", "vnic1" ];
	var foundNic;

	for (var i = 0; i < preferredNics.length; i++) {
		var nics = ifaces[ preferredNics[ i ] ];
		if ( !nics ) {
			continue;
		}

		foundNic = _.find( nics, function( nic ) {
			return !nic.internal && nic.family === 'IPv4';
		} );
		if ( foundNic ) {
			break;
		}
	}

	return foundNic.address;
}

var wrapper = {
	getIpAddress: getIpAddress
};

module.exports = wrapper;