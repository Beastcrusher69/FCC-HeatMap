let ch=10;
let cw=3;
let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const req= new XMLHttpRequest();

        req.open("GET",url,true);
        req.send();

        req.onload = function(){

            const data = JSON.parse(req.responseText);
            const array=data.monthlyVariance;
            let margin = 60;
            let width = ((array.length)/12)*cw+(2*margin);
            let height = 12*ch + 2*margin;

            const svg = d3.select("#container")
                          .append("svg");

            svg.attr("width",width)
               .attr("height",height);

            const xScale = d3.scaleLinear()
                            .domain([d3.min(array,(d) => { return d.year;}),
                                    d3.max(array,(d) => { return d.year;})]) 
                            .range([margin,width-margin]);
                            
            const xAxis = d3.axisBottom(xScale).ticks(20);

            
            svg.append("g")
                .attr("transform", "translate(0," + (height - margin) + ")")
                .attr("id","x-axis")
                .call(xAxis);                 

        }