
var handleFlex =  function(){
    var flexies = document.querySelectorAll("[data-flex]");
    for(var i = 0; i < flexies.length; i++){
        var flex = flexies[i];
        // true is vertical, false is horizontal
        var direction = (flex.getAttribute("data-flex-direction")||"vertical")=="vertical";
        //Ugly hack, querySelectorAll doesn't return an array, but an ArrayList, but this will force it into an array
        //something else I need to fix in the future, this will return all children of flex that have data-flex-weight, instead of the direct children
        var flexors = [].slice.call(flex.querySelectorAll("[data-flex-weight]"));
        var totalWeight = 0;
        var c;
        for(c = 0; c < flexors.length; c++){
            if(flexors[c].parentNode !== flex) continue;
            totalWeight += parseFloat(flexors[c].getAttribute("data-flex-weight")||0);
        }
        var total = 0;
        for(c = 0; c < flex.children.length; c++){
            var child = flex.children[c];
            if(child.nodeType !== 1) continue;
            if(flexors.indexOf(child) === -1){
                total += child["offset"+(direction?"Height":"Width")];
            }
        }
        for(c = 0; c < flexors.length; c++){
            if(flexors[c].parentNode !== flex) continue;
            var calculatedSize = (parseFloat(flexors[c].getAttribute("data-flex-weight")||0) / totalWeight)*(flex["offset"+(direction?"Height":"Width")]-total);
                flexors[c].style[direction?"height":"width"] = calculatedSize+"px";
        }
        
    }
};
window.addEventListener("resize",handleFlex, false);
document.addEventListener("DOMContentLoaded", handleFlex, false);
handleFlex();

