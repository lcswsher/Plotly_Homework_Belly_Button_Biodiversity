// Plotly Homework - Belly Button Biodiversity
// 
// In git bash copy/paste the following (in git bash):
// 1) python -m http.server 8000 --bind 127.0.0.1
//      (after typing in the above - git bash will be idle.) 
// 
// 2) Go to Chrome and use server http://127.0.0.1:8000/ to view the dash board:
// 
// (note: index.html console.log does not load the samples.json properly due to the CORS restriction - file error indicats - 
//      URL scheme "samples.json - file" is not supported and must be an http").
// 
// Demographic Info Chart - MetaData (id, ethnicity, gender, age, location, bbtype, wfreq) is displayed for a selected subject id

// Color palette for Gauge Chart
var arrColorsG = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "white"];

function metadataSample(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultsarray = metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0]
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}

function buildGaugeChart(sample) {
    console.log("sample", sample);

    d3.json("samples.json").then(data => {

        var objs = data.metadata;
        //console.log("objs", objs);

        var matchedSampleObj = objs.filter(sampleData =>
            sampleData["id"] === parseInt(sample));
        //console.log("buildGaugeChart matchedSampleObj", matchedSampleObj);

        gaugeChart(matchedSampleObj[0]);
    });
}

function gaugeChart(data) {
    console.log("gaugeChart", data);

    if (data.wfreq === null) {
        data.wfreq = 0;

    }

    let degree = parseInt(data.wfreq) * (180 / 10);

    // Trig to calc meter point
    let degrees = 180 - degree;
    let radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    let path = mainPath.concat(pathX, space, pathY, pathEnd);

    let trace = [{
        type: 'scatter',
        x: [0], y: [0],
        marker: { size: 50, color: '2F6497' },
        showlegend: false,
        name: 'WASH FREQ',
        text: data.wfreq,
        hoverinfo: 'text+name'
    },
    {
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        textfont: {
            size: 16,
        },
        marker: { colors: [...arrColorsG] },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1', ''],
        hoverinfo: 'text',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    let layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '#2F6497',
            line: {
                color: '#2F6497'
            }
        }],

        title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
        height: 550,
        width: 550,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
    };

    Plotly.newPlot('gauge', trace, layout, { responsive: true });

}

// Horizontal Bar and Bubble Charts  
function Charts(sample) {

    // bubble chart
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0]

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var layoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            hovermode: "closest"
        };

        var dataBubble = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];

        Plotly.newPlot("bubble", dataBubble, layoutBubble);

        // bar chart
        var bar_data = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}  `).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures",
            margin: { t: 40, l: 150 }
        };

        Plotly.newPlot("bar", bar_data, barLayout);
    });

}

//to extract the "names": from the samples json file in ID selDataset

function init() {

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sample_data_Names = data.names;
        sample_data_Names.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        const firstSample = sample_data_Names[0];
        Charts(firstSample);
        metadataSample(firstSample);
        buildGaugeChart(firstSample)

    });

}

function optionChanged(newSample) {
    Charts(newSample);
    metadataSample(newSample);
    buildGaugeChart(newSample)
}

init();

