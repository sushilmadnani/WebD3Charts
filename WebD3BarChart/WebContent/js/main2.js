/*
*    main2.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = {left:150, right:10, top:10, bottom:150};

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
		.attr("transform", "translate("+ margin.left + "," + margin.top + ")");

//X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

d3.json("./data/revenues.json").then(function(data){
	
/*	data.forEach(function(d){
 		d.height = +d.height;
		console.log("name = "+d.name + " height = "+d.height);
	});*/
	
	var x = d3.scaleBand()
	.domain(data.map(function(d){
		return d.month;
	}))
	.range([0, width])
	.paddingInner(0.3)
	.paddingOuter(0.3);
	
	var y = d3.scaleLinear()
			.domain([0, d3.max(data, function(d){
				return +d.revenue;
			})])
			.range([height, 0]);	
	
	var xAxisCall = d3.axisBottom(x);
	g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, "+ height +")")
		.call(xAxisCall);
	
	var yAxisCall = d3.axisLeft(y)
		.ticks(9)
		.tickFormat((d) => "$" + d);
	
	g.append("g")
		.attr("class", "y axis")
		.call(yAxisCall);
	
	var rects = g.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("x", (d) => x(d.month))
	.attr("y", (d) => y(+d.revenue))
	.attr("height", (d) => height - y(+d.revenue))
	.attr("width", (d) => x.bandwidth())
	.attr("fill", "black");
		
}).catch (function(error) {
	console.log(error);
});
