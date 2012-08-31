PluginFactory.register("ToolManager", function(){
	var tools = [];
    var activeEditor = null;
    var activeTool = null;
    var toolPalette = null;
    var toolButtons = [];
    var createOptionsDialog = function(title){
        var optionsWindow = document.createElement("div");
        addClass(optionsWindow, "toolWindow");
        var titleBar = document.createElement("div");
        titleBar.appendChild(document.createTextNode(title||"Tools!"));
        addClass(titleBar, "title");
        var content = document.createElement("div");
        addClass(content, "content");
        content.appendChild(document.createTextNode("Hello! Hi! how are you!"));
        optionsWindow.appendChild(titleBar);
        optionsWindow.appendChild(content);



        return optionsWindow;
    };
    var mouseDown = false;
    var target = null;
    document.addEventListener("mousedown", function(e){
        target = e.target;
        mouseDown = true;
    },true);
    var previous = undefined;
    document.addEventListener("mouseup", function(e){
        mouseDown = false;
        previous = undefined;

        if(target && target.matchesSelector(".title"))
            e.stopPropagation();
    },true);
    var propertiesToHtml = function(props){
        var container = document.createElement("div");
        for(var i = 0; i < props.length; i++){
            var property = props[i];
            var control = document.createElement("div");
            control.appendChild(document.createTextNode(property.name));
            control.appendChild(document.createTextNode(": "));
            if(props[i].type=="enum"){
                var select = document.createElement("select");
                for(var e = 0; e < property.values.length; e++){
                    var value = property.values[e];
                    var option = document.createElement("option");
                    option.value = e;
                    option.title = value.description;
                    option.appendChild(value.name);

                    select.appendChild(option);
                }
                control.appendChild(select);
            }else{
                var input = document.createElement("input");
                if(property.type=="number"){
                    input.type="number";
                    input.min = property.min;
                    input.max = property.max;
                    input.step = property.step;
                    input.value = property.value;
                }else if(property.type=="bool"){
                    input.type="checkbox";
                    console.log(property.getValue());
                    input.checked = property.getValue();
                }
                control.appendChild(input);
            }
            container.appendChild(control);
        }
        return container;
    };
    document.addEventListener("mousemove", function(e){
        if(target && target.matchesSelector(".title") && mouseDown){
            var win = target.ancestorQuerySelector(".toolWindow")[0];
            //console.log("ASDF");
            var offset = {x: e.clientX , y: e.clientY};
            if(!previous)
                previous = offset;
            var rel = {x: offset.x - previous.x, y: offset.y - previous.y};
            previous = offset;
            pos = {x: Math.max(0, Math.min(win.offsetLeft+rel.x,win.parentElement.clientWidth-win.clientWidth)),
                    y:Math.max(0, Math.min(win.offsetTop+rel.y,win.parentElement.clientHeight-win.clientHeight))};
            win.style.left = (pos.x/win.parentElement.clientWidth)*100 + "%";
            win.style.top = (pos.y/win.parentElement.clientHeight)*100 + "%";

            e.stopPropagation();

        }
    },true);
    var optionsDialog = createOptionsDialog();
    PluginFactory.on("register_tool", function(data){
        data.optionsDiv = data.tool_options?propertiesToHtml(data.tool_options):false;
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
            var optionContent = optionsDialog.querySelector(".content");
            while(optionContent.firstChild) optionContent.removeChild(optionContent.firstChild);
            optionContent.appendChild(tools[index-1].optionsDiv);
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
        document.querySelector(".contentView").appendChild(optionsDialog);
    }, false);

});