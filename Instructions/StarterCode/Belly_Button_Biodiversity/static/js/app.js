function buildMetadata(sample) {
  console.log("Build Metadata Sample: " + sample);
  // @TODO: Complete the following function that builds the metadata panel
  // Use d3 to select the panel with id of `#sample-metadata`
  var md = d3.select("#sample-metadata");

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  d3.json(url).then(function(mdPairs) {
      // Use `.html("") to clear any existing metadata
      md.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.keys(mdPairs).forEach(
        function(key) {
          value = mdPairs[key];
          md.append("p").text(`${key}: ${value}`);
        });
     });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  console.log("Build Chart Sample: " + sample);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;
  d3.json(url).then(function(response) {
    var indexes = Array(response.sample_values.length);
    for (var i = 0; i < response.sample_values.length; i++) {
      indexes[i] = i;
    }
    indexes.sort(function(a,b) { return response.sample_values[b]-response.sample_values[a]; });
    var sampleValues = Array(10);
    var ids = Array(10);
    var labels = Array(10);
    for (var i = 0; i < 10; i++) {
      var rowIndex = indexes[i];
      sampleValues[i] = response.sample_values[rowIndex];
      ids[i] = response.otu_ids[rowIndex];
      labels[i] = response.otu_labels[rowIndex];
    };

    // @TODO: Build a Pie Chart
    var pieChart = [{
      type: "pie",
      values: sampleValues,
      labels: ids.map(String),
      text: labels,
      textinfo: 'percent'
    }];
    var PIE = document.getElementById('pie');
    Plotly.newPlot(PIE, pieChart);

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleChart = [{    
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color:response.otu_ids,
        size: response.sample_values
      }    
    }];
  
    Plotly.newPlot('bubble', bubbleChart);

});
  


    
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
