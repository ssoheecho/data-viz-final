// adapted from https://multimedia.report/classes/coding/2018/exercises/basicwafflechart/

function drawWaffle(data) {
  const margin = { top: 10, right: 150, bottom: 30, left: 0 },
      width  = 600 - margin.left - margin.right;
      height = 325 - margin.top - margin.bottom;
      boxSize = 15; //size of each box
      boxGap = 4; //space between each box
      howManyAcross = Math.floor(width / (boxSize * 1.25));

  const sorted = data.sort((a, b) => {
    return d3.descending(a.closed, b.closed);
  })

  const colors = d3.scaleSequential(d3.interpolateOrRd);

  const svg = d3.select('#waffle-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  const chart = svg.append('g')
    .attr('class', 'waffle')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const keys = ['solved', 'active'];
  
  function mouseout() {  
    tip.transition().style('opacity', 0);
  }

  var categoryScale = d3.scaleOrdinal(keys.map((d, i) => colors(i)));
  categoryScale.domain(keys);//set the scale domain

  chart.selectAll('.square')
    .data(sorted)
    .enter()
    .append('rect')
    .attr('class', 'square')
    .attr('x', (d ,i) => boxSize * (i % howManyAcross))
    .attr('y', (d, i) => Math.floor(i / howManyAcross) * boxSize)
    .attr('width', boxSize - boxGap)
    .attr('height', boxSize - boxGap)
    .attr('fill', '#222')
    .transition()
    .delay(1000)
    .delay((d, i) => i * 10)
    .attr('fill', d => categoryScale(d.status))
    
  chart.selectAll('.square')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)

  // define tooltip div:
  const tip = d3.select('#waffle-container')
  .append('div')
  .attr('class', 'waffle-tooltip');

  function mouseover(event, data) {
    d3.select(this)
      .style('fill', 'rgb(207, 154, 45)')

    tip.style('left', `${event.clientX + 15}px`)
      .style('top', `${event.clientY}px`)
      .transition()
      .style('opacity', 0.98);

    tip.join('p')
      .html(`<span>CASE #</span>: ${data.case_id}
      <br> <span>INSTITUTION</span>: ${data.college}
      <br><span>OPENED</span>: ${data.opened.split('T')[0]}`)
      .style('font-weight', 200)
    
  }

  function mousemove(event) {
    d3.select(this)
      .style('fill', 'rgb(207, 154, 45)')

    tip.style('left', `${event.clientX + 15}px`)
      .style('top', `${event.clientY}px`)
  }

  function mouseout(event, data) {
    d3.select(this)
      .style('fill', function() {
        if(data.status == 'active') {
          return 'rgb(126, 3, 8)'
        } else {
          return 'rgb(255, 247, 237)'
        }
      })
    
      tip.transition().style('opacity', 0);

  }

  const legend = svg.selectAll('.legend')
    .data(keys)
    .enter();

  legend.append('rect')
    .attr('x', margin.left + width + boxGap )
    .attr('y', function(d,i){ return (i * boxSize) + margin.top; })
    .attr('width', boxSize - 3)
    .attr('height', boxSize - 3)
    .attr('fill', d => categoryScale(d))

  legend.append('text')
    .attr('x', margin.left + width + boxSize + (boxGap*2))
    .attr('y', function(d,i){ return (i * boxSize) + margin.top; })
    .append('tspan')
    .attr('dx', 0)
    .attr('dy', boxSize/2)
    .style('alignment-baseline', 'middle')
    .style('fill', 'white')
    .style('font-size', '0.75em')
    .style('font-weight', 200)
    .text(function(d){ return d;})
}

async function fetchData() {
  const res = await d3.json('/api');
  const casesData = await res.casesData;
  console.log(casesData);
  drawWaffle(casesData)
}

fetchData()