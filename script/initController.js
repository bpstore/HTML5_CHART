function dataEditing(rawDatas){
	function addRatio(data, totalValue){
		data.ratio = (data.v / totalValue).toFixed(5);
		return data;
	}

	function count(data){
		return data.v;
	}

	function double(data){
		data.v = data.v*3;
		return data;
	}

	if(rawDatas.length>0){
		var totalValue = rawDatas.map(count).reduce(function(prev, cur){
			return prev+cur;
		});
		var usingData = rawDatas.map(function(data){
			return addRatio(data, totalValue);
		});
		return usingData;
	} else{
		return [];
	}
}

function initialBackground(setting, callback){
	var template = document.getElementById("svgSet").innerHTML;
	var rendered = Mustache.render(template, setting);
	var contentSection = document.querySelector("article");
	contentSection.innerHTML = rendered;
	callback();
}

function initialDataSet(data){
	var dataSection = document.querySelector("#dataSection");
	var template = document.querySelector("#dataInput").innerHTML;
	data.forEach(function(item){
		var form = Mustache.render(
			template, 
			{"key" : item.k, "value" : item.v, "comment" : item.comment}
		);
		dataSection.insertAdjacentHTML("beforeEnd", form);
	});
}



