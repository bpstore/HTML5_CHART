var WIDTH = 800;
var HEIGHT = 300;
var SPACE = WIDTH/13;
var lineGraph = document.querySelector("#line");
var editedLineDatas = [];

document.addEventListener("DOMContentLoaded",function(){
	getDrawLineData();
	for(var i=0; i<editedLineDatas.length-1 ; i++){
		var frontData = editedLineDatas[i];
		var rearData = editedLineDatas[i+1];
		drawLine(frontData, rearData);
	}

	for(var i=0 ; i<editedLineDatas.length ; i++){
		drawPoint(editedLineDatas[i], addDataEvent);
	}
});

function getDrawLineData(){
	var order = 1;
	for(month in rawDatas){
		var drawData = {
			"key" : month,
			"value" : rawDatas[month],
			"xPos" : order*SPACE,
			"yPos" : HEIGHT - rawDatas[month]
		}
		editedLineDatas.push(drawData);
		order++;
	}
}

function drawLine(frontData, rearData){
	var line = "<line "
					+ "x1=\"" + frontData.xPos 
					+ "\" y1=\"" + frontData.yPos 
					+ "\" x2=\"" + rearData.xPos 
					+ "\" y2=\"" + rearData.yPos + "\" style=\"" + "stroke:RGBA(39, 40, 34, 1);stroke-width:2\" />";
	lineGraph.insertAdjacentHTML('beforeend',line);
}

function drawPoint(data, callback){
	var r = 10;
	var fill;
	if(data.value >= 150){
		fill = "blue";
	} else if(150 > data.value && data.value>= 100){
		fill = "green";
	} else {
		fill = "red";
	}
	var point = "<circle "
					+ "cx=\"" + data.xPos
					+ "\" cy=\"" + data.yPos
					+ "\" r=\"" + r
					+ "\" fill=\"" + fill + "\">";
	lineGraph.insertAdjacentHTML('beforeend',point);
	var target = lineGraph.lastChild;
	callback(data, target);
}

function createTextNode(data){
	var textNode = "<text "
					+ " x=\"" + (data.xPos) + "\""
					+ " y=\"" + (data.yPos-30) + "\""
					+ " fill=\"black\">"
					+ data.key + " " + data.value
					+"</text>";
	return textNode;
}

function addDataEvent(data, target){
	var textNode = createTextNode(data);
	target.addEventListener('mouseover', function(){
		lineGraph.insertAdjacentHTML('beforeend',textNode);
	});
	target.addEventListener('mouseout', function(){
		var node = lineGraph.lastChild;
		lineGraph.removeChild(node);
	});
}

