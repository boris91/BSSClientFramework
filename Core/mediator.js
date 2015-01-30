BSS.modules.define(".mediator", null, function BSS$modules$define_moduleGetter_mediator () {
	"use strict";

	var _arraySlice = BSS.window.Array.prototype.slice,
		_channels = {};

	return {
		subscribe: function BSS$mediator$subscribe (name, callback, context) {
			var channel = _channels[name] || (_channels[name] = []);
			channel.push({
				context: context || this,
				callback: callback
			});
		},
		unSubscribe: function BSS$mediator$unSubscribe (name, context) {
			var channel = _channels[name],
				lastIndex = channel ? (channel.length - 1) : -1,
				i, subscriber;
			for (i = lastIndex; i >= 0; i--) {
				subscriber = channel[i];
				if (context === subscriber.context) {
					channel.splice(i, 1);
				}
			}
		},
		publish: function BSS$mediator$publish (name) {
			var channel = _channels[name],
				subscribersCount = channel && channel.length,
				args = _arraySlice.call(arguments, 1),
				i, subscriber;
			for (i = 0; i < subscribersCount; i++) {
				subscriber = channel[i];
				subscriber.callback.apply(subscriber.context, args);
			}
		}
	};
});