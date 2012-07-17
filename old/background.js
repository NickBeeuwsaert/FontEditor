var background;
((background = function(){
var canvas = document.createElement("canvas"),
WallPaperSettings;
canvas.width = canvas.height = 4;
ctx = canvas.getContext("2d");
ctx.fillRect(0,0,4,4);
ctx.fillStyle="#aaa";

ctx.fillRect(1,0,1,1);
ctx.fillRect(0,1,1,1);
ctx.fillRect(2,2,1,1);
ctx.fillRect(3,3,1,1);
if((WallPaperSettings = JSON.parse(localStorage.getItem("wallpaper")))){
    console.log("WallPaperSettings are defined!", WallPaperSettings);
    document.querySelector("body").style.backgroundImage = "url("+(WallPaperSettings.url|| canvas.toDataURL())+")";
    document.querySelector("body").style.backgroundSize = WallPaperSettings.size || "auto";
    document.querySelector("body").style.backgroundColor = WallPaperSettings.color || "#eee";
    document.querySelector("body").style.backgroundRepeat = WallPaperSettings.repeat || "repeat";
    document.querySelector("body").style.backgroundPosition = WallPaperSettings.position || "center center";
}else{
    document.querySelector("body").style.backgroundImage = "url(http://assets.cld.me/1318279318/images/embed/image/body-bg.png)";

    //document.querySelector("body").style.backgroundImage = "url(http://f.cl.ly/items/3e0a1O1e0q0O123T471X/0016364992f305b14f04a697d38f-download2.jpg)";
    //document.querySelector("body").style.backgroundSize = "cover";
}
})());
