const data = [
  {
    date: "1972",
    description: "Title IX was passed as part of the Education Amendments of 1972 as a federal civil rights law in the United States of America. This law protects people from discrimination based on sex in education programs or activities that receive Federal financial assistance."
  },
  {
    date: "1980",
    description: "Back in 1972, when Congress passed Title IX, no one expected it to make colleges responsible for adjudicating sexual assault. The gender-equity law was meant to bar discrimination in education. That is now interpreted to mean that colleges must investigate and resolve students’ reports of sexual misconduct of any kind. The evolution happened gradually, in large part through precedents set by court cases starting in the early 1980s. Students sued schools and colleges for mishandling their reports, and rulings established sexual harassment as a form of discrimination, with assault the most severe form. Victims of rape came to be considered subjects of discrimination under Title IX."
  },
  {
    date: "2011",
    description: "Under the Obama administration, the U.S. Department of Education’s Office for Civil Rights issued a “Dear Colleague” letter exhorting colleges to resolve students’ reports of sexual assault — and to protect them throughout the process."
  },
  {
    date: "2014",
    description: "In May 2014, the civil-rights office first publicly named the 55 colleges under investigation."
  },
  {
    date: "2016",
    description: "As of May 2016, there were 235 open investigations at 185 institutions. The Obama administration’s 2016 budget request included $131 million for the civil rights office, so it could hire an additional 200 full-time employees."
  },
  {
    date: "2017",
    description: "In 2017, DeVos announced the launch of a rule-making process on Title IX and rescinded the Obama-era guidance on sexual violence."
  },
  {
    date: "2018",
    description: "Betsy Devos announces new regulations on Title IX, which impose new legal requirements on how schools must conduct their discipline processes for sexual harassment and assault. <br><br>The Office for Civil Rights said it would stop providing details about sexual-violence investigations that had been resolved. This development represented a break from the Obama administration's past practice of disclosing when and how cases had been resolved."
  },
  {
    date: "2020",
    description: "New regulations on campus sexual assault are published in May 2020. <br><br>The new regulation will seek to secure due process rights for students who report sexual misconduct and for those accused of it, by requiring colleges to provide live hearings and allowing students' advisers to cross-examine parties and witnesses involved. Institutions now must presume that those accused of sexual misconduct are innocent prior to the investigative and decision-making process, addressing a repeated criticism of 2011 guidance issued by the Obama administration.",
  },
]

// set layout
const margin = { top: 0, left: 0, right: 0, bottom: 0 };
      height = 200 - margin.top - margin.bottom;
      width = 1000 - margin.left - margin.right;

// draw base
const svg = d3.select('.grid-container-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  
const timeline = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xScale = d3
  .scaleTime()
  .domain([new Date("1971"), new Date("2021")])
  .range([20, width - 30])

const xAxis = d3.axisBottom(xScale)
  .tickSizeOuter(0)
  .ticks(50)

const xAxisDraw = timeline.append("g")
  .attr('class', 'x axis')
  .attr('transform', `translate(0, ${height * 0.4})`)
  .call(xAxis)
  .selectAll('text') 
  .attr('display', (d, i) => {
    if (d.getFullYear() !== 1972 
    && d.getFullYear() !== 1980
    && d.getFullYear() !== 2011
    && d.getFullYear() !== 2014
    && d.getFullYear() !== 2016
    && d.getFullYear() !== 2017
    && d.getFullYear() !== 2018
    && d.getFullYear() !== 2020
    ) {
      return 'none';
    }
  })
  .attr('dx', '-4em')
  .attr('dy', '.3em')
  .attr('transform', 'rotate(-65)')
  .style('text-anchor', 'start')

const ticks = timeline.selectAll('.tick')
  .selectAll('line')
  .style('stroke', '#222')
  .attr('y1', '0px')
  .attr('y2', '0px')

const path = timeline.select('path')
  .style('stroke-width', 0.5)

const text = timeline.selectAll('text')
  .style('font-size', '1.1em')
  .style('font-family', 'Roboto Mono')
  .style('font-weight', 400)

const circles = timeline.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'event')
  .attr('r', 6)
  .attr('cy', `${height * 0.4}`)
  .attr('cx', d => {
    return xScale(new Date(d.date));
  })
  .style('fill', (d, i) => {
    if(d.date == "2011" || d.date == "2017") {
      return 'rgb(252, 184, 16)'
     } else {
      return 'rgb(126, 3, 8)'
     } 
  })
  .style('opacity', 0.8)

d3.selectAll('.event')
  .on('mouseover', timeMouseover)
  .on('mousemove', timeMousemove)
  .on('mouseout', timeMouseout)

// define tooltip div:
const tooltip = d3.select('.grid-container-1')
  .append('div')
  .attr('class', 'time-tooltip');

// tooltip handlers:
function timeMouseover(event, data) { 
  d3.select(this)
    .attr('r', 10)
    .style('fill', 'white')

  tooltip.style('left', `${event.clientX - 130}px`)
    .style('top', `${event.clientY * 1.35}px`)
    .transition()
    .style('opacity', 0.98);

  tooltip.join('p')
    .html(`${data.description}`);
}

function timeMousemove(event) {
  tooltip.style('left', `${event.clientX - 140}px`)
    .style('top', `${event.clientY * 1.35}px`)
}

function timeMouseout(event, data) {  
  tooltip.transition().style('opacity', 0);

  d3.select(this)
    .attr('r', 6)
    .style('fill', (d, i) => {
      if(d.date == "2011" || d.date == "2017") {
        return 'rgb(252, 184, 16)'
       } else {
        return 'rgb(126, 3, 8)'
       } 
    })
}

// LABEL
svg.append('text')
  .attr('x', width/3)
  .attr('y', 10)
  .style('alignment-baseline', 'middle')
  .style('fill', 'white')
  .style('font-size', '1em')
  .style('font-weight', 300)
  .text("TIMELINE OF KEY TITLE IX EVENTS")


  

