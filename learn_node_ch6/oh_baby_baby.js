/**
 * Just practicing dealing with streams...
 */
var events = require('events');

function Baby() {
}
Baby.prototype = new events.EventEmitter();
Baby.prototype.__proto__ = events.EventEmitter.prototype;
Baby.prototype.poop_pants = function() {
	var self = this;
	self.emit('poop', 'diarrhea');
	setTimeout(function() {
		self.emit('cry', 'waaaaah');
	}, 2000);
}

var b = new Baby();

b.on("cry", function(sound) {
	console.log("The baby goes " + sound + " pick it up!");
})

b.on("poop", function(payload) {
		console.log("The baby has pooped, clean up the " + payload);
});

b.poop_pants();