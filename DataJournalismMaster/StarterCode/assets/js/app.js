var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXaxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
     
  return circlesGroup;
}

//function used for updating circles with text
function renderTextX(circlestext, newXScale, chosenXAxis) {

  circlestext.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))

  return circlestext;
}
function renderTextY(circlestext, newYScale, chosenYAxis) {

  circlestext.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return circlestext;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // if (chosenXAxis === "poverty") {
  //   var xlabel = "Poverty:";
  // }
  // else if (chosenXAxis === "age"){
  //   var xlabel = "Age:";
  // }
  // else {
  //   var xlabel = "% Low Income:";
  // }

  // if (chosenYAxis === "healthcare") {
  //   var ylabel = "% Lacks Heathcare:";
  // }
  // else if (chosenYAxis === "smokes"){
  //   var ylabel = "% Smokers:";
  // }
  // else {
  //   var ylabel = "Obesity:";
  // }
  var xlabel = capitalize(chosenXAxis);
  var ylabel = capitalize(chosenYAxis);
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
    });


  
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(t) {
    toolTip.show(t);
  })
    // onmouseout event
    .on("mouseout", function(t, index) {
      toolTip.hide(t);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("/assets/data/data.csv", function(err, healthData) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
  });



  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);
  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .classed("x-axis", true)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "grey")
    .attr("opacity", ".5")
    
  // var textGroup = chartGroup.selectAll(null)
    // .data(stateData)
    // .enter()
    // .append("text")
    // .attr("dx", d => xLinearScale(d[chosenXAxis]))
    // .attr("dy", d => yLinearScale(d[chosenYAxis]))
    // .attr("text-anchor", "middle")
    // .attr("alignment-baseline", "central")
    // .text(d => d.abbr)
    // .style("fill", "black")
    // .classed("small",true);
  
    
  

      /*-----------------------------------------------------------------------------*/
  console.log("changing mouseover2")
  
  
    

  // Create group for  2 x- axis labels
  var XlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var YlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-20, ${height/2}) rotate(-90)`);


  var incomeLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("id", "income")
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Median Household income");

  var ageLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("id", "age")
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Age");

  var povertyLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("id", "poverty")
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("% Poverty Level");
  
  var healthLabel = YlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("id", "healthcare")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Healthcare level %");

  var smokesLabel = YlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -40)
    .attr("id", "smokes")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokers %");

  var obesityLabel = YlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -60)
    .attr("id", "obesity")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("% Obesity");

  var circlestext = chartGroup.selectAll(null)
    .data(healthData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .text(d => d.abbr)
    .style("fill", "grey")
    .classed("small",true);
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  XlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log("chosenXAxis");
        console.log(chosenXAxis);
        console.log("before-xlinearScale");       
        console.log(xLinearScale);
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);
        console.log("after-xlinearScale");       
        console.log(xLinearScale);
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlestext = renderTextX(circlestext, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        XlabelsGroup.selectAll("text").attr("class", "inactive");
        d3.select(`#${chosenXAxis}`).attr("class", "active");
        
      }
    });
  // y axis labels event listener
  YlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log("chosenYAxis");       
        console.log(chosenYAxis);
        console.log("before-ylinearScale");       
        console.log(yLinearScale);
        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);
        console.log("after-ylinearScale");       
        console.log(yLinearScale);
        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlestext = renderTextY(circlestext, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        YlabelsGroup.selectAll("text").attr("class", "inactive");
            d3.select(`#${chosenYAxis}`).attr("class", "active");
        
        }
      });
    });

