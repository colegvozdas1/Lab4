const data = d3.csv('wealth-health-2014.csv',row=>{
    return{
        Country: row.Country,
        LifeExpectancy: +row.LifeExpectancy,
        Income: +row.Income,
        Population: +row.Population,
        Region: row.Region
    };
}).then(data=>{
    data = data.sort(function(a,b){return b.Population-a.Population});
    let margin = {top:20,bottom: 20, left: 20, right: 20};
    const width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d){
        return d.Income;
    }))
    .range([0,width]);

    let yScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d){
        return d.LifeExpectancy;
    }))
    .range([height, 0]);

    let popScale = d3.scaleSqrt()
    .domain(d3.extent(data,function(d){
        return d.Population;
    }))
    .range([5,30]);

    let circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('g')

    let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    var tooltip = d3.select('.tooltip')
    .style('position','fixed');

    circles.append('circle')
    .attr('cx', d=>xScale(d.Income))
    .attr('cy', d=>yScale(d.LifeExpectancy))
    .attr('r', d=>popScale(d.Population))
    .attr('fill', d=>colorScale(d.Region))
    .attr('stroke', '#757575')
    .attr('fill-opacity',0.8)
    .on('mouseenter',(event,d)=>{
        const pos = d3.pointer(event,window);
        tooltip.style('display','block')
        .style('position','fixed')
        .style('top',pos[1]+'px')
        .style('left',pos[0]+'px')
        .html("Region: "+d.Region +  "<br/>" + "Country: " + d.Country + "<br/>"+ "Population: "+ d3.format(',')(d.Population)+ "<br/>"+ "Income: "+ d3.format(',')(d.Income) + "<br/>"+ "Life Expectancy: " + d3.format('.0d')(d.LifeExpectancy));
        console.log(d.Country);

    })
    .on('mouseleave',(event,d)=>{
        tooltip.style('display','none');
    });

    
    let yAxis = d3.axisLeft()
    .scale(yScale)
    
    let xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5, "s");

    svg.append("g")
	.attr("class", "axis x-axis")
	.call(xAxis)
    .attr("transform", `translate(0, ${height})`);

    svg.append("g")
	.attr("class", "axis y-axis")
	.call(yAxis);

    svg.append("text")
		.attr('x', 600)
		.attr('y', 655)
		.text("Income");

    svg.append("text")
	    .attr('x', 10)
		.attr('y', 10)
		.text("Life Expectancy")
        .style('writing-mode', 'vertical-lr')
    
    var dom= Array.from( new Set(data.map(d=>d.Region)));

    var legend=svg
        .selectAll('rect')
        .data(dom)
        .enter()
        .append('rect')
        .attr('x',width-200)
        .attr('y',(d,i)=>{
            return 450+(23*i)
        })
        .attr('width',20)
        .attr('height',20)
        .attr('fill',d=>colorScale(d))
    
    var texts = svg.append('g')
    .selectAll('text')
    .data(dom)
    .enter()
    .append('text')
    .attr('x',width-175)
    .attr('y',(d,i)=>{
        return 465+(23*i)
    })
    .text(d=>d)

    })