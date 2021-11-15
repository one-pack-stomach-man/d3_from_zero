import './style.css';
import * as d3 from 'd3';

console.log(0.4 - 0.3);

const WIDTH = 500;
const HEIGHT = 500;
const INNERHEIGHT = HEIGHT - 60;
interface TweetData {
  user: string;
  content: string;
  timestamp: string;
  retweets: any[];
  favorites: any[];
  impact: number;
  tweetTime: Date;
}
type TweetsList = {
  tweets: TweetData[];
};

d3.csv('src/data/city.csv').then((data) => {
  const [minPopulation, maxPopulation = 0] = d3.extent(
    data,
    (item) => +item.population!
  );
  const yScale = d3
    .scaleLinear()
    .domain([0, maxPopulation])
    .range([0, INNERHEIGHT]);
  d3.select('#container')
    .append('svg')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', 14)
    .attr('height', (d) => yScale(+d.population!))
    .attr('x', (d, i) => i * 40)
    .attr('y', (d) => INNERHEIGHT + 10 - yScale(+d.population!))
    .style('fill', '#FE9922')
    .style('stroke', '#9A8B7A')
    .style('stroke-width', '1px');
});

d3.json('src/data/tweets.json').then((_data) => {
  let res: { [index: string]: TweetData[] } = {};
  let data = _data as TweetsList;
  data.tweets.forEach((element) => {
    element.impact = element.favorites.length + element.retweets.length;
    element.tweetTime = new Date(element.timestamp);
  });

  const [minImpact = 0, maxImpact = 0] = d3.extent(
    data.tweets,
    (d) => d.impact! || 0
  );
  const [startTime = 0, endTime = 0] = d3.extent(
    data.tweets,
    (d) => d.tweetTime
  );

  const yScale = d3
    .scaleLinear()
    .domain([minImpact, maxImpact])
    .range([0, innerHeight]);

  const timeScale = d3
    .scaleLinear()
    .domain([startTime, endTime])
    .range([20, innerHeight]);

  const colorScale = d3
    .scaleLinear()
    .domain([minImpact, maxImpact])
    .range([999999, 757299]);

  const radiusScale = d3
    .scaleLinear()
    .domain([minImpact, maxImpact])
    .range([1, 20]);

  //   d3.select('#container')
  //     .selectAll('circle')
  //     .data(data.tweets)
  //     .enter()
  //     .append('circle')
  //     .attr('r', (d) => radiusScale(d.impact))
  //     .attr('cx', (d) => timeScale(d.tweetTime))
  //     .attr('cy', (d) => innerHeight + 20 - yScale(d.impact))
  //     .style('fill', (d) => colorScale(d.impact))
  //     .style('stroke', 'black')
  //     .style('stroke-width', '1px');

  const tweetG = d3
    .select('#container')
    .selectAll('g')
    .data(data.tweets)
    .enter()
    .append('g')
    .attr(
      'transform',
      (d) =>
        `translate(${timeScale(d.tweetTime)}, ${
          innerHeight + 20 - yScale(d.impact)
        })`
    );

  tweetG
    .append('circle')
    .attr('r', (d) => radiusScale(d.impact))
    .style('fill', '#75739f')
    .style('stroke', 'black')
    .style('stroke-width', '1px');

  tweetG
    .append('text')
    .text((d) => d.user + d.tweetTime.getHours())
    .attr('text-anchor', 'middle');

  data.tweets.map((item: TweetData) => {
    res[item.user] = res[item.user] || [];
    res[item.user].push(item);
  });

  console.log(data);
});

// let yScale = d3.scaleLinear().domain([0, 100, 1000, 24500]).range([0, 50, 75, 100])

// d3.select('svg')
//   .selectAll('rect')
//   .data([14, 68, 24500, 430, 19, 1000, 5555])
//   .enter()
//   .append('rect')
//   .attr('width', 10)
//   .attr('height', (d) => yScale(d))
//   .style('fill', 'orange')
//   .attr('x', (val, i) => i * 10)
//   .attr('y', d => 100 - yScale(d))
