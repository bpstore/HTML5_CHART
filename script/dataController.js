function dataApply(e){
	var dataSection = e.target.nextElementSibling;
	var dataSet = dataSection.querySelectorAll("form");
	FormData.extract(dataSet);
}

var FormData = {
	extract : function(dataSet){
	}
}

// var toUsingData = dataEditing(testDatas);
// initialBackground(svgSetting, function(){
// 	renderLineGraph(toUsingData, colorSet);
// });
// initialDataSet(toUsingData);

// var dataApplyButton = document.querySelector("#dataApply");
// dataApplyButton.addEventListener("click", dataApply);
