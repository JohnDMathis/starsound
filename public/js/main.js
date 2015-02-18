require.config( {
	baseUrl: "../lib",
	shim: {
		'socketio': {
			exports: 'io'
		}
	},
	paths: {
		socketio: "socket.io",
		lodash: "lodash.min",
		jquery: "jquery",
		chart: 'chart'
	}

} );

define( [ 'chart', 'lodash', 'socketio', 'jquery' ], function( Chart, _, io, $ ) {


	function configureSocket( host ) {
		console.log( 'configureSocket', host );
		var socket = io.connect( "http://" + host.ipAddress + ":8810" );
		socket.on( 'connect', function() {
			console.log( 'connected!' );
		} );
		socket.on( 'stream.changed', function( msg ) {
			console.log( 'stream changed', msg.id );
			var labels = _.map( msg.stream, function( s, i ) {
				// return ( i + 1 ).toString();
				return "";
			} );
			console.log( 'labels:', labels.length, 'data:', msg.stream.length );

			data.labels = labels;
			data.datasets[ 0 ].data = msg.stream;
			if ( chart ) {
				chart.destroy();
			}
			chart = new Chart( ctx ).Line( data, chartOptions );
		} );
		socket.on( 'hey.there', function( msg ) {
			console.log( 'hey there', msg );
		} );
	}

	$.get( '/api/app/host', configureSocket );

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
	// Chart.defaults.global.responsive = true;
	// Charts.defaults.global.maintainAspectRatio = true;

	var ctx = document.getElementById( "chart1" ).getContext( "2d" );
	var chart;

	Chart.defaults.global.animation = false;
	Chart.defaults.global.animationSteps = 10;
	Chart.defaults.global.showTooltips = false;
	Chart.defaults.global.scaleShowLabels = false;
	Chart.defaults.global.scaleLabel = "<%= value%>";


	chartOptions = {
		pointDot: false,
		scaleShowVerticalLines: false,
		scaleShowHorizontalLines: false,
		dataSetFill: false,
		// scaleOverride: true,
		// scaleSteps: 100,
		// scaleStepWidth: 100000,
		// scaleLineWidth: 0.5
	};

	chart = new Chart( ctx ).Line( data, chartOptions );


} );