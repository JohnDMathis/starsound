var gulp = require( 'gulp' );
var mocha = require( 'gulp-mocha' );
var exec = require( "child_process" ).exec;
var istanbul = require( 'gulp-istanbul' );
var open = require( 'open' ); //jshint ignore : line

function cover( type, done ) {
	gulp.src( [ './src/**/*.js' ] )
		.pipe( istanbul() )
		.pipe( istanbul.hookRequire() )
		.on( 'finish', function() {
			done( runSpecs( type ) );
		} );
}

function runSpecs( type ) { // jshint ignore : line
	return gulp.src( [ './spec/' + type + '/*.spec.js' ], { read: false } )
		.pipe( mocha( { reporter: 'spec' } ) );
}

function writeReport( cb, openBrowser, tests ) {
	tests
		// .on( 'error', function( e ) {
		// 	console.log( 'error occurred during testing', e.stack );
		// } )
		.pipe( istanbul.writeReports() );
	// .on( 'end', function() {
	// 	if ( openBrowser ) {
	// 		open( './coverage/lcov-report/index.html' );
	// 	}
	// 	cb();
	// } );
}

gulp.task( 'continuous-coverage', function( cb ) {
	cover( 'behavior', writeReport.bind( undefined, cb, false ) );
} );

gulp.task( 'continuous-test', function() {
	return runSpecs( 'behavior' );
	// .on( 'end', function() {
	// console.log( process._getActiveRequests() );
	// console.log( process._getActiveHandles() );
	// } );
} );

gulp.task( 'coverage', function( cb ) {
	cover( writeReport.bind( undefined, cb, true ) );
} );

gulp.task( 'test-watch', function() {
	gulp.watch( [ './src/**/*', './spec/**/*' ], [ 'continuous-test' ] );
} );

gulp.task( 'coverage-watch', function() {
	gulp.watch( [ './src/**/*', './spec/**/*' ], [ 'continuous-coverage' ] );
} );

gulp.task( 'behavior', function() {
	return runSpecs( 'behavior' )
		// .on( 'end', process.exit.bind( process, 0 ) )
		.on( 'error', process.exit.bind( process, 1 ) );
} );

gulp.task( 'integration', function() {
	return runSpecs( 'integration' )
		// .on( 'end', process.exit.bind( process, 0 ) )
		.on( 'error', process.exit.bind( process, 1 ) );
} );



gulp.task( 'default', [ 'continuous-coverage', 'coverage-watch' ], function() {} );

gulp.task( 'specs', [ 'continuous-test', 'test-watch' ], function() {} );