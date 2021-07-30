// Plotly Homework - Belly Button Biodiversity
// 
// In git bash type: 
// 1) python -m http.server 8000 --bind 127.0.0.1
//      (after typing in the above - git bash will be idle.) 
// 
// 2) Go to Chrome and use server http://127.0.0.1:8000/ to view the dash board:
// 
// (note: index.html console.log does not load the samples.json properly due to the CORS restriction - file error indicats - 
//      URL scheme "samples.json - file" is not supported and must be an http").
// 
// Demographic Info Chart - MetaData (id, ethnicity, gender, age, location, bbtype, wfreq) is displayed for a selected subject id
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
            margin: {t: 40, l:150}
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
    });

}

function optionChanged(newSample) {
    Charts(newSample);
    metadataSample(newSample);
}

init();