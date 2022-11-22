// set the dimensions and margins of the graph
const margin = { top: 5, right: 5, bottom: 5, left: 5 },
  width = 1000 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#LDA-network-diagram")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

function render() {
  //set the colors of the dots
  var colors = [
    "#A84088",
    "#F24B6A",
    "#1FCECB",
    "#FFDA66",
    "#FF641C",
    "#D94602",
    "#008C7E",
    "#02D9C3",
    "#81BF63",
    "#F2622E",
  ];

  //  var svg = d3.select("#LDA-network-diagram");

  //creating a function for initiating the lines
  var curveLine = d3
    .line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    })
    .curve(d3.curveBasis);

  //create a variable for the dataset
  var chartData;

  //create a function for drawing the lines, s is the starting id, e is the ending id
  function drawPath(s, e) {
    var d = { source: {}, target: {} };
    for (var i = 0; i < chartData.length; i++) {
      if (chartData[i].topic_id == s) {
        d.source.x = chartData[i].x * 15 + 50;
        d.source.y = chartData[i].y * 10 + 50;
      } else if (chartData[i].topic_id == e) {
        d.target.x = chartData[i].x * 15 + 50;
        d.target.y = chartData[i].y * 10 + 50;
      }
    }
    return curveLine([
      { x: d.source.x, y: d.source.y },
      { x: d.target.x, y: d.target.y },
    ]);
  }

  //loading the data from the csv file
  d3.csv("bubble_chart.csv").then(function (data) {
    console.log(data);
    chartData = data;
    var pathArray = [];
    //draw the lines
    for (var i = 0; i < data.length; i++) {
      var pa = [];
      for (var j = 1; j < data[i].connection.length; j++) {
        var size = 3;
        if (
          data[i].thick.indexOf(data[i].connection[0] + data[i].connection[j]) >
          -1
        ) {
          size = 5;
        } else if (
          data[i].thin.indexOf(data[i].connection[0] + data[i].connection[j]) >
          -1
        ) {
          size = 1;
        }
        var path = svg
          .append("path")
          .style("fill", "none")
          .style("stroke", "transparent")
          .style("stroke-width", size)
          .attr("d", drawPath(data[i].connection[0], data[i].connection[j]));
        pa.push(path);
      }
      pathArray.push(pa);
    }

    //draw the nodes
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return d.x * 15 + 50;
      })
      .attr("cy", function (d) {
        return d.y * 10 + 50;
      })
      .attr("r", 50)
      .attr("fill", function (d, i) {
        return colors[i];
      })
      .on("mouseover", function (d, t) {
        var i = Number(t.topic_id) - 1;
        for (var m = 0; m < pathArray.length; m++) {
          for (var n = 0; n < pathArray[m].length; n++) {
            pathArray[m][n].style("stroke", "transparent");
          }
        }
        for (var m = 0; m < pathArray[i].length; m++) {
          pathArray[i][m].style("stroke", "#ff0000");
        }
      })
      .on("mouseout", function (d, t) {
        for (var m = 0; m < pathArray.length; m++) {
          for (var n = 0; n < pathArray[m].length; n++) {
            pathArray[m][n].style("stroke", "transparent");
          }
        }
      });

    //label the text
    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x * 15 + 50;
      })
      .attr("y", function (d) {
        return d.y * 10 + 50;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#000")
      .style("pointer-events", "none")
      .style("font-size", 12)
      .text(function (d) {
        return d.topic;
      });
  });
}

render();
