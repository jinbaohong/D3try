var lines = [80,120,130,70,60,90];
var dataset = [{startAngle: 0, endAngle: Math.PI * 0.75},
				{startAngle: Math.PI * 0.75, endAngle: Math.PI},
				{startAngle: Math.PI * 1.5, endAngle: Math.PI * 1.75},
				{startAngle: Math.PI * 1.75, endAngle: Math.PI * 2},
				{startAngle: Math.PI, endAngle: Math.PI * 1.5}];

var width = 800;
var height =800;

var color = d3.scale.category20c();

var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

var arcPath = d3.svg.arc()
				.innerRadius(0)
				.outerRadius(400);

svg.selectAll("path")
   .data(dataset)
   .enter()
   .append("path")
   .attr("d", function(d,i){ return arcPath(d); })
   .attr("transform", "translate(250,250)translate(150,150)translate(0,0)")
   .attr("stroke","none")
   .attr("stroke-width","3px")
   .attr("fill", function(d,i){ return color(i); });

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .attr("transform", function(d,i){
   	return "translate(400,400)" + "translate(" + arcPath.centroid(d) + ")"; 
   })
   .attr("text-anchor", "middle")
   .attr("fill","white")
   .attr("font-size","18px")
   .text(function(d,i){
   	return Math.floor((d.endAngle - d.startAngle)*180/Math.PI);
   });

