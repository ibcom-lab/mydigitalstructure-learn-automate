/*
	Automate factory example
*/

var mydigitalstructure = require('mydigitalstructure')
var _ = require('lodash')
var moment = require('moment');

module.exports = 
{
	VERSION: '0.0.0',

	init: function (param)
	{
		mydigitalstructure.add(
		{
			name: 'automate-start',
			code: function (param)
			{
				mydigitalstructure.invoke('automate-xxx')
			}
		});

		mydigitalstructure.add(
		{
			name: 'automate-complete',
			code: function (param, response)
			{
				var summary =
				{
					xxx: 'yyyy'
				};

				mydigitalstructure.invoke('util-end', summary)
			}
		});
	}
}