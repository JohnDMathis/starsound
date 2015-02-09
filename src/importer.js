var fs = require( 'fs' );
var path = require( 'path' );


function importFile( fileName ) {
	fileName += ".csv";

	var file = path.join( process.cwd(), fileName );
	if ( !fs.existsSync ) {
		return null;
	}

	var buffer = fs.readFileSync( file, { encoding: 'utf-8' } );
	var items = buffer.replace( /\r?\n|\r/g, '@' ).split( "@" );
	return items;

}

function saveData( data, factor ) {
	return;
	var dataStr = "";
	_.forEach( data, function( item ) {
		dataStr += item.toString() + String.fromCharCode( 13 );
	} );
	var fileName = "speed_" + factor + "x.csv";
	fs.writeFileSync( fileName, dataStr );
}

module.exports = {
	import: importFile
};
