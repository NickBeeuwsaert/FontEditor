PluginFactory.register("TestTool", function(){
	var path = [];
	var currentPath = [];
	var currentPoint = {x: 0, y: 0};
	var cp = [{x:0, y: 0}, {x: 0, y: 0}];

	var snap = function(p, a){
		var distance = Math.sqrt(Math.pow(p.x,2) + Math.pow(p.y, 2));
		var angle = Math.atan2(p.y, p.x);
		angle = (Math.round(angle / a) * a);
		return {x: distance * Math.cos(angle),
			 y: distance * Math.sin(angle)};

	};
    PluginFactory.emit("register_tool", {"icon":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA9klEQVQ4T2NkIB4IAJXKA/FFZC2MROi3B6rZB8QHgdgRiPOBeBJMHzEG7AYqFgZiQyTLQOwLID4hA0DO7gVif6ghID11QNxMrAvigAprgFgVqgHkFWdSwuAOULEyVMMHqDceEGsAyOlFSIpB3tiErBlfGID8fguIRaEa5gPpJHTN+AxYDZQMgWo4D6SdgBjkBQyALRbygKomIqk0ALJREg++MNAHSp4BYhaoIpREQ4wL1gAVBQExyGXrgDgYmyZcLlAASoDiHBTSoEADRR9Wf+MyAJRoQPgTEBcC8UNCtoPkkQNxDpB/GS0ACZqBbAAo7gk6Gd1EAK3yIxFLHOZbAAAAAElFTkSuQmCC",
    	
		mousedown: function(editor, data){

			/*console.log(data);
			if(data.which == 1){
				if(!currentPath){
					currentPath = [];
					currentPoint = ["M", (data.coords.x-editor.translate.x)/editor.zoom, ((editor.canvas.height-data.coords.y)+editor.translate.y)/editor.zoom];
				}else{
					currentPoint = ["Q", (data.coords.x-editor.translate.x)/editor.zoom, ((editor.canvas.height-data.coords.y)+editor.translate.y)/editor.zoom,
										 (data.coords.x-editor.translate.x)/editor.zoom, ((editor.canvas.height-data.coords.y)+editor.translate.y)/editor.zoom];
				}
			}else if(data.which == 3 && currentPath){
				for(var i = 0; i < currentPath.length; i++){
					editor.pathData.push(currentPath[i]);
				}
				currentPath = null;
				//console.log(editor.pathData);
			}
			console.log(data.which);*/
		},
		mouseup: function(editor, data){
			if(data.which == 1){
				if(currentPath.length == 0){
					currentPath.push(["M", currentPoint.x, currentPoint.y]);
				}else{
					var coords = currentPath[currentPath.length-1].slice(-2);
					var cp0 = {x: cp[0].x + coords[0], y: cp[0].y + coords[1]};
					var cp1 = {x: cp[1].x + currentPoint.x, y: cp[1].y + currentPoint.y};
					currentPath.push(["C", cp0.x, cp0.y, cp1.x, cp1.y, currentPoint.x, currentPoint.y]);
					//currentPath.push(currentPoint.slice());
					//cp = cp.reverse();
				}
					cp[0].x = -cp[1].x;
					cp[0].y = -cp[1].y;
					cp[1].x = 0;
					cp[1].y = 0;
			}else if(data.which == 3){
				editor.pathData = editor.pathData.concat(currentPath);
				currentPath = [];
				currentPoint = {x: 0, y: 0};
				cp = [{x:0, y: 0}, {x: 0, y: 0}];

			}
		},
		mousemove: function(editor, data){
			//console.log(data.modifiers);
			var x = (data.coords.x-editor.translate.x)/editor.zoom,
				y = ((editor.canvas.height-data.coords.y)+editor.translate.y)/editor.zoom;
			var pos = {x: x-currentPoint.x , y: y-currentPoint.y};
			if(data.which == 1){
				//cp[1].x -= data.rel.x / editor.zoom;
				//cp[1].y += data.rel.y / editor.zoom;
				cp[1].x = pos.x;
				cp[1].y = pos.y;
				if(data.modifiers & 1<<0){
					var p = snap(pos, 15*(Math.PI/180));
					cp[1].x = p.x;
					cp[1].y = p.y;

				}
			}else if(data.which == 3){
				//
			}else{
				currentPoint.x = x;
				currentPoint.y = y;
				if(data.modifiers & 1<<0 && currentPath.length > 0){
					var coords = currentPath[currentPath.length-1].slice(-2);
					var p = snap({x: (currentPoint.x - coords[0]), y: (currentPoint.y - coords[1])}, 15*(Math.PI/180));
					currentPoint.x = coords[0] + p.x;
					currentPoint.y = coords[1]+p.y;

				}
			}
			//cp[0].x += data.rel.x;
			//cp[0].y += data.rel.y;
			/*//console.log(currentPoint);
			if(data.which == 1 && currentPoint && currentPoint[0]=="Q"){
				currentPoint[1] -= data.rel.x / editor.zoom;
				currentPoint[2] += data.rel.y / editor.zoom;
			}else 
			if(currentPoint && currentPoint[0]=="Q"){

				currentPoint[3] = (data.coords.x-editor.translate.x)/editor.zoom;
				currentPoint[4] = (editor.canvas.height-data.coords.y-editor.translate.y)/editor.zoom;
			}*/
			return true;
		},
		draw: function(editor, context){
			var matrix = superCanvas.Matrix().translate(0, editor.canvas.height).translate(editor.translate.x, editor.translate.y).scale(1,-1).scale(editor.zoom,editor.zoom);
			
			context.strokeStyle="blue";
			context.beginPath();
			context.drawPath(currentPath, matrix);
			context.stroke();
			context.closePath();
			if(currentPath.length > 0){


				var coords = currentPath[currentPath.length-1].slice(-2);
				var cp0 = {x: cp[0].x + coords[0], y: cp[0].y + coords[1]};
				var cp1 = {x: cp[1].x + currentPoint.x, y: cp[1].y + currentPoint.y};

				context.strokeStyle="red";
				context.beginPath();
				context.drawPath([["M",coords[0],coords[1]], ["C",cp0.x, cp0.y, cp1.x, cp1.y, currentPoint.x, currentPoint.y]], matrix);
				context.stroke();
				context.closePath();


				//cp1 = {x:currentPoint.x - cp[1].x, y: currentPoint.y-cp[1].y};
				context.strokeStyle="green";
				context.beginPath();
				context.drawPath([["M", currentPoint.x+(currentPoint.x - cp1.x), currentPoint.y+(currentPoint.y - cp1.y)], ["L", cp1.x, cp1.y]], matrix);
				context.stroke();
				context.closePath();

				context.strokeStyle="purple";
				context.beginPath();
				context.drawPath([["M", coords[0]+(coords[0]-cp0.x), coords[1]+(coords[1]-cp0.y)], ["L", cp0.x, cp0.y]], matrix);
				context.stroke();
				context.closePath();
				context.fillStyle="white";
				context.strokeStyle="black";
				var coords = currentPath[0].slice(-2);
				context.beginPath();
				context.drawPath("M-0.5,-0.5 0.5,-0.5 0.5,0.5 -0.5,0.5z", superCanvas.Matrix()
					.translate(0, editor.canvas.height)
					.translate(editor.translate.x, editor.translate.y)
					.scale(1,-1)
					.translate(coords[0]*editor.zoom, coords[1]*editor.zoom)
					.scale(7,7)
					);
				context.stroke();
				context.fill();
				context.closePath();

			}else{
				cp1 = {x:currentPoint.x - cp[1].x, y: currentPoint.y-cp[1].y};
				context.strokeStyle="green";
				context.beginPath();
				context.drawPath([["M", currentPoint.x, currentPoint.y], ["L", cp1.x, cp1.y]], matrix);
				context.stroke();
				context.closePath();
			}




			//console.log(currentPath);
			//if(currentPath.length>2){
				/*if(!currentPath)return;
				context.save();
				context.beginPath();
				context.lineJoin = "miter";
				context.miterLimit = 0;
				//context.translate(0, editor.canvas.height);
				//context.scale(1,-1);
				//context.scale(editor.zoom,editor.zoom);
				var matrix = superCanvas.Matrix().translate(0, editor.canvas.height).translate(editor.translate.x, editor.translate.y).scale(1,-1).scale(editor.zoom,editor.zoom);
				//context.drawPath(currentPoint?currentPath.concat([currentPoint]):currentPath, matrix);
				context.strokeStyle="red";
				context.drawPath(currentPath, matrix);
				context.stroke();
				context.beginPath();
				context.strokeStyle="blue";
				if(currentPoint && currentPath.length > 0){
					//console.log("sadf");
					var path = [["M"].concat(currentPath[currentPath.length-1].slice(-2))];
					path.push(currentPoint);
					//console.log("%s", path.join(''));
					//console.log(path);
					context.drawPath(path, matrix);
					context.stroke();
				}
				context.closePath();
				context.beginPath();
				if(context.currentPath.length>1){
					context.fillStyle="white";
					context.strokeStyle="black";
					var coords = currentPath[0].slice(-2);
					context.drawPath("M-0.5,-0.5 0.5,-0.5 0.5,0.5 -0.5,0.5z", superCanvas.Matrix()
						.translate(0, editor.canvas.height)
						.translate(editor.translate.x, editor.translate.y)
						.scale(1,-1)
						.translate(coords[0]*editor.zoom, coords[1]*editor.zoom)
						.scale(7,7)
						);
					context.stroke();
					context.fill();
				}
				context.closePath();
				context.restore();*/
		}
		});
});