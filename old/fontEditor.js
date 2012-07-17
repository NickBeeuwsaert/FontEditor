fontEditor = function(){
this.toolWindow =  new AppWindow({width: 40,
                         title: "Tools",
                         content: {name: 'ul', attributes: {class: 'toolPalette'},
                         children: [
                                {name: 'li', properties: {className: 'vector'}},
                                {name: 'li', properties: {className: 'freehand'}},
                         ]
                         },
                         icon: '/famfamfam/cake.png'
                         });
this.glyphs = new AppWindow({width: 800,
                             height: 600,
                             title: "Glyphs",
                             content: {name: "div", properties: {innerHTML: ":D"}}
});
};
(function(){
document.querySelector("head, body").appendChild(util.create({name: 'link', attributes: {href:'fontEditor.css', rel: 'stylesheet', type: 'text\/css'}}));
}())
