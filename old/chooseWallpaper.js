(function(){
    document.querySelector("head, body").appendChild(util.create({name: "link",attributes: {href: "wallpaperChooser/style.css", type: "text\/css", rel: "stylesheet"}}));
    require("util.js,AppWindow.js",function(lib){
        if(lib === "AppWindow"){
            var currentSettings = JSON.parse(localStorage.getItem("wallpaper") || '{}');
            console.log("All Libraries included!");
            var div = util.create( {name:"div",
                                    properties:{
                                    },
                                    attributes:{
                                        style: "height: 100%;"
                                    },
                                    children:[
                                        {name: 'div',
                                         attributes:{
                                            class: "wallPaperView"
                                        },
                                        children:[{name:'ul', attributes:{class:"wallPaperSelect"}}]
                                        },
                                        {name: 'span', properties: {innerHTML: "Color: "}},
                                        {name:'select',
                                         attributes: {
                                            class: "colorChooser"
                                         }
                                        },
                                        {name: 'span', properties: {innerHTML: "Size: "}},
                                        {name:'select',
                                         attributes: {
                                            class: "size"
                                         }
                                        },
                                        {name: 'span', properties: {innerHTML: "repeat: "}},
                                        {name:'select',
                                         attributes: {
                                            class: "repeat"
                                         }
                                        },
                                        {name:'input',
                                         attributes:{
                                            value: 'save',
                                            type: 'button',
                                            class: 'save',
                                         }
                                        },
                                    ]
                                 });
            wpList = div.querySelector(".wallPaperView ul"),
            colorChooser = div.querySelector(".colorChooser"),
            wpSize = div.querySelector(".size"),
            wpSave = div.querySelector(".save"),
            wpRepeat = div.querySelector(".repeat");
            console.log(wpList);
            addWallpaper = function(ul, url, name){
                var li = document.createElement("li");
                li.innerHTML = name;
                li.setAttribute("tabindex",'0');
                li.style.backgroundImage = "url("+url+")";
                li.onclick = function(){
                    console.log("asdf");
                    siblings = wpList.querySelectorAll("li");
                    console.log(siblings);
                    for(i=0; i< siblings.length; i++){
                         util.removeClass(siblings[i],"selected");
                    }
                    util.addClass(this, "selected");
                };
                ul.appendChild(li);
            },addOption = function(select, opt){
                var option = util.create({name: 'option', properties: {innerHTML: opt} });
                select.appendChild(option);
            },addSize = function(select, size){
                var option = util.create({name: 'option', properties: {innerHTML: size} });
                select.appendChild(option);
            };
            var wallpapers = {
                "Fancy": "http://fonteditor.razerwolf.com/images/0016364992f305b14f04a697d38f-download2.jpg",
                "hatch'd": "http://fonteditor.razerwolf.com/images/body-bg.png",
                "StoneHenge":"http://fonteditor.razerwolf.com/images/wallpapers/02742_stonehenge_1280x1024.jpg"
            },colors = ["red", "yellow", "green", "turquoise", "blue", "tan"],
            sizes= {stretch: "100% 100%", tile: "auto", center: "50% 50%"},
            repeat=['no-repeat', 'repeat-x', 'repeat-y', 'repeat'];
            for(name in wallpapers){
               addWallpaper(wpList, wallpapers[name], name);
            }
        createBG = function(color){
            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
            canvas.width=200;//11;
            canvas.height=8;
            ctx.beginPath();
            ctx.rect(1,1,9,6);
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
            // this is dirty and disgusting... BUT SO IS YOUR MOM
            ctx.beginPath();
            ctx.fillStyle= "black";
            ctx.moveTo(198-8, 0);
            ctx.lineTo(190-8, 0);
            ctx.lineTo(194-8, 8);
            ctx.fill();
            ctx.closePath();
            return canvas.toDataURL();
        }
            colors.forEach(function(c){
                addOption(colorChooser, c);
            });
            repeat.forEach(function(c){
                addOption(wpRepeat, c);
            });
            for(size in sizes){
                addSize(wpSize, size);
            }
        ((colorChooser.onchange = function(){
             this.style.backgroundImage = "url("+createBG(this.options[this.selectedIndex].text)+")";
        }).apply(colorChooser));
        wpSave.onclick = function(){
               settings = {
                    url:  wallpapers[wpList.querySelector("li.selected").innerHTML],
                    color:colorChooser.options[colorChooser.selectedIndex].text,
                    repeat:wpRepeat.options[wpRepeat.selectedIndex].text,
                    size: sizes[wpSize.options[wpSize.selectedIndex].text],
                    };
            localStorage.setItem('wallpaper', JSON.stringify(settings));
            background();
        };
            var ColorChooserDialog = new AppWindow({title: "Wallpaper!", content: div, width: window.innerWidth*.6,
       height:window.innerHeight*.6});
        }
    });
    
}());
