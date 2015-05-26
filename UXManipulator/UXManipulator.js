dojo.registerModulePath("UXManipulator", "../../widgets/UXManipulator");
dojo.provide("UXManipulator.UXManipulator");
mendix.widget.declare("UXManipulator.UXManipulator", {
   
    inputargs: {
       search : '',
       attribute : '', 
		placeholdercontext : '',
	   func : '',
       value : ''  ,
		focussetter : false,
		layoutlevel : false
    },
    
    startup : function(){
       // Observe a specific DOM element:
	 	if((dojo.isIE < 11) == false){
			this.observers = [];
			if(this.layoutlevel){
				var incubator = dojo.query('.mx-incubator')[0];
				
				this.observeDOM( incubator, dojo.hitch(this, this.checkReload), false);
				
			}
		}
		this.actLoaded();
        
    },
	
	uninitialize : function (){
		// remove observers
		// werkt niet voro layout widgets.
		for(var i=0; i<this.observers.length; i++){
			this.observers[i].disconnect();
			
		}
	},
    update : function (obj, callback){
		if(!this.layoutlevel){
			this.manipulateUX();
		}
    	callback && callback();
    	
    },
	checkReload : function (mutationrecord){
		
		mutationrecord = mutationrecord[0];
		// if class changed and previous was hidden
		if(mutationrecord.removedNodes.length > 0){
			this.manipulateUX(mutationrecord.removedNodes[0]);
		}
	},
	
	manipulateUX : function(nodeContext){
		var nodes = dojo.query(this.search, nodeContext);
			 
		for(var x = 0; x < nodes.length; x++){
		   dojo.attr(nodes[x], this.attribute, this.value);
		}
		this.setFocus();
	},
	setFocus : function(){
		if(this.focussetter){
				
			var elements = dojo.query(this.placeholdercontext+ " input", dojo.query(".mx-incubator")[0]);
					
			for(var i=0; i<elements.length; i++){
				var el = elements[i];
				if(this.visible(el)) {
					el.focus();
					break;
				}
				if(i > 20){
					// na 20 nog niets gevonden dan breaken maar.
					break;
				}
			}
		}
	},
	visible: function(e) {
		return e.offsetWidth > 0 && e.offsetHeight > 0;
	},
  
	MutationObserver : window.MutationObserver || window.WebKitMutationObserver,
	
	eventListenerSupported : window.addEventListener,
	observers: null,
	observeDOM : function(obj, callback){
        if( this.MutationObserver ){
            var obs = new MutationObserver(
				function(mutations, observer){
					callback(mutations);
				}
				
			);
			this.observers.push(obs);
			
			// observe for attribute change, Mendix changes the .class attribute. 
			obs.observe( obj, { childList:true});
        }
        else if( this.eventListenerSupported ){
			// IE lower than 11 not supported, to implement?!
        }
    }
	
	
});