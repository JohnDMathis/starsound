require.config( {
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		'socketio': {
			exports: 'io'
		}
	},
	paths: {
		socketio: "../lib/socket.io",
		lodash: "../lib/lodash.min"
	}

} );


define( [ '../lib/chart.min.js', 'lodash', 'socketio' ], function( Chart, _, io ) {
	var ctx = document.getElementById( "chart1" ).getContext( "2d" );

	var data = {
		labels: [],
		datasets: [
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			}
		]
	};
	Chart.defaults.global.responsive = false;
	Chart.defaults.global.animation = false;
	Chart.defaults.global.animationSteps = 10;
	Chart.defaults.global.showTooltips = false;

	var chart;
	chart = new Chart( ctx ).Line( data, { pointDot: false, scaleShowVerticalLines: false, scaleShowHorizontalLines: false, dataSetFill: false } );

	var socket = io.connect( "http://localhost:8800" );
	socket.on( 'connect', function() {
		console.log( 'connected!' );
	} );
	socket.on( 'stream.changed', function( msg ) {
		console.log( 'stream changed', msg.id );
		var labels = _.map( msg.stream, function( s, i ) {
			return ( i + 1 ).toString();
		} );
		console.log( 'labels:', labels.length, 'data:', msg.stream.length );

		data.labels = labels;
		data.datasets[ 0 ].data = msg.stream;
		chart.destroy();
		chart = new Chart( ctx ).Line( data, { pointDot: false, scaleShowVerticalLines: false, scaleShowHorizontalLines: false, dataSetFill: false } );
	} );
	socket.on( 'hey.there', function( msg ) {
		console.log( 'hey there', msg );
	} );

} );