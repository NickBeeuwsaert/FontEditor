var namedArray = function(elements){
    return function(arr){
        if(arr.length != elements.length) throw "SizeError: Argument needs to be "+elements.length+" elements long";
        var array = arr.slice();
        array.prototype = Array.prototype;
        for(var i = 0; i < elements.length; i++){
            if(array[elements[i]]) throw "PropertyError: Property '"+elements[i]+"' already exists!";
            array.__defineGetter__(elements[i], function(c){
                return function(){
                    return array[c];
                }
            }(i));
            array.__defineSetter__(elements[i],  function(c){
                return function(val){
                    array[c] = val;
                }
            }(i));
            var CamelCase = [];//String.fromCharCode(elements[i].charCodeAt(0) ^ (1<<5));
            var words = (elements[i]+"").split(/\s+/);
            for(var w = 0; w < words.length; w++){
                var char =String.fromCharCode(words[w].charCodeAt(0) & ~(1<<5));
                CamelCase.push(char+words[w].substr(1));
            }
            CamelCase = CamelCase.join('');
            array["get"+CamelCase] = function(c){
                return function(){
                    return array[c];
                };
            }(i);
            array["set"+CamelCase] = function(c){
                return function(val){
                    array[c] = val;
                };
            }(i);
        };
        return array;
    }
};
var EventListener = function(){
    var t = {};
    t.listeners = {};
    t.on = function(eventName, callback){
        t.listeners[eventName] = t.listeners[eventName] || [];
        t.listeners[eventName].push(callback);
    };
    t.fire = function(eventName, arguments){
        
        for(var i = -1; t.listeners[eventName][++i]; ){
            if(t.listeners[eventName][i](arguments))break;
        }
    };
    return t;
};
var Property = function(name, type){
    var t = EventListener();
    t.name = name;
    t.type = type || "generic";
    t.setValue = function(){};
    t.getValue = function(){return 0;};
    return t;
};
var IntProperty = function(name, min, max, step, defaultValue){
    var t = Property(name, "number");
    t.min = min;
    t.max = max;
    t.step = step;
    t.defaultValue = defaultValue;
    t.value = t.defaultValue;
    t.setValue = function(newValue){
        t.value = parseInt(newValue, 10);
    };
    t.getValue = function(){
        return t.value;
    };
    return t;
};
var FloatProperty = function(name, min, max, step,defaultValue){
    var t = IntProperty(name, min, max, step, defaultValue);
    t.setValue = function(newValue){
        t.value = parseFloat(newValue);
    };
    return t;
};
var EnumProperty = function(name, properties, defaultValue){
    var t = Property(name, "enum");
    t.values = properties;
    t.value = Math.min(parseInt(defaultValue,10)||0, properties.length);
    t.setValue = function(newValue){
        t.value = Math.min(parseInt(newValue,10), properties.length);
        console.log(newValue);
    };
    t.getValue = function(){
        return t.value;
    };
    return t;
};
var EnumPropertyItem = namedArray(["name", "description"]);
var BoolProperty = function(name, defaultValue){
    var t = Property(name, "bool");
    t.value = !!defaultValue;
    t.setValue = function(newValue){
        t.value = !!newValue;
    };
    t.getValue = function(){
        return !!t.value;
    };
    return t;
};
var PropertyList = function(props){
    var t = {};
    t.properties = props;
    t.toHTML =  function(){
        var fragment = document.createDocumentFragment();
        for(var i = 0; i < t.properties.length; i++){
            var property = t.properties[i];
            var label = document.createTextNode(property.name);
            fragment.appendChild(label);
            var input;
            switch(property.type){
                case "number":
                    input = document.createElement("input");
                    input.setAttribute("type", "number");
                    input.setAttribute("min", property.min);
                    input.setAttribute("max", property.max);
                    input.setAttribute("step", property.step);
                    input.addEventListener("change", function(e){
                        property.setValue(this.value);
                    });
                break;
                case "bool":
                    input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    input.checked = property.getValue();
                    input.addEventListener("change", function(e){
                        property.setValue(this.value);
                    });
                break;
                case "enum":
                    input = document.createElement("select");
                    for(var e = 0; e < property.values.length; e++){
                        var option = document.createElement("option");
                        option.appendChild(document.createTextNode(property.values[e].name));
                        option.value = e;
                        option.title = property.values[e].description;
                        input.appendChild(option);
                    }
                    input.addEventListener("change", function(e){
                        property.setValue(this.selectedIndex);
                    });
                break;
            }
            fragment.appendChild(input);
        }
        return fragment;
    };
    return t;
};