var PluginFactory = (function(){
    var loadedPlugins = {};
    var events = {};
    var register = function(name, init){
        loadedPlugins[name] = init();
    };
    var on = function(event, callback){
        if(!events[event])
            events[event] = [];
        events[event].push(callback);
    };
    var emit = function(event, data){
        if(events[event])
            for(var i = 0; i < events[event].length; i++){
                events[event][i](data);
            }
    };
    return {register: register,on:on, emit: emit};
})();
