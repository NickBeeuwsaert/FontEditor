PluginFactory.register("TestTool", function(){
    PluginFactory.on("click", function(){
        console.log("Hello, world!");
    });
});