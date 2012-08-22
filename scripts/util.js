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