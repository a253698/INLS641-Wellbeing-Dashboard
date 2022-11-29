// set the dimensions and margins of the graph
const width = 180,
  height = 225,
  margin = 20;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'burnout-nonburnout-piechart'
const svg = d3
  .select("#burnout-nonburnout-piechart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Create dummy data
const data = { Burnout: 58.13, No_Burnout: 41.86 };

// set the color scale
const color = d3.scaleOrdinal().range(["#ffddd2", "#83c5be"]);

// Compute the position of each group on the pie:
const pie = d3.pie().value(function (d) {
  return d[1];
});
const data_ready = pie(Object.entries(data));
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll("mySlices")
  .data(data_ready)
  .join("path")
  .attr("d", arcGenerator)
  .attr("fill", function (d) {
    return color(d.data[0]);
  })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7);

// Now add the annotation. Use the centroid method to get the best coordinates
svg
  .selectAll("mySlices")
  .data(data_ready)
  .join("text")
  .text(function (d) {
    return d.data[0] + " " + d.data[1] + "%";
  })
  .attr("transform", function (d) {
    return `translate(${arcGenerator.centroid(d)})`;
  })
  .style("text-anchor", "middle")
  .style("font-size", 13);
