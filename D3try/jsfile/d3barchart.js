var dataset = [200, 46, 9, 3, 27, 34, 300, 290, 63, 120, 160, 130, 99, 120];
var width = 1200;
var height = 600;

var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

var padding = { top: 20, right: 20, bottom: 20, left: 20};

var a = svg.append("a");
//var rectStep = 35;
//var rectWidth = 30;
//draw();



//console.log(xScale.rangeBand());
draw(dataset);

function mysort(){
	dataset.sort(d3.ascending);
	draw(dataset);
}

function myadd(){
	dataset.push(Math.floor(Math.random() * 100));
	draw(dataset);
}

function draw(dataset){
	console.log(dataset);
	console.log(dataset.length);
	var xAxisWidth = 1200;
	var yAxisWidth = 500;
	var xScale = d3.scale.ordinal()
				   .domain(d3.range(dataset.length))
				   .rangeRoundBands([0, xAxisWidth], 0.2);
	var yScale = d3.scale.linear()
				   .domain([0,d3.max(dataset)])
				   .range([0,yAxisWidth]);

	var updateRect = svg.selectAll("rect")
						.data(dataset);
	var enterRect = updateRect.enter();
	var exitRect = updateRect.exit();

	updateRect.attr("fill", "steelblue")
			  .attr("x", function(d,i){
			  	return padding.left + xScale(i);
			  })
			  .attr("y", function(d,i){
			  	return height - padding.bottom - yScale(d); 
			  })
			  .attr("width", xScale.rangeBand())
			  .attr("height", function(d,i){
			  	return yScale(d);
			  });
	enterRect.append("rect")
			 .attr("fill", "steelblue")
			  .attr("x", function(d,i){
			  	return padding.left + xScale(i);
			  })
			  .attr("y", function(d,i){
			  	return height - padding.bottom - yScale(d); 
			  })
			  .attr("width", xScale.rangeBand())
			  .attr("height", function(d,i){
			  	return yScale(d);
			  });
	exitRect.remove();

	var updateText = svg.selectAll("text")
					    .data(dataset);
	var enterText = updateText.enter();
	var exitText = updateText.exit();


	updateText.attr("fill", "white")
			  .attr("font-size", "14px")
			  .attr("text-anchor", "middle")
			  .attr("x", function(d,i){
			  	return padding.left + xScale(i);
			  })
			  .attr("y", function(d,i){
			  	return height - padding.bottom - yScale(d); 
			  })
			  .attr("dx", xScale.rangeBand()/2)
			  .attr("dy", "1em")
			  .text(function(d,i){
			  	return d;
			  });
	enterText.append("text")
			 .attr("fill", "white")
			 .attr("font-size", "14px")
			 .attr("text-anchor", "middle")
			 .attr("x", function(d,i){
			 	return padding.left + xScale(i);
			 })
			 .attr("y", function(d,i){
			 	return height - padding.bottom - yScale(d); 
			 })
			 .attr("dx", xScale.rangeBand()/2)
			 .attr("dy", "1em")
			 .text(function(d,i){
			 	return d;
			 });
	exitText.remove();

	var xAxis = d3.svg.axis()
				  .scale(xScale)
				  .orient("bottom");
	yScale.range([yAxisWidth, 0]);
	var yAxis = d3.svg.axis()
				  .scale(yScale)
				  .orient("left");
	svg.append("g")
	   .attr("class","axis")
	   .attr("transform","translate(" + padding.left + "," + 
	   	(height - padding.bottom) + ")")
	   .call(xAxis);
	svg.append("g")
	   .attr("class","axis")
	   .attr("transform","translate(" + padding.left + "," + 
	   	(height - padding.bottom - yAxisWidth) + ")")
	   .call(yAxis);
}
