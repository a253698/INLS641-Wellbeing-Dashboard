const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 400 - margin.left - margin.right,
  height = 226 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#clinical-position-barchart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/a253698/INLS641-Wellbeing-Dashboard/main/clinical-position.csv"
).then(function (data) {
  // sort data
  data.sort(function (b, a) {
    return a.Value - b.Value;
  });

  // X axis
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.ClinicalPosition))
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-30)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 120]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.ClinicalPosition))
    .attr("y", (d) => y(d.Value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.Value))
    .attr("fill", "#006d77");
  /*
    .on("mouseover", function (event, d) {
      tooltip.style("opacity", 1);
    })
    .on("mousemove", function (event, d) {
      tooltip.html
        .html(`The number of<br>this cell is:  + ${d.Value} `)
        .style("left", event.x / 2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", event.y / 2 + "px");
    })
    .on("mouseleave", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0);
    })
    */

  // create a tooltip
  var tooltip = d3
    .select("#clinical-position-barchart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Three function that change the tooltip when user hover / move / leave a cell
});
