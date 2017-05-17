
var width = 1920,
	height = 1080;
	
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
var tooltip = d3.select("body").append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);

var projection = d3.geo.mercator()
						.center([0, 0])
						.scale(200)
    					.translate([width/2, height/2]);
	
var path = d3.geo.path()
				.projection(projection);	

	
d3.json("worldCountries.geojson", function(error, root) {
	if (error) 
		return console.error(error);
	console.log(root);

	//包含中国各省路径的分组元素
	var world = svg.append("g");
		
	//添加中国各种的路径元素
	var provinces = world.selectAll("path")
			.data( root.features )
			.enter()
			.append("path")
		//	.attr("class","province")
			.style("fill", "grey")
			.attr("d", path );


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
		provinces.style("fill", function(d,i){
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
						return "grey";
					else
						return color.toString();
				});
			tooltip.style("opacity",0.0);
		});
//console.log(Number.isNaN(linear(values["IND"])));
		//定义一个线性渐变
		var defs = svg.append("defs");

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
		var colorRect = svg.append("rect")
					.attr("x", 20)
					.attr("y", 490)
					.attr("width", 140)
					.attr("height", 30)
					.style("fill","url(#" + linearGradient.attr("id") + ")");

		//添加文字
		var minValueText = svg.append("text")
					.attr("class","valueText")
					.attr("x", 20)
					.attr("y", 490)
					.attr("dy", "-0.3em")
					.text(function(){
						return minvalue;
					});

		var maxValueText = svg.append("text")
					.attr("class","valueText")
					.attr("x", 160)
					.attr("y", 490)
					.attr("dy", "-0.3em")
					.text(function(){
						return maxvalue;
					});
	})
});
	
