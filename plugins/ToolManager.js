PluginFactory.register("ToolManager", function(){
	var tools = [];
    var activeEditor = null;
    var activeTool = null;
    var toolPalette = null;
    var toolButtons = [];

    PluginFactory.on("register_tool", function(data){
    	var index = tools.push(data);
        var button = document.createElement("div");
        button.style.backgroundImage="url("+data.icon+")";
        button.style.width = "32px";
        button.style.height= "32px";
        if(toolPalette){
            toolPalette.appendChild(button);
        }
        toolButtons.push(button);
        button.onclick = function(){
            activeTool = tools[index-1];
            for(var i = 0; i < toolPalette.childNodes.length; i++){
                if(toolPalette.childNodes[i].nodeType == 1)
                    removeClass(toolPalette.childNodes[i], "active");
            }
            addClass(button, "active");
        };
    });
    var eventPasser = function(type, data){
        var handled = false;
        if(activeTool && activeTool[type])
            handled = activeTool[type](activeEditor, data);
        if(!handled){
            if(data.which==1){
                activeEditor.translate.x += data.rel.x;
                activeEditor.translate.y += data.rel.y;
            }
        }

    }
    PluginFactory.on("mousemove", function(data){
        eventPasser("mousemove", data);
    });
    PluginFactory.on("mousedown", function(data){
        eventPasser("mousedown", data);
    });
    PluginFactory.on("mouseup", function(data){
        eventPasser("mouseup", data);

    });
    PluginFactory.on("glyph_activate", function(editor){
        activeEditor = editor;
    });
    PluginFactory.on("draw", function(data){
        if(activeTool && activeTool.draw){
            activeTool.draw(activeEditor, data)
        }
    });
    window.addEventListener("load", function(){
        toolPalette = document.querySelector("#toolbox");
        for(var i = 0; i < toolButtons.length; i++){
            toolPalette.appendChild(toolButtons[i]);
        }
    }, false);

});