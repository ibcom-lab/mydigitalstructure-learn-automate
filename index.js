/*
	See:
	https://learn-next.mydigitalstructure.cloud/learn-function-automation

	This is node app to automate tasks
	https://www.npmjs.com/package/lambda-local:

	lambda-local -l index.js -t 9000 -e event-0000-xxx.json
*/

exports.handler = function (event, context, callback)
{
	var mydigitalstructure = require('mydigitalstructure')
	var _ = require('lodash')
	var moment = require('moment');

	mydigitalstructure.set(
	{
		scope: '_event',
		value: event
	});

	//Event: {"site": "0000"}

	mydigitalstructure.set(
	{
		scope: '_context',
		value: context
	});

	mydigitalstructure.set(
	{
		scope: '_callback',
		value: callback
	});

	var settings;

	if (event != undefined)
	{
		if (event.site != undefined)
		{
			settings = event.site;
			//ie use settings-[event.site].json
		}
		else
		{
			settings = event;
		}
	}

	mydigitalstructure._util.message(
	[
		'-',
		'EVENT-SETTINGS:',
		settings
	]);

	mydigitalstructure.init(main, settings)
	mydigitalstructure._util.message('Using mydigitalstructure module version ' + mydigitalstructure.VERSION);
	
	function main(err, data)
	{
		var settings = mydigitalstructure.get({scope: '_settings'});
		var event = mydigitalstructure.get({scope: '_event'});

		mydigitalstructure._util.message(
		[
			'-',
			'SETTINGS:',
			settings
		]);

		var namespace = settings.automate.namespace;

		if (event.namespace != undefined)
		{
			namespace = event.namespace;
		}

		if (namespace != undefined)
		{
			mydigitalstructure._util.message(
			[
				'-',
				'NAMESPACE:',
				namespace
			]);

			var automatefactory = require('./automatefactory.' + namespace + '.js');
		}
		
		if (_.has(automatefactory, 'init'))
		{
			automatefactory.init();
		}
		
		mydigitalstructure.add(
		{
			name: 'util-log',
			code: function (data)
			{
				mydigitalstructure.cloud.save(
				{
					object: 'core_debug_log',
					data: data
				});
			}
		});

		mydigitalstructure.add(
		{
			name: 'util-end',
			code: function (data, error)
			{
				var callback = mydigitalstructure.get(
				{
					scope: '_callback'
				});

				if (error == undefined) {error = null}

				if (callback != undefined)
				{
					callback(error, data);
				}
			}
		});

		/* STARTS HERE! */

		var event = mydigitalstructure.get({scope: '_event'});

		var controller = event.controller;
		if (controller == undefined)
		{
			controller = 'automate-start'
		}

		mydigitalstructure.invoke(controller);
	}
}