
var state = {
	foo: 'bam'
};

function getState() {
	return this;
}

function setBoo() {
	this.foo = "boo";
}

function setVar( x ) {
	this.foo = x;
}

var wrapper = {
	getState: getState.bind( state ),
	setBoo: setBoo.bind( state ),
	setVar: setVar.bind( state )
};

module.exports = wrapper;