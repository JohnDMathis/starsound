


function lerp( a, b, factor ) {
	var delta = ( b - a ) / factor;
	var vals = [ b ];
	var x = b;
	for (var i = factor - 1; i > 0; i--) {
		x -= delta;
		vals.unshift( x );
	}
	vals.unshift( a );

	return vals;
}

module.exports = lerp;