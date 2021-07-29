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

// // console.log(samples.json)


function buildCharts(sample) {


    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let resultsarray = samples.filter(sampleobject =>
            sampleobject.id == sample);
        let result = resultsarray[0]

        let ids = result.otu_ids;
        let labels = result.otu_labels;
        let values = result.sample_values;

        let layoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            hovermode: "closest"
        };

        let dataBubble = [
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

// }

function init() {

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });

}

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();