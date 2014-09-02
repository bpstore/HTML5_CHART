var barGraph = document.querySelector("#bar");
var editedBarData = [];
var BAR_WIDTH = 800/14;

document.addEventListener("DOMContentLoaded",function(){
	getDrawBarData();
	drawBarData(addBarEvent);
});

function getDrawBarData(){
	var i = 1;
	for(data in rawDatas){
		var newData = {
			key : data,
			xPos : i * BAR_WIDTH,
			yPos : HEIGHT - rawDatas[data],
			value : rawDatas[data]
		};
		editedBarData.push(newData);
		i++;
	}
}

function drawBar(data){
	var fill;
	if(data.value >= 150){
		fill = "blue";
	} else if(150 > data.value && data.value>= 100){
		fill = "green";
	} else {
		fill = "red";
	}
	var bar = "<rect "
					+ "x=\"" + data.xPos
					+ "\" y=\"" + data.yPos
					+ "\" width=\"" + BAR_WIDTH
					+ "\" height=\"" + data.value
					+ "\" fill=\"" + fill + "\">";
	barGraph.insertAdjacentHTML('beforeend', bar);

}

function drawBarData(callback){
	for(var i=0; i<editedBarData.length ; i++){
		drawBar(editedBarData[i]);
		var target = barGraph.lastChild;
		callback(editedBarData[i], target)
	}
};

function addBarEvent(data, target){
	var textNode = createTextNode(data);
	target.addEventListener('mouseover', function(){
		barGraph.insertAdjacentHTML('beforeend',textNode);
	});
	target.addEventListener('mouseout', function(){
		var node = barGraph.lastChild;
		barGraph.removeChild(node);
	});
}
