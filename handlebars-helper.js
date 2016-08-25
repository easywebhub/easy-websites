'use strict';

var HandlebarsLayouts = require('handlebars-layouts');
var Helpers = require('handlebars-helpers');
var moment = require('moment');

module.exports = function (Handlebars) {
    Handlebars.registerHelper(HandlebarsLayouts(Handlebars));
    //  Helpers({handlebars: Handlebars});
    ['array', 'code', 'collection', 'comparison', 'date', 'fs', 'html', 'i18n', 'inflection', 'logging', 'markdown', 'match', 'math', 'misc', 'number', 'path', 'string', 'url'].forEach(function (name) {
        Helpers[name]({
            handlebars: Handlebars
        });
    });

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

    Handlebars.registerHelper('toString', function (obj) {
        return obj.toString();
    });

    Handlebars.registerHelper('removeIndex', function (url) {
        return url.replace('index.html', '');
    });

    Handlebars.registerHelper('lookupCategory', function (obj, childPath) {
        var chunks = childPath.split('.');
        var count = 0;
        var node = obj;
        chunks.some(function (name) {
            count++;
            var fullCategoryName = chunks.slice(0, count).join('.');
            var found = node.children.some(function (childNode) {
                if (childNode.category == fullCategoryName) {
                    node = childNode;
                    return true;
                }
                return false;
            });

            if (!found) {
                node = undefined;
                return true;
            }
            return false;
        });

        return node;
    });

    /**
     * Lookup nested object
     */
    Handlebars.registerHelper('lookupEx', function (obj, propertyPath) {
        var props = propertyPath.split('.');
        var current = obj;
        while(props.length) {
            if(typeof current !== 'object') return undefined;
            current = current[props.shift()];
        }
        return current;
    });

    /**
     * return array of category from root to leaf of @param {string} childPath
     */
    Handlebars.registerHelper('genBreadcrumb', function (obj, childPath) {
        var chunks = childPath.split('.');
        var count = 0;
        var node = obj;
        var ret = [];
        chunks.some(function (name) {
            count++;
            var fullCategoryName = chunks.slice(0, count).join('.');
            var found = node.children.some(function (childNode) {
                if (childNode.category == fullCategoryName) {
                    node = childNode;
                    ret.push(childNode);
                    return true;
                }
                return false;
            });

            if (!found) {
                ret = undefined;
                return true;
            }
            return false;
        });

        return ret;
    });

    Handlebars.registerHelper('formatDate', function (context, options) {
        var format = options.hash.format || "YYYY-MM-DD";

        if (context === "now") {
            context = new Date();
        }

        return moment(context).format(format);
    });
};
