/*
*    main2.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = {left:150, right:10, top:10, bottom:150};

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var t = function(){ return d3.transition().duration(750); }

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
		.attr("transform", "translate("+ margin.left + "," + margin.top + ")");

var xAxisGroup = g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, "+ height +")");
		

var yAxisGroup = g.append("g")
		.attr("class", "y axis");


	// X scale
	var x = d3.scaleBand()
		.range([0, width])
		.paddingInner(0.3)
		.paddingOuter(0.3);

	// Y scale
	var y = d3.scaleLinear()
		.range([height, 0]);	
	
	//X Label
	var xLabel = g.append("text")
		    .attr("class", "x axis-label")
		    .attr("x", width / 2)
		    .attr("y", height + 60)
		    .attr("font-size", "20px")
		    .attr("text-anchor", "middle")
		    .text("Month");
	
	// Y Label
	var yLabel = g.append("text")
		    .attr("class", "y axis-label")
		    .attr("x", - (height / 2))
		    .attr("y", -60)
		    .attr("font-size", "20px")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Revenue");
	
	
	d3.json("./data/revenues.json").then(function(data){
		
/*	data.forEach(function(d){
 		d.revenue = +d.revenue;
	});*/
		
		update(data);
	
		d3.interval(function(){
			var newData = flag ? data : data.slice(1);
			update(newData);
			flag = !flag;
		}, 1000);
	}).catch (function(error) {
		console.log(error);
	});

function update(data) {
	
	var value = flag ? "revenue" : "profit";
	
	x.domain(data.map((d) => d.month));
	y.domain([0, d3.max(data, (d) => +d[value])]);
	
	// X Axis
	var xAxisCall = d3.axisBottom(x);
		xAxisGroup.transition(t).call(xAxisCall);
	
	// Y Axis
	var yAxisCall = d3.axisLeft(y)
		.ticks(9)
		.tickFormat((d) => "$" + d);
		yAxisGroup.transition(t).call(yAxisCall);
	
	// JOIN new data with old elements.	
	var rects = g.selectAll("rect")
		.data(data, (d) => d.month);
	
	// Exit old elements not present in new data.
	rects.exit()
			.attr("fill", "red")
		.transition(t)
			.attr("y", y(0))
			.attr("height", 0)
		.remove();
	
	

	// Enter new elements present in new data.
	rects.enter()
			.append("rect")
			.attr("x", (d) => x(d.month))		
			.attr("width", (d) => x.bandwidth())
			.attr("fill", "black")
			.attr("y", y(0))
			.attr("height", 0)
		// UPDATE old elements present in new data.
		.merge(rects)
		.transition(t)
			.attr("y", (d) => y(+d[value]))
			.attr("height", (d) => height - y(+d[value]))
			.attr("width", (d) => x.bandwidth())
			.attr("x", (d) => x(d.month));		
	
	var label = flag ? "Revenue" : "Profit";
	yLabel.text(label);
}
