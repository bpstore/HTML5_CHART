function renderLineGraph(datas, colorRange){
	var canvas = document.querySelector("#line").querySelector("rect");
	var graph = new LineGraph(canvas, datas, colorRange);
	graph.setBackground();
	graph.render(graph.events.showInfos.bind(graph));
}

function LineGraph(canvas, datas, colorRange){
	this.canvas = canvas;
	this.datas = datas;
	this.draw.colorRange = colorRange;
}

LineGraph.prototype = {
	setBackground : function(){

	},

	render : function(callback){
		var pointInfo = this.getPosition.point.bind(this)();
		var pointDom = this.draw.point.bind(this,pointInfo)();
		var lineDom = this.draw.line.bind(this, pointInfo)();
		this.canvas.insertAdjacentHTML("afterEnd", lineDom+pointDom);
		callback();
	},

	events : {
		showInfos : function(){
			var svg = document.querySelector("#line");
			var pList = svg.querySelectorAll("circle");
			for(var i=0 ; i<pList.length ; i++){
				var item = pList[i];
				item.addEventListener("mouseover", this.events.point.over.bind(this));
				item.addEventListener("mouseleave", this.events.point.leave.bind(this));
			}

			var lList = svg.querySelectorAll("line");
			for(var i=0; i<lList.length ; i++){
				var item = lList[i];
				item.addEventListener("mouseover", this.events.line.over.bind(this));
				item.addEventListener("mouseleave", this.events.line.leave.bind(this));
			}
		},

		line : {
			over : function(e){
				e.target.setAttribute("stroke-width", 5);
			},

			leave : function(e){
				e.target.setAttribute("stroke-width", 1.5);
			},
			infoEle : function(target){

			}

		},

		point : {
			over : function(e){
				e.target.setAttribute("stroke", "RGBA(39, 40, 34, 1)");
				e.target.setAttribute("stroke-width", 5);
				var info = this.events.point.infoEle.bind(this,e.target)();
				e.target.parentNode.insertAdjacentHTML("beforeEnd", info);
			},
			leave : function(e){
				e.target.setAttribute("stroke", "");
				e.target.setAttribute("stroke-width", "");
				var gKey = "g" + e.target.getAttribute("data-key");
				var infoDom = document.querySelector("#" + gKey);
				e.target.parentNode.removeChild(infoDom);
			},

			infoEle : function(target){
				var dataKey = target.getAttribute("data-key");
				var dataValue = target.getAttribute("data-value");
				var cx = target.getAttribute("cx");
				var cy = target.getAttribute("cy");

				var generator = this.events.point.settingGenerator;
				var textSetting = generator.text(dataKey, dataValue);
				var rectSetting = generator.rect();
				
				var textDom = this.util.template("textSet", textSetting);
				var rectDom = this.util.template("rectSet", rectSetting);
	
				var gSetting = generator.g(rectDom, textDom, dataKey, cx, cy);
				var gDom = this.util.grouping(gSetting);
				return gDom;
			},

			settingGenerator : {
				text : function(dataKey, dataValue){
					var textSetting = {
						"x" : -30,
						"y" : -20,
						"fill" : "RGBA(39, 40, 34, 1)",
						"text" : dataKey + " " + dataValue
					}
					return textSetting;
				},

				rect : function(){
					var rectSetting = {
						"x" : -40,
						"y" : -40,
						"rx" : 10,
						"ry" : 10,
						"width" : 80,
						"height" : 30,
						"fill" : "RGBA(255, 255, 255, 1)",
					}
					return rectSetting;
				},

				g : function(rectDom, textDom, dataKey, cx, cy){
					var gSetting = {	
						"contained" : rectDom + textDom,
						"gId" : "g" + dataKey,
						"xPos" : cx,
						"yPos" : cy - 20
					}
					return gSetting;
				}
			}
		}
	},

	draw : {
		point : function(items){
			var dom = "";
			items.map(function(item){
				var setting = {
					"cx" : item.xPos,
					"cy" : item.yPos,
					"r" : 10,
					"fill" : this.draw.getColor(item.v),
					"dataValue" : item.v,
					"dataKey" : item.k
				}
				dom += this.util.template("circleSet", setting);
			}.bind(this));
			return dom;
		},

		getColor : function(value){
			var selected = this.colorRange.filter(function(item){
				return item.max > value;
			});
			return selected[0].color;
		},

		line : function(items){
			var dom = "";
			items.reduce(function(prev, cur){
				var setting = {
					"x1" : prev.xPos,
					"y1" : prev.yPos,
					"x2" : cur.xPos,
					"y2" : cur.yPos,
					"stroke" : "RGBA(39, 40, 34, 1)",
					"strokeWidth" : 1.5,
					"dataKey" : prev.k+"|"+cur.k,
					"dataValue" : (prev.v - cur.v)/100
				}
				dom += this.util.template("lineSet", setting);
				return cur;
			}.bind(this));
			return dom;
		},

	},
	getPosition : {
		point : function(){
			var cWidth = parseInt(this.canvas.getAttribute("width"));
			var cHeight = parseInt(this.canvas.getAttribute("height"));
			var count = 0;
			var maxValue = this.util.sortBy.bind(this,"v", "max")();
			var horSpace = cWidth/(this.datas.length+1);
			var verSpace = (cHeight*0.7)/maxValue;
			var newDatas = this.datas.map(function(item){
				count++;
				item.xPos = horSpace*count;
				item.yPos = cHeight*0.95 - verSpace*item.v;
				return item;
			});
			return newDatas;
		}
	},

	util : {
		sortBy : function(target, option){
			var sortingList = this.datas.map(function(item){
				return item[target];
			});
			function CompareForInteger(first, second){
			    if (first == second)
			        return 0;
			    if (first < second)
			        return -1;
			    else
			        return 1; 
			}
			if (option === "max"){
				return sortingList.sort(CompareForInteger)[sortingList.length-1];
			} else if(option === "min"){
				return sortingList.sort(CompareForInteger)[0];
			} else{
				return sortingList.sort(CompareForInteger);
			}
		},

		template : function(tmplId, setting){
			var tmpl = document.querySelector("#"+tmplId).innerHTML;
			var mRendered = Mustache.render(tmpl, setting);
			return mRendered;
		},
		grouping : function(set){
			var q = "\""
			var g = 
			"<g id=" + q + set.gId + q
			+ "transform=translate(" + set.xPos + "," + set.yPos + ")>"
			+ set.contained
			+ "</g>";
			return g;
		}
	}
}
