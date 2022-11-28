// set the dimensions and margins of the bar chart
const margin = { top: 5, right: 5, bottom: 30, left: 150 },
  width = 400 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// set the dimensions and margins of the word cloud
var margin_wordcloud = { top: 10, right: 10, bottom: 10, left: 10 },
  width_wordcloud = 350 - margin_wordcloud.left - margin_wordcloud.right,
  height_wordcloud = 350 - margin_wordcloud.top - margin_wordcloud.bottom;

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
    .attr("fill", "#69b3a2")
    .on("mouseover", function (event, d) {
      //  console.log("In" + d.WordCloud);
      update(d.WordCloud);
      $("#my_dataviz").css("visibility", "visible");
    })
    .on("mousemove", function (event, d) {})
    .on("mouseleave", function (event, d) {});

  // append the svg object to the body of the page
  var svg_wordcloud = d3
    .select("#my_dataviz")
    .append("svg")
    .attr(
      "width",
      width_wordcloud + margin_wordcloud.left + margin_wordcloud.right
    )
    .attr(
      "height",
      height_wordcloud + margin_wordcloud.top + margin_wordcloud.bottom
    )
    .append("g")
    .attr(
      "transform",
      "translate(" + margin_wordcloud.left + "," + margin_wordcloud.top + ")"
    );

  function draw(data) {
    svg_wordcloud
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[0] / 2 + ")"
      )
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .style("font-size", 20)
      .style("fill", "#69b3a2")
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }

  function update(data) {
    svg_wordcloud.text("");

    var update_data = data.split(" ").map(function (d) {
      return { text: d };
    });

    var layout = d3.layout
      .cloud()
      .size([width, height])
      .words(update_data)
      .padding(5) //space between words
      .rotate(0) // rotation angle in degrees
      .fontSize(20) // font size of words
      .on("end", draw);

    layout.start();
  }

  var layout = d3.layout.cloud();
});
