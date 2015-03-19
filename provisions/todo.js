function Register () {
	BSS.entitySets.require(["user", "product"], function (UserEntity, ProductEntity) {
		UserEntity.on(UserEntity.events.StatusChecked, function() {
			this.status = "Ready";
		});
		BSS.eventsManager.connect(UserEntity, UserEntity.events.StatusChecked, function () {
			this.status = "Complete";
		});
	});
}



EntitySets: {
	Product: {
		model: new Module,
		controller: new Module,
		view: new View,
		Collection: {
			model: new Module,
			controller: new Module,
			view: new View
		}
	}
}

EntitySets: {
	Product: {
		models
		controllers
		views
		product.js  <----- returns main view
	}
}

EntitySets: {
	Product: {
		components: {
			ProductComponent1: {
				components: {},
				controller.js,
				view.js,
				model.js
			}
		},
		controller.js,
		view.js,
		model.js,
		entity.js /*
			{
				setData: function (obj) {},
				getData: function () {},
				render: function (containerId) {},
				dispose: function () {},
				initController: function () {}
			}
		*/
	}
}

user - roles

view: {
	controller: 'Controller',
	events: {

	},
	subViews: {
		rolesView: new RolesView(options)
	},
	render: {

	}
}

----



----


model: function() {
	properties:{
		firstName: null,
		Age: null,
		Roles: new RolesCollection(),
		Address: new AddressModel()
	}
}

















modules to implement:

	BSS.logs({
		turn: function (on) {},
		start: function (pathToFile) {},
		write: function (info) {},
		finish: function () {}
	});

	BSS.errors({
		show: function (name, args) {},
	});

	BSS.tests({
		initialize: function (configPath) {},
		executeRange: function (names) {},
		execute: function (name) {
			//fetch test module
			//execute asserts for test
		},
		assert: {
			async: function (/*args ???*/) {},
			//Instruct QUnit to wait for an asynchronous operation.
			deepEqual: function (/*args ???*/) {},
			//A deep recursive comparison, working on primitive types, arrays, objects, regular expressions, dates and functions.
			equal: function (/*args ???*/) {},
			//A non-strict comparison, roughly equivalent to JUnit’s assertEquals.
			expect: function (/*args ???*/) {},
			//Specify how many assertions are expected to run within a test.
			notDeepEqual: function (/*args ???*/) {},
			//An inverted deep recursive comparison, working on primitive types, arrays, objects, regular expressions, dates and functions.
			notEqual: function (/*args ???*/) {},
			//A non-strict comparison, checking for inequality.
			notPropEqual: function (/*args ???*/) {},
			//A strict comparison of an object’s own properties, checking for inequality.
			notStrictEqual: function (/*args ???*/) {},
			//A strict comparison, checking for inequality.
			ok: function (/*args ???*/) {},
			//A boolean check, equivalent to CommonJS’s assert.ok() and JUnit’s assertTrue(). Passes if the first argument is truthy.
			propEqual: function (/*args ???*/) {},
			//A strict type and value comparison of an object’s own properties.
			push: function (/*args ???*/) {},
			//Report the result of a custom assertion
			strictEqual: function (/*args ???*/) {},
			//A strict type and value comparison.
			throws: function (/*args ???*/) {},
			//Test if a callback throws an exception, and optionally compare the thrown error.
		}
	});

	BSS.ui({
		widgets: {},
		create: function () {},
		createRange: function () {},
		copy: function () {},
		replace: function () {},
		remove: function () {}
	});