(function(){
	tabs = document.querySelector("ul");
	moveLeft = tabs.querySelector(".left");
	moveRight = tabs.querySelector(".right");
	moveRight.addEventListener("mouseup", function(){
	    clearInterval(this.scroll);
	}, false);
	
	moveLeft.addEventListener("mouseup", function(){
	    clearInterval(this.scroll);
	},false);
	moveLeft.addEventListener("mousedown", function(){
	    clearInterval(this.scroll);
	    this.scroll = setInterval(function(){
	        tabs.scrollLeft += 10;
	    }, 100);
	}, false);
	moveRight.addEventListener("mousedown", function(){
	    clearInterval(this.scroll);
	    this.scroll = setInterval(function(){
	        tabs.scrollLeft -= 10;
	    }, 100);
	}, false);
	tabs.addEventListener("click", function(e){
	    console.log(util.hasClass(e.target.parentNode, "tabs"));
	    if(util.hasClass(e.target.parentNode, "tabs") && !util.hasClass(e.target, "scroll")){
	        for(var i = 0; i < tabs.children.length; i++){
	            util.removeClass(tabs.children[i], "active");
	        }
	        util.addClass(e.target, "active");
	    }
	    return true;
	}, true);
	window.addEventListener("resize", function(){
	    var s = tabs.scrollWidth - tabs.clientWidth;
	    if(s!==0){
	        util.removeClass(moveLeft, "disabled");
	        util.removeClass(moveRight, "disabled");
	    }else{
	        util.addClass(moveLeft, "disabled");
	        util.addClass(moveRight, "disabled");
	    }
	}, false);
}());	
(function(){
document.querySelector("head, body").appendChild(util.create({name: 'link', attributes: {href:'tabs.css', rel: 'stylesheet', type: 'text\/css'}}));
}())
