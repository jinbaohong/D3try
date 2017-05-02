var width = 1200;
var height = 1200;
svg1 = d3.select("body")
		.append("svg")
		.attr("width",width)
		.attr("height",height);
var projection = d3.geo.orthographic()
					.rotate([0,0,0])
					.clipAngle(90)
					.center([0,0])
					.scale(500)
					.translate([width/2, height/2]);
var path = d3.geo.path()
			.projection(projection);


var color = d3.scale.category20();
// grid data
var eps = 1e-4;
var graticule = d3.geo.graticule()
					//.extent([[71, 16],[137, 54]])
					.step([10,10]);
var grid = graticule();
console.log(grid);	
// circle data
var angles = d3.range(0, 180, 5);
var geocircle = d3.geo.circle()
				.origin([77,-19]);			
// path data
var rioToCairo = {
	type: "LineString",
	coordinates: [[30,27], [-43.14,-22.54],[-0.23, 15.83]]
};

// marker
var defs = svg1.append("defs");
var arrowMarker = defs.append("marker")
						.attr("id","arrow")
						.attr("markerUnits","strokeWidth")
						.attr("markerWidth","12")
						.attr("markerHeight","12")
						.attr("viewBox","0 0 12 12")
						.attr("refX","6")
						.attr("refY","6")
						.attr("orient","auto");
arrowMarker.append("path")
			.attr("d","M2,2 L10,6 L2,10 L6,6 L2,2")
			.attr("fill","#000");						
var startMarker = defs.append("marker")
						.attr("id","startPoint")
						.attr("markerUnits","strokeWidth")
						.attr("markerWidth","12")
						.attr("markerHeight","12")
						.attr("viewBox","0 0 12 12")
						.attr("refX","6")
						.attr("refY","6")
						.attr("orient","auto");
startMarker.append("circle")
			.attr("cx",6)
			.attr("cy",6)
			.attr("r",2)
			.attr("fill","#000");	

d3.json("./data/world.topojson", function(error, root){
	if(error)
		return console.error(error);
	console.log(root);
	var root = topojson.feature(root, root.objects.output);
	var initRotate = projection.rotate();
	var initScale = projection.scale();
	var zoom = d3.behavior.zoom()
				.scaleExtent([1,10])
				.on("zoom", function(d){
					projection.rotate([
						initRotate[0] + d3.event.translate[0] / (width/100),
						initRotate[1] - d3.event.translate[1] / (height/100),
						initRotate[2]
					]);
					projection.scale( initScale * d3.event.scale );
					countries.attr("d",path);
					gridPath.attr("d",path);
					router.attr("d", path(rioToCairo))
							.attr("class","route")
							.attr("marker-end", "url(#arrow)")
							.attr("marker-start", "url(#startPoint)");
				});
	svg1.append("rect")
		.attr("class","overlay")
		.attr("x",0)
		.attr("y",0)
		.attr("width",width)
		.attr("height",height)
		.call(zoom);
	var gridPath = svg1.append("path")
						.datum(grid)
						.attr("stroke","grey")
						.attr("fill","none")
						.attr("opacity", 0.5)
						.attr("d", function(d){
							return path(d);
						});

	var groups = svg1.append("g");
	var countries = groups.selectAll("path")
						.data(root.features)
						.enter() 
						.append("path")
						.attr("fill", function(d,i){
							return color(i);//"#ccc";
						})
						.attr("d", function(d){
							return path(d);
						})
						.on("click",function(d){
							var area = path.area(d);
							var centroid = path.centroid(d);
							var bounds = path.bounds(d);

			svg1.append("circle")
				.attr("cx", centroid[0])
				.attr("cy", centroid[1])
				.attr("r", 2)
				.attr("fill", "red");
		});

	var router = svg1.append("path");

	/*
	svg1.append("g")
		.selectAll(".geocircle")
		.data(angles)
		.enter()
		.append("path")
		//.attr("stroke","black")
		.attr("opacity", 0.1)
		.attr("d", function(d){
			var circle = geocircle.angle(d);
			return path( circle());
		});
	*/

})

/*
svg1.append("circle")
	.attr("cx", projection([30,27])[0])
	.attr("cy", projection([30,27])[1])
	.attr("fill","red")
	.attr("r",4);
*/