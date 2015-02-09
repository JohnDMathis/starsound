// configure repl

var repl = require( "repl" );
var importer = require( 'importer.js' );
var _ = require( 'lodash' );

var replServer = repl.start( {
	prompt: "ard > ",
} );

var dynamicallyLoadedModules = {
	importer: "importer.js",
	lerp: "./lerper.js"
};

function reload2() {
	var cachedItem;
	var cacheKeys = _.keys( require.cache );
	var dlmKeys = _.keys( dynamicallyLoadedModules );

	// find and unload only the dynamically loaded modules
	_.forEach( dlmKeys, function( dlmKey ) {
		console.log( 'checking', dlmKey );
		var match = _.find( cacheKeys, function( cacheKey ) {
			return cacheKey.indexOf( dlmKey ) > -1;
		} );
		if ( match ) {
			console.log( 'unloading', match );
			console.log( require.cache );
			delete require.cache[ match ];
			console.log( require.cache );
		}
	} );
	_.map( dynamicallyLoadedModules, function( val, key ) {
		console.log( 'load', key, val );
		replServer.context[ key ] = require( val );
	} );
}

// function reload() {
// 	var keys = _.keys( require.cache );
// 	_.forEach( keys, function( key ) {
// 		if ( key.indexOf( "repl" ) === -1 && key.indexOf( "lodash" ) === -1 ) {
// 			delete require.cache[ key ];
// 		}
// 	} );
// 	replServer.context.importer = importer;
// }


// replServer.context.importer = importer;
replServer.context.reload = reload2;
reload2();