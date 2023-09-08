// URL is constant:
const bugs = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the whole JSON data and console log it:
d3.json(bugs).then(function(data) {
  console.log(data);
});
// Set up the dashboard:
function init() {

//  #selDataset from the html file:
let dropdownMenu = d3.select("#selDataset");

// Populate the dropdown & log for each:
d3.json(bugs).then((data) => {
  let names = data.names;
  names.forEach(id => {
    dropdownMenu.append("option").text(id).property("value", id);
  });
  // Initialise the dashboard with first test subject in the array:
  let patientzero = names[0];
  meta(patientzero);
  barchart(patientzero); 
  bubblechart(patientzero); 
});
};

// Set the functions that need to be used: 
// The function to populate metadata into demographic:
function meta(sample) {
  d3.json(bugs).then((data) => {
    let metadata = data.metadata;
    let value = metadata.filter(result => result.id == sample);
    // console log:
    console.log(value)
    let valueData = value[0];
    // clear out the data between choices:
    d3.select("#sample-metadata").html("");
     // Add in the entries for each one in text within the demographics table:
      Object.entries(valueData).forEach(([key,value]) =>
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`)
      )});
      };
    


// data for barchart:

function barchart(sample) {

  d3.json(bugs).then((data) => {
    let samples = data.samples;
    let value = samples.filter(result => result.id == sample);
    console.log(value)

    let valueData = value[0];

    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;
    let sample_values = valueData.sample_values;

    let x_axis = sample_values.slice(0,10).reverse();
    let y_axis = otu_ids.slice(0,10).map((id) =>`OTU ${id}`).reverse();
    let text = otu_labels.slice(0,10).reverse();

// The function  horizontal barchart:
let chart  = {
  type: 'bar',
  x: x_axis,
  y: y_axis,
  text: text,
  orientation: 'h',
};
let layout = {
  title: "Top 10 Bacteria present in sample",
  margin:{
    l:75,
    r:75,
    t:30,
    b:75},
    height: 500,
    width: 800};


Plotly.newPlot('bar', [chart], layout);
});}

  // bubble chart of all the samples collected per test subject: 
function bubblechart(sample) {
    d3.json(bugs).then((data) => {
      let samples = data.samples;
      let value = samples.filter(result => result.id == sample);
      let valueData = value[0];
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
// console log:
      console.log(otu_ids, otu_labels, sample_values)
let trace = {
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode: "markers",
  marker: {
    size: sample_values,
    color: otu_ids,
  }
};
let layout = {
  title: "Bacteria overload: bacteria present in sample",
  hovermode: "closest",
  xaxis: {title: "OTU ID"}}

Plotly.newPlot("bubble", [trace], layout);
})};

// The all-important option changed function to ensure that it changes to the selected ID
function optionChanged(value) {
  meta(value);
  barchart(value); 
  bubblechart(value)}; 

// Final initialisation:
init();