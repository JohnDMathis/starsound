
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

function getProp() {
	return publicApi.prop;
}
var publicApi = {
	getState: getState.bind( state ),
	setBoo: setBoo.bind( state ),
	setVar: setVar.bind( state ),
	getProp: getProp.bind( state ),
	prop: 'wham'
};

module.exports = publicApi;