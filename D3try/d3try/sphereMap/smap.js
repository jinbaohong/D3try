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

var tooltip = d3.select("body").append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);
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

d3.json("worldCountries2.geojson", function(error, root){
	if(error)
		return console.error(error);
	console.log(root);
//	var root = topojson.feature(root, root.objects.output);
	var initRotate = projection.rotate();
	var initScale = projection.scale();
	var zoom = d3.behavior.zoom()
				.scaleExtent([0.5,10])
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
						.style("fill", "#ccc")
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


	d3.csv("data.csv", function(error, valuedata){
		console.log(valuedata);
		//将读取到的数据存到数组values，令其索引号为各省的名称
		var values = [];
		for(var i=0; i<valuedata.length; i++){
			var adm0_a3 = valuedata[i].adm0_a3;
			var value = valuedata[i].value;
			values[adm0_a3] = value;
		}
		console.log(values);
		//求最大值和最小值
		var maxvalue = d3.max(valuedata, function(d){ return d.value; });
		var minvalue = 0;
		console.log([maxvalue,minvalue]);
		//定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
		var linear = d3.scale.linear()
						.domain([minvalue, maxvalue])
						.range([0, 1]);

		//定义最小值和最大值对应的颜色
		var a = "yellow";//d3.rgb(0,255,255);	//浅蓝色
		var b = "red";//d3.rgb(0,0,255);	//蓝色
		 
		//颜色插值函数
		var computeColor = d3.interpolate(a,b);

		//设定各省份的填充色
		countries.style("fill", function(d,i){
			var t = linear( values[d.properties.ADM0_A3] );
			var color = computeColor(t);
			return color.toString();
		})
		.on("mouseover",function(d,i){
				d3.select(this)
					.style("fill","steelblue");
				tooltip.html(d.properties.ADM0_A3 + ":" + 
							values[d.properties.ADM0_A3])
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY + 20) + "px")
						.style("opacity",1.0);
		})
		.on("mousemove",function(d){
			tooltip.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY + 20) + "px")
					.style("opacity",1.0);
		})
		.on("mouseout",function(d,i){
			d3.select(this)
				.transition()
				.duration(500)
				.style("fill",function(d,i){
					var t = linear( values[d.properties.ADM0_A3] );
					var color = computeColor(t);
					if (Number.isNaN(t))
						return "#ccc";
					else
						return color.toString();
				});
			tooltip.style("opacity",0.0);
		});
		var defs = svg1.append("defs");

		var linearGradient = defs.append("linearGradient")
								.attr("id","linearColor")
								.attr("x1","0%")
								.attr("y1","0%")
								.attr("x2","100%")
								.attr("y2","0%");

		var stop1 = linearGradient.append("stop")
						.attr("offset","0%")
						.style("stop-color",a.toString());

		var stop2 = linearGradient.append("stop")
						.attr("offset","100%")
						.style("stop-color",b.toString());

		//添加一个矩形，并应用线性渐变
		var colorRect = svg1.append("rect")
					.attr("x", 20)
					.attr("y", 490)
					.attr("width", 140)
					.attr("height", 30)
					.style("fill","url(#" + linearGradient.attr("id") + ")");

		//添加文字
		var minValueText = svg1.append("text")
					.attr("class","valueText")
					.attr("x", 20)
					.attr("y", 490)
					.attr("dy", "-0.3em")
					.text(function(){
						return minvalue;
					});

		var maxValueText = svg1.append("text")
					.attr("class","valueText")
					.attr("x", 160)
					.attr("y", 490)
					.attr("dy", "-0.3em")
					.text(function(){
						return maxvalue;
					});
	})

});