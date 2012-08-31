function hasClass(el, classname){
    return el.className.match(new RegExp("(?:^|\\s)"+classname+"(?!\\S)"));
}
function removeClass(el, classname){
    if(hasClass(el, classname))
        return el.className=el.className.replace(new RegExp("(?:^|\\s)"+classname+"(?!\\S)"),"");
    return true;
}
function addClass(el, classname){
    if(!hasClass(el, classname))
        return el.className+=" "+classname;
    return false;
}
function toggleClass(el, classname){
    if(hasClass(el, classname))
        return removeClass(el, classname);
    else
        return addClass(el,classname);
}
function lpad(string, char, length){while(string.length < length) string = char+string; return string;}

//Shims
//Node.prototype.on = Node.prototype.addEventListener;
Element.prototype.matchesSelector = (function(){
    if(Element.prototype.matchesSelector)
        return Element.prototype.matchesSelector;
    var prefix = ["o",
                  "moz",
                  "webkit",
                  "ms"];
    
    for(var i = 0; i < prefix.length; i++){
        if(Element.prototype[prefix[i]+"MatchesSelector"])
            return Element.prototype[prefix[i]+"MatchesSelector"];
    }
    return function(selector){
        var elements = (this.parentElement || this.document).querySelectorAll(selector);
        var i = -1;
        while(elements[++i] && elements[i]!=this);
        return !!elements[i];//Bang! Bang! You're BOOLEAN!
    };
}());
Element.prototype.ancestorQuerySelector = function(selector){
    var list = [];
    for(var i = this; i = i.parentElement; )
        if(i.matchesSelector(selector)) list.push(i);
    return list;
};