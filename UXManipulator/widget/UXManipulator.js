define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/query",
    "dojo/dom-attr",
    "dojo/has", 
    "dojo/_base/sniff"
], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoLang, dojoText, dojoHtml, dojoEvent, dojoQuery, dojoAttr, dojoHas, dojoSniff) {
    "use strict";

    // Declare widget's prototype.
    return declare("UXManipulator.widget.UXManipulator", [_WidgetBase], {
        search: '',
        attribute: '',
        placeholdercontext: '',
        func: '',
        value: '',
        focussetter: false,
        layoutlevel: false,

        startup: function() {
            // Observe a specific DOM element:
            if ((dojoHas("ie") < 11) == false) {
                this.observers = [];
                var incubator = dojoQuery('.mx-incubator')[0];
                this.observeDOM(incubator, dojoLang.hitch(this, this.checkReload), false);

            }
            this.actLoaded();

        },

        uninitialize: function() {
            // remove observers
            // werkt niet voro layout widgets.
            for (var i = 0; i < this.observers.length; i++) {
                this.observers[i].disconnect();

            }
        },
        update: function(obj, callback) {
            if (!this.layoutlevel) {
                this.manipulateUX(dojoQuery('.mx-incubator')[0]);
            }
            callback && callback();

        },
        checkReload: function(mutationrecord) {

            mutationrecord = mutationrecord[0];
            // if class changed and previous was hidden
            if (mutationrecord.removedNodes.length > 0) {
                this.manipulateUX(mutationrecord.removedNodes[0]);
                if (!this.layoutlevel) {
                    this.observers[0].disconnect();
                }
            }
        },

        manipulateUX: function(nodeContext) {
            var nodes = dojoQuery(this.search, nodeContext);

            for (var x = 0; x < nodes.length; x++) {
                dojoAttr.set(nodes[x], this.attribute, this.value);
            }
            this.setFocus(nodeContext);
        },
        setFocus: function(nodeContext) {
            if (this.focussetter) {

                var elements = dojoQuery(this.placeholdercontext + " input", nodeContext);

                for (var i = 0; i < elements.length; i++) {
                    var el = elements[i];
                    if (this.visible(el)) {
                        el.focus();
                        break;
                    }
                    if (i > 20) {
                        // na 20 nog niets gevonden dan breaken maar.
                        break;
                    }
                }
            }
        },
        visible: function(e) {
            return e.offsetWidth > 0 && e.offsetHeight > 0;
        },

        MutationObserver: window.MutationObserver || window.WebKitMutationObserver,

        eventListenerSupported: window.addEventListener,
        observers: null,
        observeDOM: function(obj, callback) {
            if (this.MutationObserver) {
                var obs = new MutationObserver(
                    function(mutations, observer) {
                        callback(mutations);
                    }

                );
                this.observers.push(obs);

                // observe for attribute change, Mendix changes the .class attribute. 
                obs.observe(obj, { childList: true });
            }
            else if (this.eventListenerSupported) {
                // IE lower than 11 not supported, to implement?!
            }
        }

    });
});
require(["UXManipulator/widget/UXManipulator"], function() {
    "use strict";
});