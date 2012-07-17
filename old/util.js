/*jslint devel: true, regexp: true, browser: true, unparam: true, sloppy: true, vars: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
(function () {
    util = {
        "isHTMLElement": function (e) {
            try {
                return e instanceof HTMLElement;
            } catch (E) {
                return (typeof(e) === "object") &&
                        (e.nodeType === 1);
            }
        },
        "create": function (p) {
            var element = document.createElement(p.name || "div"),
            i;
            for (i in p.attributes) {
                element.setAttribute(i, p.attributes[i]);
            }
            if (typeof(p.children) !== undefined && p.children instanceof Array) {
                for (i = 0; i < p.children.length; i += 1) {
                    if (util.isHTMLElement(p.children[i])) {
                        element.appendChild(p.children[i]);
                    } else {
                        element.appendChild(util.create(p.children[i]));
                    }
                }
            }
            if (typeof(p.properties) !== undefined && typeof(p.properties) === "object") {
                for (i in p.properties) {
                    element[i] = p.properties[i];
                }
            }
            return element;
        },
        "getOffset": function (el) {
            var x = 0, y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                x += el.offsetLeft - el.scrollLeft;
                y += el.offsetTop - el.scrollTop;
                el = el.parentNode;
            }
            return {"top": y, "left": x};
        },
        "scrollbarWidth": function () {
            var inner = document.createElement('p');
            inner.style.width = "100%";
            inner.style.height = "200px";
            
            var outer = document.createElement('div');
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild(inner);
            
            document.body.appendChild(outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 == w2) {
                w2 = outer.clientWidth;
            }
            
            document.body.removeChild(outer);
            
            return (w1 - w2);
        },
        "hasClass": function hasClass(el, name) {
            if (el)
            return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
            return false;
        },
        "addClass": function addClass(el, name)
        {
            if (!util.hasClass(el, name)) {
                el.className += (el.className ? ' ' : '') + name;
            }
        },
        "removeClass": function removeClass(el, name)
        {
            if (util.hasClass(el, name)) {
                el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
            }
        }
    };
    util.mouseDown = [0,0,0,0,0,0,0,0,0];
    util.mouseDownCount = 0;
    window.addEventListener("mousedown", function(e){
        util.mouseDown[e.button] = true;;
        ++util.mouseDownCount;
    }, false);
    window.addEventListener("mouseup", function(e){
        util.mouseDown[e.button] = false;
        --util.mouseDownCount;
    }, false);
}());
String.prototype.pad = function(len, char){ char = char || '0';str = this.toString(); while(str.length<len){str = char + str;} return str;}
window.addEventListener("load", function(){
    window.scrollWidth = util.scrollbarWidth();
},false);
