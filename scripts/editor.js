

function Editor(font, glyph){
    var data = {
        font: font,
        glyph:glyph,
        selectedNodes: [], //list of index's of all selected nodes
        pathData: superCanvas.parsePath(font.glyphs[glyph].data),
        canvas : document.createElement("canvas"),
        painting:false,
        startPainting: function(){data.painting = true; draw();},
        zoom: 0.5,
        translate: {x: 0, y: 0},
        getName: function(){
            return glyph+" U+"+lpad(glyph.charCodeAt(0).toString(16),"0", 4);
        }
        };

    //convert all shorthand curves = longhand...
    // I don't know if shorthand curves should be kept in or not
    if(0){
        var lastCP = {x: 0, y: 0};
        for(var i = 0; i < data.pathData.length; i++){
            var path = data.pathData[i];
            if(path[0] === "T"){
                var lP = data.pathData[i-1];
                var lX = parseFloat(lP[lP.length-2]);
                var lY = parseFloat(lP[lP.length-1]);
                var nCP = {
                  x: lX + (lX - parseFloat(lastCP.x)),
                  y: lY + (lY - parseFloat(lastCP.y))
                  };
            data.pathData[i] = ["Q", nCP.x, nCP.y, path[path.length-2], path[path.length-1]];
            }else if(path[0] === "Q"){
                lastCP.x = path[1];
                lastCP.y = path[2];
            }else{
                lastCP.x = path[path.length-2];
                lastCP.y = path[path.length-1];
            }
        }
    }
    if(0){
        var lastCoords = {x: 0, y: 0};
        for(var i = 0; i < data.pathData.length; i++){
            var path = data.pathData[i];
            if(path[0] === "Q"){
                var cp = {x: parseFloat(path[1]), y:parseFloat(path[2])};
                var end = {x: parseFloat(path[path.length-2]), y: parseFloat(path[path.length-1])};
                var cp1 = { x: lastCoords.x+ (2/3) * (cp.x-lastCoords.x),
                            y: lastCoords.y+ (2/3) * (cp.y-lastCoords.y)};
                var cp2 = { x: end.x       + (2/3) * (cp.x-end.x), 
                            y: end.y       + (2/3) * (cp.y-end.y)};
                //.log(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y, lastCoords.x, lastCoords.y);
                data.pathData[i] = ["C", cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y];
            }
            lastCoords = {x: parseFloat(path[path.length-2]), y: parseFloat(path[path.length-1])};
        }
    }
    var relMouseCoords = {x: 0, y: 0};
    var mouseCoords = {x: 0, y: 0};
    var mouseDown = false;
    var context = superCanvas(data.canvas);
    
    function draw(){
        var parent = data.canvas.parentNode || {offsetWidth:500, offsetHeight:500};
        data.canvas.width = parent.offsetWidth;
        data.canvas.height = parent.offsetHeight;
        context.save();
        context.translate(data.translate.x, data.translate.y);
        context.translate(0,data.canvas.height);
        context.scale(1,-1);
        context.scale(data.zoom, data.zoom);
        context.beginPath();
        context.drawPath(data.pathData);
        context.restore();
        context.stroke();
        context.closePath();
        //Start drawing control points....
        context.save();
        
        context.translate(data.translate.x, data.translate.y);
        context.translate(0,data.canvas.height);
        context.scale(1,-1);
        //context.scale(data.zoom, data.zoom);
        var lastPath;
        var lCP = {x:0, y:0};
        for( var i = 0; i < data.pathData.length; i++){
            context.save();
          var path = data.pathData[i];
          context.beginPath();
          context.rect((path[path.length-2]*data.zoom)-2.5, (path[path.length-1]*data.zoom)-2.5, 5,5);
          if(data.selectedNodes.indexOf(i)!==-1)
            context.fillStyle="blue";
          else if(context.isPointInPath(mouseCoords.x, mouseCoords.y))
            context.fillStyle="red";
          else
            context.fillStyle="black";
          context.stroke();
          context.fill();
          context.closePath();
          context.fillStyle="white";
          if(path[0] === "C"){
              lastPath = data.pathData[i-1];
              
              lCP = {x:path[3], y:path[4]};
              if(data.selectedNodes.indexOf(i)!==-1){
                  context.beginPath();
                  context.moveTo(lastPath[lastPath.length-2]*data.zoom, lastPath[lastPath.length-1]*data.zoom);
                  context.lineTo(path[1]*data.zoom, path[2]*data.zoom);
                  //context.stroke();
                  //context.closePath();
                  //context.beginPath();
                  context.moveTo(path[path.length-2]*data.zoom, path[path.length-1]*data.zoom);
                  context.lineTo(path[3]*data.zoom, path[4]*data.zoom);
                  context.stroke();
                  context.closePath();
                  
                  context.beginPath();
                  context.arc(lCP.x*data.zoom, lCP.y*data.zoom,3, 0, Math.PI*2, true);
                  if(context.isPointInPath(mouseCoords.x, mouseCoords.y)){
                      context.fillStyle="blue";
                  }else{
                      context.fillStyle="white";
                  }
                  context.fill();
                  context.stroke();
                  context.closePath();
                  
                  context.beginPath();
                  context.arc(path[1]*data.zoom, path[2]*data.zoom,3, 0, Math.PI*2, true);
                  if(context.isPointInPath(mouseCoords.x, mouseCoords.y)){
                      context.fillStyle="blue";
                  }else{
                      context.fillStyle="white";
                  }
                  context.fill();
                  context.stroke();
                  context.closePath();
              }
          }else if(path[0] === "Q"){
              
              lCP = {x:path[1], y:path[2]};
              if(data.selectedNodes.indexOf(i)!==-1){
                  context.beginPath();
                  context.moveTo(path[path.length-2]*data.zoom, path[path.length-1]*data.zoom);
                  context.lineTo(path[1]*data.zoom, path[2]*data.zoom);
                  context.stroke();
                  context.closePath();
                  context.beginPath();
                  context.arc(lCP.x*data.zoom, lCP.y*data.zoom,3, 0, Math.PI*2, true);
                  if(context.isPointInPath(mouseCoords.x, mouseCoords.y)){
                      context.fillStyle="blue";
                  }
                  context.fill();
                  context.stroke();
                  context.closePath();
              }
          }else if(path[0] === "T"){
              lastPath = data.pathData[i-1];
              context.beginPath();
              context.moveTo(path[path.length-2]*data.zoom, path[path.length-1]*data.zoom);
              var lX = parseFloat(lastPath[lastPath.length-2]),
                  lY = parseFloat(lastPath[lastPath.length-1]);
              var nCP = {
                  x: lX + (lX - parseFloat(lCP.x)),
                  y: lY + (lY - parseFloat(lCP.y))};
                  //console.log(JSON.stringify(nCP));
              lCP = nCP;
              
              if(data.selectedNodes.indexOf(i)!==-1){
                  context.lineTo(nCP.x*data.zoom, nCP.y*data.zoom);
                  context.stroke();
                  context.closePath();
                  context.beginPath();
                  context.arc(nCP.x*data.zoom, nCP.y*data.zoom,3, 0, Math.PI*2, true);
                  if(context.isPointInPath(mouseCoords.x, mouseCoords.y)){
                      context.fillStyle="blue";
                  }
                  context.fill();
                  context.stroke();
                  context.closePath();
              }
          }else{
              lCP = {x:path[path.length-2], y:path[path.length-1]};
          }
          context.restore();
        }
        context.restore();
        
        //draw baselines and all that stuff...
        
        context.beginPath();
        //draw guide at 0
        context.save();
        context.translate(data.translate.x, 0);
        context.translate(0,data.canvas.height);
        context.scale(1,-1);
        context.moveTo(0,0);
        context.lineTo(0,data.canvas.height);
        context.moveTo(font.glyphs[glyph].horiz*data.zoom,0);
        context.lineTo(font.glyphs[glyph].horiz*data.zoom,data.canvas.height);
        
        context.stroke();
        context.restore();
        
        
        context.save();
        context.translate(0, data.translate.y);
        context.translate(0,data.canvas.height);
        context.scale(1,-1);
        context.moveTo(0,0);
        context.lineTo(data.canvas.width,0);
        
        
        context.moveTo(0,font.descent*data.zoom);
        context.lineTo(data.canvas.width,font.descent*data.zoom);
        
        
        context.moveTo(0,font.ascent*data.zoom);
        context.lineTo(data.canvas.width,font.ascent*data.zoom);
        
        context.stroke();
        context.restore();
        
        context.closePath();
        PluginFactory.emit("draw", context);
        if(data.painting)
            window.requestAnimationFrame(draw);
    };
    var mouseHandler = function(e){
        e.preventDefault();
        var coords = {x: e.offsetX/*-this.offsetLeft*/, y: e.offsetY/*-this.offsetTop*/};
        var rel = {x:coords.x-mouseCoords.x, y:coords.y - mouseCoords.y};
        relMouseCoords = rel;
        mouseCoords = coords;
        var modifiers = 0;
        var ctrl = 1 << 0;
        var alt = 1 << 1;
        var shift = 1 << 2;
        if(e.ctrlKey){
          modifiers |= ctrl;
        }else if(e.altKey){
          modifiers |= alt;
        }else if(e.shiftKey){
          modifiers |= shift;
        }

        PluginFactory.emit(e.type, {which: e.which, coords: coords,rel: rel, modifiers: modifiers});
        /*if(mouseDown){
            if(data.selectedNodes.length===0 || e.ctrlKey){
                data.translate.x+=rel.x;
                data.translate.y+=rel.y;
            }else{
                for(var i = 0; i < data.selectedNodes.length;i++){
                    var p = data.pathData[data.selectedNodes[i]];
                    if(p[0] == "Q"){
                        for(var e = 1; e < (p.length-1)/2; e++){
                            //console.log(p[0], e*2-1, e*2, p.length-2, p.length-1);
                            p[e*2-1] = parseFloat(p[e*2-1]) + rel.x/data.zoom;
                            p[e*2]   = parseFloat( p[e*2] ) - rel.y/data.zoom
                        }
                    }else if(p[0] == "C"){
                        p[3] =  parseFloat(p[3]) + rel.x/data.zoom;
                        p[4] =  parseFloat(p[4]) - rel.y/data.zoom;
                        var nextPath = data.pathData[data.selectedNodes[i]+1];
                        if(nextPath[0] == "C"){
                            nextPath[1]=parseFloat(nextPath[1]) + rel.x/data.zoom;
                            nextPath[2]=parseFloat(nextPath[2]) - rel.y/data.zoom
                        }
                    }
                    p[p.length-2] = parseFloat(p[p.length-2])+rel.x/data.zoom;
                    p[p.length-1] = parseFloat(p[p.length-1])-rel.y/data.zoom;//subtract, because coordinates are from the bottom-left
                }
            }
        }
        if(e.ctrlKey){
            data.canvas.style.cursor="move";
        }else{
            data.canvas.style.cursor="auto";
        }*/
    };
    data.canvas.addEventListener("mousemove", mouseHandler, false);
    data.canvas.addEventListener("mouseup", mouseHandler, false);
    data.canvas.addEventListener("mousedown", mouseHandler, false);
    data.canvas.addEventListener("contextmenu", function(e){e.preventDefault(); e.stopPropagation(); return false;}, false);
    data.canvas.addEventListener("contextmenu", function(e){
        if(e.ctrlKey){
            e.preventDefault();
            e.stopPropagation();
        }
    },false);
    data.canvas.addEventListener("mousedown", function(e){
        mouseDown  = true;
        /*if(!e.ctrlKey){
            var emptyTheSelection = true;
            for(var i = 0; i < data.pathData.length; i++){
                var path = data.pathData[i];
                if(path[0] == 'Z') continue;
                context.beginPath();
                var Px = parseFloat(path[path.length-2]);
                var Py = parseFloat(path[path.length-1]);
                context.save();
                context.translate(data.translate.x, data.translate.y);
                context.translate(0,data.canvas.height);
                context.scale(1,-1);
                context.rect((Px*data.zoom)-3, (Py*data.zoom)-3, 6, 6);
                if(context.isPointInPath(mouseCoords.x, mouseCoords.y)){
                    emptyTheSelection = false;
                    if(e.shiftKey){
                        if(data.selectedNodes.indexOf(i)===-1)
                            data.selectedNodes.push(i);
                    }else{
                        data.selectedNodes = [i];
                    }
                }
                context.restore();
                context.closePath();
            }
            if(emptyTheSelection)
                data.selectedNodes = [];
        }*/
    }, false);
    data.canvas.addEventListener("mouseup", function(e){
        mouseDown  = false;
    }, false);
    //data.canvas.addEventListener("key
    draw();
    return data;
}
function fontEditor(font, tabs, outputs){
    
    var data = {
        'font': font,
        'tabs': tabs,
        'editors': [],
        'currentEditor': undefined
    };

    var keyHandler = function(e){
        var modifiers = 0;
        var ctrl = 1 << 0;
        var alt = 1 << 1;
        var shift = 1 << 2;
        if(e.ctrlKey){
          modifiers |= ctrl;
        }else if(e.altKey){
          modifiers |= alt;
        }else if(e.shiftKey){
          modifiers |= shift;
        }
        //console.log(modifiers.toString(2));
        //console.log("ASDF");
        PluginFactory.emit(e.type, {code: e.keyCode, modifiers: modifiers});
    };
    document.addEventListener("keydown", keyHandler, false);
    document.addEventListener("keyup", keyHandler, false);
    function activateHandler(editor){
        return function(){
            data.currentEditor = editor;
            data.currentEditor.startPainting();
            if(outputs.zoom){
                outputs.zoom.value = data.currentEditor.zoom;
            }
        };
    }
    function deactivateHandler(editor){
        return function(editor){
            data.currentEditor.painting = false;
        };
    }
    data.openGlyph = function(glyph){
            var editor = Editor(data.font, glyph);
            var tab = tabs.Tab(editor.getName(), editor.canvas, function(){
              PluginFactory.emit("glyph_activate", editor);
                data.currentEditor = editor;
                data.currentEditor.startPainting();
                outputs.zoom.value = data.currentEditor.zoom*100;
                }, function(){
                  PluginFactory.emit("glyph_deactivate", editor);
                    editor.painting = false;
                });
            data.editors.push(editor);
            if(data.editors.length===1){
                tabs.activateTab(tab.label);
            }
            return editor;
        }
    return data;
}