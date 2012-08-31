PluginFactory.register("TestTool", function(){
    PluginFactory.emit("register_tool", {"icon":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA9ElEQVQ4T6WTsQ4BQRBAXSHR8Rk6EvSCKEXEBwi1TklBzR8Qf0AohUIUEkL4DYUold7InrC53dvEJS/rZmffzgy8yJ+P53C+Qs7SlGcSpDnQhTo8IQYTaOkikyCvBCUlSLKOQd5TcPVFNsGMpAKcoAZt6MBQid4OWwtn9pswhR5IVVuIK5FVIJvS+14dvLPOQQZahoupBRncTt10ZM36iWqVqjLfMb0FKbUPDZCedcGGmAzy8wTNQCQD7Wb/1UkgyQfIBUhGxOSbsFYgmwlYBUiqxBYuAl9y40PUdmHYf2HN4aISyK8vDw/XCgxz/A2HVRAqeQH8QyYRX7U5BQAAAABJRU5ErkJggg==",
		mousedown: function(editor, data){

		},
		mouseup: function(editor, data){

		},
		mousemove: function(editor, data){

			if(data.which==1){
				if(editor.selectedNodes){
					editor.translate.x += data.rel.x;//*editor.zoom;
					editor.translate.y += data.rel.y;//*editor.zoom;
					return true;
				}else{
					for(var i = 0; i < editor.selectedNodes.length; i++){
						var node = editor.selectedNodes[i];
						var command = editor.pathData[node];

						command[command.length-2]+=data.rel.x/editor.zoom;
						command[command.length-1]-=data.rel.y/editor.zoom;//Subtract y because the canvas is inverted
					}
					//editor.translate.x += data.rel.x;
					//editor.translate.y += data.rel.y;
					return true;
				}
			}
		},
		tool_options: [
			BoolProperty("Boobs!", false)
		]
		});
});