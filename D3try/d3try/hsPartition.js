var width = 800,
	height = 800;
var svg = d3.select("body")
			.append("svg")
			.attr("width",width)
			.attr("height",height);
var radius = 400;
var partition = d3.layout.partition()
					.sort(null)
					.size([2 * Math.PI, radius * radius])
					.value(function(d){ return d.number_2016; });
var arc = d3.svg.arc()
			.startAngle(function(d){ return d.x; })
			.endAngle(function(d){ return d.x + d.dx; })
			.innerRadius(function(d){ return Math.sqrt(d.y); })
			.outerRadius(function(d){ return Math.sqrt(d.y + d.dy); });


var color = d3.scale.category20c();
var tooltip = d3.select("body").append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);



function reSortRoot(root) {
    for (var key in root) {
      if (key == "key") {
        root.name = root.key;
        delete root.key;
      }
      if (key == "HSCODE6") {
        root.name = root[key];
        delete root.key;
      }
      if (key == "values") {
        root.children = [];
        for (item in root.values) {
          root.children.push(reSortRoot(root.values[item]));
        }
        delete root.values;
      }

    }
    return root;
}

function addNumber2016(root) {
	if (root.number_2016 == undefined){
		var array_number_2016 = []; //若沒有number_2016，則先創見一個數組儲存孩子們的number_2016
		for (var i=0; i<root.children.length; i++ ){
			array_number_2016.push( addNumber2016(root.children[i]) );
		}
		root.number_2016 = d3.sum(array_number_2016);
		return root.number_2016;
	}else{
		return root.number_2016;
	}
}

//cityChinaWithSize
d3.csv("./Computex.csv", function(error, root){
	if(error)
		console.error(error);
	console.log(root);

	var nest =d3.nest()
				.key(function(d){ return d.HSCODE2; })
				.key(function(d){ return d.HSCODE4; })
				.entries(root);
	var data = {};
	data.key = "Data";
	data.values = nest;
	data = reSortRoot(data);
//	console.log(data);
	addNumber2016(data);
//	console.log(data);
	var nodes = partition.nodes(data);
	var links = partition.links(nodes);

	console.log(nodes);
/*
	var gRects = svg.selectAll("g")
					.data(nodes)
					.enter()
					.append("g");
*/
	var gArcs = svg.selectAll("g")
					.data(nodes)
					.enter()
					.append("g")
					.attr("transform",
						"translate(" + (width/2) + "," + (height/2) + ")");
	var paths = gArcs.append("path")
					.attr("display", function(d){
						return d.depth ? null : "none";
					})
					.attr("d", function(d){
						return arc(d);
					})
					.style("stroke", "#fff")
					.style("stroke-width", 0)
					.style("fill", function(d){
						return color((d.parent ? (d.parent.depth > 0 ? d.parent : d) : d).name); //有孩子就做自己(不跟父母一樣)
					})
					.each(function(d){
						d.x0 = d.x;
						d.dx0 = d.dx;
					})
					.on("mouseover",function(d,i){
							d3.select(this)
								.style("fill","yellow");
							tooltip.html(d.name + " : " + d.number_2016)
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
								return color((d.parent ? (d.parent.depth ? d.parent : d) : d).name);
							});
						tooltip.style("opacity",0.0);
					});
	/*
	gRects.append("rect")
		.attr("x", function(d){ return d.x; })
		.attr("y", function(d){ return d.y; })
		.attr("width", function(d){ return d.dx; })
		.attr("height", function(d){ return d.dy; })
		.style("stroke", "#fff")
		.style("fill", function(d){
			return color((d.children ? d : d.parent).name);
		});
	
	gRects.append("text")
		.attr("class","nodeText")
		.attr("x",function(d){ return d.x; })
		.attr("y",function(d){ return d.y; })
		.attr("dx", 20)
		.attr("dy", 20)
		.text(function(d,i){ return d.name; });
	*/
	/*
	var texts = gArcs.append("text")
					.attr("class","nodeText")
					.attr("dy",".5em")
					.attr("transform",function(d,i){
						if( i !== 0 ){
							var r = d.x + d.dx/2;

							var angle = Math.PI/2;
							r += r < Math.PI ? (angle * -1) : angle;
							r *= 180 / Math.PI;

							return "translate(" + arc.centroid(d) + ")" +
									"rotate(" + r + ")";
						}
					})
					.text(function(d,i){ return d.name; });
	*/
	d3.selectAll("input")
		.on("change", function() {
			var value = this.value === "count"
				? function() { return 1; }
				: function(d) { return d.number_2016; };

			paths.data(partition.value(value).nodes(data))
				.transition()
				.duration(1500)
				.attrTween("d", function(a){
					var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
					return function(t) {
						var b = i(t);
						a.x0 = b.x;
						a.dx0 = b.dx;
						return arc(b);
					};
				});
    	});
})					