let ch=20;
let cw=4;
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
            let baseTemp = data.baseTemperature;
            let tooltip = d3.select('#tooltip');
            let colors=["rgb(69, 117, 180)",
                        "rgb(116, 173, 209)",
                        "rgb(171, 217, 233)",
                        "rgb(224, 243, 248)",
                        "rgb(255, 255, 191)",
                        "rgb(254, 224, 144)",
                        "rgb(253, 174, 97)",
                        "rgb(244, 109, 67)",
                        "rgb(215, 48, 39)",];
            let temps = [2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7]            

            const svg = d3.select("#container")
                          .append("svg")
                          .attr("id","heatmap");

            svg.attr("width",width)
               .attr("height",height);

            const xScale = d3.scaleLinear()
                            .domain([d3.min(array,(d) => { return d.year;}),
                                    d3.max(array,(d) => { return d.year;})]) 
                            .range([margin,width-margin]);
                            
            const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

            svg.append("g")
                .attr("transform", "translate(0," + (height - margin) + ")")
                .attr("id","x-axis")
                .call(xAxis);  
                
            const yScale =d3.scaleTime()
                            .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
                            .range([margin,height - margin]);
                       
            const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));
            
            svg.append("g")
                .attr("transform","translate(" + margin + ",0)")                
                .attr("id","y-axis")
                .call(yAxis); 

            svg.selectAll("rect")
               .data(array)
               .enter()
               .append("rect")
               .attr("class","cell")
               .attr("data-month",(d) => { return d.month-1;})
               .attr("data-year",(d) => { return d.year;})
               .attr("data-temp",(d) => { return d.variance + baseTemp;})
               .attr("width",cw)
               .attr("height",ch)
               .attr("x",(d) => { return xScale(d.year)})
               .attr("y",(d) => { return yScale(new Date(0,(d.month) - 1,0,0,0,0,0));})
               .attr("fill",(d) => {

                let t = d.variance + baseTemp ;
                if(t>= 2.8 && t< 3.9){
                        return colors[0];
                }
                else if(t>=3.9 && t<5.0){
                        return colors[1];
                }
                else if(t>=5.0 && t<6.1){
                        return colors[2];
                }
                else if(t>=6.1 && t<7.2){
                        return colors[3];
                }
                else if(t>=7.2 && t<8.3){
                        return colors[4];
                }
                else if(t>=8.3 && t<9.5){
                        return colors[5];
                }
                else if(t>=9.5 && t<10.6){
                        return colors[6];
                }
                else if(t>=10.6 && t<11.7){
                        return colors[7];
                }
                else{
                        return colors[8];
                }
               })
               .on("mouseover",(d) => {
                tooltip.transition().style('visibility','visible');
                tooltip.attr('data-year',d.year);

                document.getElementById('tooltip').innerHTML = "<p>" + (d.year) + "</p><p>" + (d.month) + "</p><p>" + (d.variance) + "</p>" ;
                
               })
               .on("mouseout",() => {
                tooltip.transition().style('visibility','hidden');
               })

               //legend 

               let pad = 20;
               let w = 9*20 + 2*pad ;
               let h = 20 + 2*pad;
               let legend = d3.select("#legend");

               legend.attr("width",w)
                     .attr("height",h) 

               let legendScale = d3.scaleLinear()
                                   .domain(d3.extent(temps))
                                   .range([pad,w-pad]);

               let legendAxis = d3.axisBottom(legendScale);
               
                legend.append('g')
                      .call(legendAxis)
                      .attr("transform","translate(0," + pad + ")")   

                legend.selectAll("rect")
                      .data(colors)
                      .enter()
                      .append("rect")
                      .attr("width",20)
                      .attr("height",20)
                      .attr("x",(d,i) => pad + (20*i))
                      .attr("y",0) 
                      .attr("fill",(d) => d)
        }