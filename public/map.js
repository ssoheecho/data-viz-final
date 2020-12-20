/*** MAP HELPER FUNCTIONS ***/
// from https://stackoverflow.com/questions/48802987/is-there-a-map-function-in-vanilla-javascript-like-p5-js
// linearly maps value from the range (a..b) to (c..d)
function mapRange (value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

/*** DRAW MAP ***/
function drawMap(mapData, geoData) {
  // set layout
  const margin = { top: 0, left: 0, right: 0, bottom: 0 };
        height = 800 - margin.top - margin.bottom;
        width = 1200 - margin.left - margin.right;

  // draw base
  const svg = d3.select('.map-container')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    
  const map = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // read in us.json
  const states = topojson.feature(mapData, mapData.objects.states).features;

  const projection = d3.geoAlbersUsa()
    .translate([width/2, height/2]) // center
    .scale(1550) // see all of the map all at once

  const path = d3.geoPath()
    .projection(projection);

  map.selectAll('.state')
    .data(states)
    .join('path')
    .attr('class', 'state')
    .attr('d', path)
    .style('stroke-width', 1.25)
    .style('stroke', '#222')
    .style('fill', '#333');
  
  const radiusMax = d3.max(geoData, d => d.cases.length);

  map.append('g')
    .selectAll('circle')
    .data(geoData)
    .enter()
    .append('circle')
    .attr('class', 'point')
    // .attr('cx', function(d) {
    //   return projection([d.geoLocation.longitude, d.geoLocation.latitude][0])
    // })
    // .attr('cy', function(d) {
    //   return projection([d.geoLocation.longitude, d.geoLocation.latitude][1])
    // })
    .attr('transform', d => `translate(${projection([d.geoLocation.longitude, d.geoLocation.latitude])})`)
    .attr('r', d => {
      return mapRange(d.cases.length, 1, radiusMax, 3, 10);
    })
    .attr('fill', 'white')
    .attr('opacity', 0.5)

  d3.selectAll('.point')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)


  // define tooltip div:
  const tip = d3.select('.map-container')
    .append('div')
    .attr('class', 'map-tooltip');

  // tooltip handlers:
  function mouseover(event, data) { 
    d3.select(this)
      .attr('r', 10)
      .style('fill', 'rgb(126, 3, 8)')

    tip.style('left', `${event.clientX + 15}px`)
      .style('top', `${event.clientY}px`)
      .transition()
      .style('opacity', 0.98);

    tip.join('p')
      .html(d => `<span>INSTITUTION:</span> ${data.college_name}
        <br><span># OF CASES:</span> ${data.case_count}`);
  }

  function mousemove(event) {
    tip.style('left', `${event.clientX + 15}px`)
      .style('top', `${event.clientY}px`)
  }

  function mouseout(event, data) {  
    tip.transition().style('opacity', 0);

    d3.select(this)
      .attr('r', function() {
        return mapRange(data.cases.length, 1, radiusMax, 3, 10);
      })
      .style('fill', 'white')
   }

   // LABEL
  svg.append('text')
    .attr('x', width/3)
    .attr('y', 40)
    .style('alignment-baseline', 'middle')
    .style('fill', 'white')
    .style('font-size', '1em')
    .style('font-weight', 200)
    .style('background-color', 'black')
    .text("DISTRIBUTION OF CASES ACROSS THE NATION")

  svg.append('text')
    .attr('x', width/3 + 90)
    .attr('y', 60)
    .style('alignment-baseline', 'middle')
    .style('fill', 'white')
    .style('font-size', '0.75em')
    .style('font-weight', 200)
    .style('background-color', 'black')
    .text("4/7/11 - 12/14/20")

  //  const zoom = d3.zoom()
  //   .scaleExtent([1, 2])
  //   .on('zoom', function(event) {
  //       map.selectAll('path')
  //         .attr('transform', event.transform);
  //       map.selectAll(".point")
  //         .attr('transform', event.transform);
  //   });

  //   map.call(zoom);
}

/*** FETCH DATA ***/
async function fetchData() {
  const res = await d3.json('/api');
  const mapData = await res.mapData;
  const geoData = await res.geoData;
  drawMap(mapData, geoData)
};

fetchData();