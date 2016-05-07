function plotGraph(elapsedTime) {
    $('.graph-container').empty();

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, elapsedTime / 1000]);

    var y = d3.scale.linear()
        .range([5000, 4000]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.money); });

    var svg = d3.select(".graph-container").insert("svg", ".graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(moneyHistory, function(d) { return d.time; }));
    y.domain(d3.extent(moneyHistory, function(d) { return d.money; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append("path")
        .datum(moneyHistory)
        .attr("class", "line")
        .attr("d", line);

    function type(d) {
        d.time = d.time;
        d.money = d.money;
        return d;
    }
}
