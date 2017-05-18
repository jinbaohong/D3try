var dataset = [

	{
		country: "japan",
		gdp: [[2000,47310],[2001,41590],[2002,39800],
			[2003,43020],[2004,46550],[2005,45710],
			[2006,43560],[2007,43560],[2008,48490],
			[2009,50350],[2010,54950],[2011,59050],
			[2012,59370],[2013,48980]]
	},
	{
		country: "china",
		gdp: [[2000,11920],[2001,13170],[2002,14550],
			[2003,16500],[2004,19440],[2005,22870],
			[2006,27930],[2007,35040],[2008,45470],
			[2009,51050],[2010,59490],[2011,73140],
			[2012,83860],[2013,103550]]
	}	
];
var width = 1000;
var height =1000;

var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "mysvg");

var padding = { top: 50, right: 50, bottom: 50, left:50};

var gdpmax = 0;
for (var i = 0; i<dataset.length; i++){
	var currGdp = d3.max( dataset[i].gdp , function(d){
		return d[1];
	});
	if( currGdp > gdpmax)
		gdpmax = currGdp;
}
var xScale = d3.scale.linear()
			   .domain([2000,2013])
			   .range([ 0 , width - padding.left - padding.right]);
var yScale = d3.scale.linear()
			   .domain([0,gdpmax * 1.1])
			   .range([ height - padding.bottom - padding.top , 0]);
var linePath = d3.svg.line()
				 .interpolate("basis")
				 .x(function(d){ return xScale(d[0]); })
				 .y(function(d){ return yScale(d[1]); });
var colors = d3.scale.category10();

paths = svg.selectAll("path")
   .data(dataset)
   .enter()
   .append("path")
   .attr("transform","translate(" + padding.left + "," + padding.top + ")")
   .attr("d", function(d){ return linePath(d.gdp); })
   .attr("fill","none")
   .attr("stroke", function(d,i){ return colors(i); })
   .attr("stroke-width",3);
console.log(paths);
console.log(paths[0][0]);
console.log(paths[0][1]);


var xAxis = d3.svg.axis()
			  .scale(xScale)
			  .ticks(5)
			  .tickFormat(d3.format("d"))
			  .orient("bottom");

var yAxis = d3.svg.axis()
			  .scale(yScale)
			  .orient("left");

svg.append("g")
   .attr("class","axis")
   .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
   .call(xAxis);

svg.append("g")
   .attr("class","axis")
   .attr("transform","translate(" + padding.left + "," + padding.top + ")")
   .call(yAxis);



// Interact

// tooltip
var tooltip = d3.select("body")
				.append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);
var title = tooltip.append("div")
					.attr("class","title");
var des = tooltip.selectAll(".des")
				.data(dataset)
				.enter()
				.append("div");
var desColor = des.append("div")
				.attr("class", "desColor");
var desText = des.append("div")
				.attr("class", "desText")
				.attr("id", function(d,i) {
					return "text" + i;
				});								

var focusCircle = svg.append("g")
					.attr("fill", "red")
					.style("display", "none");


// Line and circle 

focusCircle.selectAll("circle")
			.data(paths[0])
			.enter()
			.append("circle")
			.attr("r", 4.5)
			.attr("id", function(d,i) {
				return "d" + i;
			});
focusCircle.append("text")
			.attr("dx", 10)
			.attr("dy", "1em");			
var focusLine = svg.append("g")
					.attr("stroke", "grey")
					.style("display", "none");
var vLine = focusLine.append("line");

// Transparent rectangle
svg.append("rect")
	.attr("class","overlay")
	.attr("x", padding.left)
	.attr("y", padding.top)
	.attr("width", width - padding.left - padding.right)
	.attr("height", height - padding.top - padding.bottom)
	.on("mouseover", function() {
		tooltip.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY + 20) + "px")
				.style("opacity", 1.0);
		focusCircle.style("display", null);
		focusLine.style("display", null);
	})
	.on("mouseout", function() {
		tooltip.style("opacity", 0.0);
		focusCircle.style("display", "none");
		focusLine.style("display", "none");
	})
	.on("mousemove", mousemove3);


function mousemove3() {
  var pathEl0 = paths[0][0];
  var pathEl1 = paths[0][1];
  var pathLength0 = pathEl0.getTotalLength();
  var pathLength1 = pathEl1.getTotalLength();

  var x = d3.mouse(this)[0] - padding.left;
  function getPos(beginning, end, pathEl) {
  	  var target;//  = x,  = pathLength0, 
	  while (true) {
	    target = Math.floor((beginning + end) / 2);
	    var pos = pathEl.getPointAtLength(target);
	    if ((target === end || target === beginning) && pos.x !== x) {
	        break;
	    }
	    if (pos.x > x)      end = target;
	    else if (pos.x < x) beginning = target;
	    else                break; //position found
	  }
	  return pos;
  }

  var pos0 = getPos(x, pathLength0, pathEl0);
  var pos1 = getPos(x, pathLength1, pathEl1);


	focusCircle.select("#d0")
				.attr("transform", "translate(" + (x + padding.left) + "," +
					(pos0.y + padding.top) + ")");
	focusCircle.select("#d1")
				.attr("transform", "translate(" + (x + padding.left) + "," +
					(pos1.y + padding.top) + ")");

	var focusX = xScale.invert( x  );
	var focusY0 = yScale.invert( pos0.y );
	var focusY1 = yScale.invert( pos1.y );	

/*	focusCircle.select("text").text( "X: " + Math.floor(focusX) + " , Y: " + focusY );
*/
	vLine.attr("x1", (x + padding.left))
		.attr("y1", padding.top)
		.attr("x2", (x + padding.left))
		.attr("y2", height - padding.bottom);

	title.html("<strong>" + Math.floor(focusX) + "</strong>");
	desColor.style("background-color",function(d,i) {
		return colors(i);
	});
/*	desText.html( function(d,i) {
		return d.country;
	})*/
	d3.select("#text0")
		.html( function(d,i) {
			return d.country + " : " + Math.round(focusY0) + " dollars";
		});
	d3.select("#text1")
		.html( function(d,i) {
			return d.country + " : " + Math.round(focusY1) + " dollars";
		});
	tooltip.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY + 20) + "px");


}

/*
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("fill", function(d,i){ return colors(i); })
   .attr("width", 25)
   .attr("height", 25)
   .attr("transform",function(d,i){ return "translate(" + (padding.left + i * 100) + 
   	"," + (height - padding.bottom/2) + ")"; } );

svg.append("g")
   .selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .attr("fill", "black")
   .attr("font-size", "14px")
   .attr("text-anchor", "right")
   .attr("transform",function(d,i){ return "translate(" + (padding.left + 25 + i * 100) + 
   	"," + (height - padding.bottom *1/4) + ")"; } )
   .text(function(d,i){return d.country; });
*/
