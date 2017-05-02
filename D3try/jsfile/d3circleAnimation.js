var width = 600;
var height =600;

var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

var center = [[0.5,0.5],[0.7,0.8],[0.4,0.9],
			  [0.11,0.32],[0.88,0.25],[0.75,0.12],
			  [0.5,0.1],[0.2,0.3],[0.4,0.1],[0.6,0.7]];
var padding = { top: 30, right: 30, bottom: 30, left: 30};
var xAxisWidth = 500;
var yAxisWidth = 500;
var xScale = d3.scale.linear()
			   .domain([0, 1.2 * d3.max(center,function(d){
			   	return d[0];
			   })])
			   .range([0, xAxisWidth]);
var yScale = d3.scale.linear()
			   .domain([0, 1.2 * d3.max(center,function(d){
			   	return d[1];
			   })])
			   .range([0, yAxisWidth]);

function drawCircle(){
	var circleUpdate = svg.selectAll("circle")
							.data(center);
	var circleEnter = circleUpdate.enter();
	var circleExit = circleUpdate.exit();

	circleUpdate.transition()
				.duration(500)
				.attr("cx", function(d,i){
					return padding.left + xScale(d[0]);
				})
				.attr("cy", function(d,i){
					return height - padding.bottom - yScale(d[1]);
				});

	circleEnter.append("circle")
				.attr("fill",d3.rgb(Math.random() * 255,Math.random() * 255 ,Math.random() * 255))
				.attr("cx", padding.left)
				.attr("cy", height - padding.bottom)
				.attr("r",7 )
				.transition()
				.duration(500)
				.attr("cx", function(d,i){
					return padding.left + xScale(d[0]);
				})
				.attr("cy", function(d,i){
					console.log(d[1] + " " + yScale(d[1]));
					return height - padding.bottom - yScale(d[1]);
				});

	circleExit.transition()
				.duration(500)
				.attr("fill","white")
				.remove();
}

//function drawAxis(){
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.ticks(5);
	yScale.range([yAxisWidth,0]);
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks(5);
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

	yScale.range([0,yAxisWidth]);
//}

function update(){
	for (var i=0;i<center.length;i++){
		center[i][0] = Math.random();
		center[i][1] = Math.random();
	}
	drawCircle();
	//drawAxis();
}

function add(){
	center.push([Math.random(), Math.random()]);
	drawCircle();
	//drawAxis();
}

function sub(){
	center.pop();
	drawCircle();
	//drawAxis();
}
/*
svg.append("rect")
	.attr("fill", "steelblue")
	.attr("x",10)
	.attr("y",10)
	.attr("width",100)
	.attr("height",30)
	.transition()
	.duration(1000)
	.attr("width",300)
	.transition()
	.attr("height",300)
	.attr("fill","yellow");
*/




