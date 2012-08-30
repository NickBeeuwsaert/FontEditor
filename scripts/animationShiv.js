(function(){
    var prefix = ["webkit","moz", "o"];
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = function(fn){setTimeout(fn, 10);};
        for(var i = 0; i < prefix.length; i++)
            if(window[prefix[i]+"RequestAnimationFrame"])
                window.requestAnimationFrame = window[prefix[i]+"RequestAnimationFrame"];
    }
})();