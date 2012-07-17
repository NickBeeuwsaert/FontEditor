var require = function(url, callback){
    var script = document.createElement("script"),
    libName = url.replace(/(^|.*\/)(.*)\.js/,"$2");
    callback = callback || function(){};
    libs = url.split(',');
    if(libs.length>1){
        var i = 0;
        libs.forEach(function(e,i){
            console.log("libs[%i]=%s",i,e);
            require(e,callback);
        });
        return;
    }
    if(window[libName]){
        callback(libName);
        return true;
    }else{
        script.onerror = script.onload = function(){
            callback(window[libName] = window[libName] || libName);
            callback = null;
        };
        script.src = url;
        document.querySelector("head, body").appendChild(script);
    }
    return libName;
};
