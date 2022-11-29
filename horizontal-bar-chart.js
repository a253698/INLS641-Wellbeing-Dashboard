// set the dimensions and margins of the bar chart
const margin = { top: 5, right: 5, bottom: 30, left: 150 },
  width = 350 - margin.left - margin.right,
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
  "https://raw.githubusercontent.com/a253698/INLS641-Wellbeing-Dashboard/main/bar-chart-data.csv"
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
    .attr("fill", "#e29578")
    .on("mouseover", function (event, d) {
      $("#my_dataviz").css("visibility", "visible");
      update(d.WordCloud);
      console.log(d.WordCloud);
    })
    .on("mousemove", function (event, d) {})
    .on("mouseleave", function (event, d) {
      $("#my_dataviz").css("visibility", "hidden");
    });

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
        "translate(" +
          layout.size()[0] / 1.5 +
          "," +
          layout.size()[0] / 1.5 +
          ")"
      )
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .style("font-size", 15)
      .style("fill", "#d5896f")
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

    console.log(update_data);

    var layout = d3.layout
      .cloud()
      .size([width_wordcloud, height_wordcloud])
      .words(update_data)
      .padding(2) //space between words
      .rotate(0) // rotation angle in degrees
      .fontSize(20) // font size of words
      .on("end", draw);

    layout.start();
  }

  var layout = d3.layout.cloud();
});
