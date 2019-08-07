/*
*    main.js
*    Mastering Data Visualization with D3.js
*/

	var margin = {left:50, right:20, top:20, bottom:30};

	var width = 500 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;
	
	var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
    		.attr("transform", "translate(" + margin.left + 
    				", " + margin.top + ")");
    
    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var area = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(y(0))
        .y1(function(d) { return y(d.close); });

    d3.tsv("data/area.tsv", function(d) { 
    	d.date = parseTime(d.date);
        d.close = +d.close;
        return d;
    }).then(function(data) {
        
        x.domain(d3.extent(data, (d) => d.date));
        y.domain([0, d3.max(data, (d) => d.close)]);

        g.append("path")
            .attr("fill", "steelblue")
            .attr("d", area(data));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Price ($)");
    }).catch(function(error){
    	console.log(error);
    });