var AppWindow = function(options){
    options = options || {};
    var T = this;
    this.form = util.create({name:"div",
                            properties: {className:"window"},
                            attributes: {"resize":"true"},
                            children:[
                                {name:"div",
                                    attributes:{
                                        class: "windowTitle",
                                    },children: [
                                        {name: 'div',
                                            attributes: {
                                                class: 'icon',
                                                style: 'background-image: url('+(options.icon||'')+')'
                                            }
                                        },
                                        {name: 'span',
                                            properties:{
                                                innerHTML: options.title || "Untitled"
                                            }
                                        },
                                        {name: 'ul',
                                         children: [
                                            {name: "li",
                                                properties:{className:"minimize"}, children: [/*{name: 'div'}*/]},
                                            {name: "li",
                                                properties:{className:"maximize"}, children: [/*{name: 'div'}*/]},
                                            {name: "li",
                                                properties:{className:"exit"}, children: [/*{name: 'div'}*/]},
                                        ]}
                                    ]
                                },
                                {name:"div",
                                    properties:{
                                        className: "windowContent"
                                    },
                                    children: [options.content || {}]
                                },
                                {name:"div",
                                    properties: {
                                        className: "resize"
                                    }
                                }
                            ]
                            });
    this.form.windowInstance = this;
    document.body.appendChild(this.form);
    if(options.width){
            this.setWidth(options.width);
    }
    if(options.height){
            this.setHeight(options.height);
    }
};
AppWindow.prototype = {
    getWidth: function(){
        return this.form.clientWidth;
    },
    setWidth: function(w,u){
        this.form.style.width = w + (u||"px")
    },
    getHeight: function(){
        return this.form.clientHeight;
    },
    setHeight: function(h, u){
        this.form.style.height = h+(u||"px");
    },
    setTitle: function(text){
        this.title.innerHTML = text;
    },
    getTitle: function(){
        return this.form.querySelector(".windowTitle");
    }

};
AppWindow.LastZIndex = 0;
document.addEventListener("mousedown", function(e){
   var t = e.target.parentNode;
   while(t && !util.hasClass(t,"window")){
       t = t.parentNode;
   }
   if(util.hasClass(t,"window")){
       t.style.zIndex = ++AppWindow.LastZIndex;
   }
}, false);
    var activeElement;
    document.addEventListener("mousemove", function(e){
            if(util.mouseDown[0] && activeElement && util.hasClass(activeElement, "resize")){
                t = activeElement.parentNode.windowInstance;
                o = util.getOffset(t.form);
                //console.log(":D");
                t.setWidth((e.clientX - o.left)+10);
                t.setHeight(Math.max(((e.clientY - o.top)+10) - 21,80));
                //t.setWidth(e.X);
            }
    }, true);
    document.addEventListener("mousedown", function(e){
                var t = e.target;
                    activeElement = t;
                if(util.hasClass(t, "windowTitle")){
                    o = util.getOffset(t);
                    t.mouseX = e.clientX - o.left;
                    t.mouseY = e.clientY - o.top;
                }else{
                    //activeElement = false;
                }
    }, false);
    document.addEventListener("mousemove", function(e){
        var t = activeElement;
        if(t && util.hasClass(t, "windowTitle") && util.mouseDown[0]){
            var npY = (e.clientY-t.mouseY),
                npX = (e.clientX-t.mouseX);
            if(npY < 0){
                npY = 0;
            }else if(npY+t.parentNode.clientHeight > window.clientHeight){
                npY = window.clientHeight;
            }
            t.parentNode.style.top =  npY + "px";
            t.parentNode.style.left = npX + "px";
        }
    }, false);
(function(){
    var handleTouchEvent = function(e){
        var first = e.changedTouches[0],
            t = "";
        switch(e.type){
            case "touchstart":
                t = "mousedown";
            break;
            case "touchmove":
                t = "mousemove";
            break;
            case "touchend":
                t = "mouseup";
            break;
            default: return; 
        }
        var evt = document.createEvent("MouseEvent");
        evt.initMouseEvent(t, true, true, window, 1,
                            first.screenX, first.screenY,
                            first.clientX, first.clientY, false,
                            false, false, false, 0, null);
        first.target.dispatchEvent(evt);
        e.preventDefault();
    };
    document.addEventListener("touchstart", handleTouchEvent, true);
    document.addEventListener("touchmove", handleTouchEvent, true);
    document.addEventListener("touchend", handleTouchEvent, true);
    document.addEventListener("touchcancel", handleTouchEvent, true);
}());
require('util.js', function(){
    document.querySelector('head, body').appendChild(
        util.create({name: "link",
                    attributes: {
                        href: "window.css",
                        type: "text/css",
                        rel: "stylesheet"}
                    }));
});
