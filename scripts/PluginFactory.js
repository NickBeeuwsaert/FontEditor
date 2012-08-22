var PluginFactory = (function(){
    var loadedPlugins = {};
    var events = {};
    /** 
     * register a new plugin
     * @param {string} name name of the function
     * @param {function} init initialization code for the function
     **/
    var register = function(name, init){
        loadedPlugins[name] = init();
    };
    /**
     * add a listener to the stack
     * @param {string} event the name of the event to listen for
     * @param {function} callback the callback function to call, parameters depend on the event type
     */
    var on = function(event, callback){
        if(!events[event])
            events[event] = [];
        events[event].push(callback);
    };
    /**
     * emit a event
     * @param {string} event the even name
     * @param {function} data the data for the event
     */
    var emit = function(event, data){
        if(events[event])
            for(var i = 0; i < events[event].length; i++){
                events[event][i](data);
            }
    };
    return {register: register,on:on, emit: emit};
})();
