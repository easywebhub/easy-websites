'use strict';

var HandlebarsLayouts = require('handlebars-layouts');
var Helpers = require('handlebars-helpers');
var moment = require('moment');

module.exports = function (Handlebars) {
    Handlebars.registerHelper(HandlebarsLayouts(Handlebars));
    Helpers({handlebars: Handlebars});

    // dang ky rivetData helper block cho handlebars ở đây

    // rivetData helper, bat buoc key trong meta data cua content phai la 'rivetData'
    Handlebars.registerHelper('rivetData', obj => {
        if (obj.data.root.rivetData)
            return JSON.stringify(obj.data.root.rivetData);
        else
            return '{}';
    });

    Handlebars.registerHelper('json', function (obj) {
        return JSON.stringify(obj);
    });

    Handlebars.registerHelper('removeIndex', function (url) {
        return url.replace('index.html', '');
    });
    
    // child path must be a fulll path e.g. 'tin-tuc.tin-van-hoa', 'tin-tuc.tin-the-thao.quoc-te'
    /*
    var data = {
		'tin-tuc': ['1', '2', '3'],
		'tin-tuc.tin-van-hoa': ['4', '4', '4'],
		'tin-tuc.tin-the-thao': ['5', '5', '5'],
		'tin-tuc.tin-the-thao.quoc-te': ['7', '7', '7'],
		'tin-tuc.tin-kinh-te': ['6', '6', '6'],
	}
	(lookupChild data  'tin-tuc')
	result: ["tin-van-hoa", "tin-the-thao", "tin-kinh-te"]
    */
    Handlebars.registerHelper('lookupChild', function (obj, childPath) {
		var ret = {};
		for (var key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			if (key.startsWith(childPath)) {
				var chunks = key.substr(childPath.length).split('.');
				if (chunks.length > 1)
					ret[chunks[1]] = true;
			}
		}
		return Object.keys(ret);
    });

    Handlebars.registerHelper('formatDate', function (context, options) {
        var format = options.hash.format || "YYYY-MM-DD";

        if (context === "now") {
            context = new Date();
        }

        return moment(context).format(format);
    });
};

