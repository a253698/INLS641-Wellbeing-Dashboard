// set the dimensions and margins of the graph
const margin = { top: 5, right: 5, bottom: 30, left: 150 },
  width = 400 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#feature-selection-horizontal-bar-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/a253698/INLS641-Wellbeing-Dashboard/main/ml.csv"
).then(function (data) {
  //  console.log(data);
  // Add X axis
  const x = d3.scaleLinear().domain([0, 0.1]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("color", "black")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map((d) => d.Feature))
    .padding(0.1);

  svg
    .append("g")
    .call(d3.axisLeft(y))
    //.style("font-size", "20px")
    .style("color", "black")
    .attr("text-anchor", "end")
    .attr("transform", "translate(0," + y + ")");

  //Bars
  svg
    .selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d) => y(d.Feature))
    .attr("width", (d) => x(d.FeatureImportance))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2");
});
