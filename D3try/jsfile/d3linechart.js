var dataset = [
	{
		country: "china",
		gdp: [[2000,11920],[2001,13170],[2002,14550],
			[2003,16500],[2004,19440],[2005,22870],
			[2006,27930],[2007,35040],[2008,45470],
			[2009,51050],[2010,59490],[2011,73140],
			[2012,83860],[2013,103550]]
	},
	{
		country: "japan",
		gdp: [[2000,47310],[2001,41590],[2002,39800],
			[2003,43020],[2004,46550],[2005,45710],
			[2006,43560],[2007,43560],[2008,48490],
			[2009,50350],[2010,54950],[2011,59050],
			[2012,59370],[2013,48980]]
	}
];
var width = 1000;
var height =1000;

var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

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
var colors = d3.scale.category20c();

svg.selectAll("path")
   .data(dataset)
   .enter()
   .append("path")
   .attr("transform","translate(" + padding.left + "," + padding.top + ")")
   .attr("d", function(d){ return linePath(d.gdp); })
   .attr("fill","none")
   .attr("stroke", function(d,i){ return colors(i); })
   .attr("stroke-width",3);

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

