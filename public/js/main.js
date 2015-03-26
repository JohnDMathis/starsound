
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


	var chart;
	var chartOptions;
	var stream;
	var streamLength = 0;

	var data = {
		labels: [],
		datasets: [
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0)",
				strokeColor: "#55f",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,0)",
				data: []
			}
		]
	};

	Chart.defaults.global.animation = false;
	Chart.defaults.global.animationSteps = 10;
	Chart.defaults.global.showTooltips = false;
	Chart.defaults.global.scaleShowLabels = false;
	Chart.defaults.global.bezierCurve = false;
	Chart.defaults.global.scaleLabel = "<%= value%>";

	var steps = 5;
	chartOptions = {
		pointDot: false,
		scaleShowVerticalLines: false,
		scaleShowHorizontalLines: false,
		scaleIntegersOnly: false,
		dataSetStroke: true,
		datasetStrokeWidth: 2,
		scaleOverride: false,
		// scaleSteps: steps,
		// scaleStartValue: 0,
		// scaleLineWidth: 1
	};

	function drawChart( _labels, _data ) {
		console.log( 'labels:', _labels.length, 'data:', _data.length );

		data.labels = _labels;
		data.datasets[ 0 ].data = _data;
		if ( chart ) {
			chart.destroy();
		}

		var min = _.min( _data );
		var max = _.max( _data );
		var range3rd = ( max - min ) / 3;
		var min2 = min - range3rd;
		var max2 = max + range3rd;
		console.log( "max: %s, min: %s", max, min );
		console.log( "rmax: %s, rmin: %s", max2, min2 );
		chartOptions.scaleStepWidth = max2 / steps;
		chartOptions.scaleStartValue = min2;

		chart = new Chart( ctx ).Line( data, chartOptions );
	}

	function configureSocket( host ) {
		var title = $( "h2" );
		console.log( 'configureSocket', host );
		var socket = window.socket = io.connect( "http://" + host.ipAddress + ":8810" );
		socket.on( 'connect', function() {
			console.log( 'connected!' );
		} );
		socket.on( 'stream.changed', function( msg ) {
			console.log( 'stream changed', msg.id );
			stream = msg.stream;
			title.html( msg.id );
			var labels = _.map( msg.stream, function( s, i ) {
				// return ( i + 1 ).toString();
				return "";
			} );
			drawChart( labels, msg.stream );
		} );
		socket.on( 'stream.stopped', function() {
			title.html( '' );
			drawChart( [], [] );
		} );
		socket.on( 'stretch.changed', function( msg ) {
			console.log( 'stretch value:', msg.value );
			// truncate stream by the stretch amount
			var newLength = Math.round( stream.length / msg.value );
			var shortStream = stream.slice( 0, newLength );
			console.log( "lengths:", newLength, shortStream.length, stream.length );
			var labels = _.map( shortStream, function( s, i ) {
				return "";
			} );
			drawChart( labels, shortStream );
		} );

	}

	$.get( '/api/app/host', configureSocket );


	var ctx = document.getElementById( "chart1" ).getContext( "2d" );

	$( "body" ).keypress( function( data ) {
		console.log( data.charCode, String.fromCharCode( data.charCode ) );
		socket.emit( "keypress", { key: String.fromCharCode( data.charCode ) } );
	} );


} );