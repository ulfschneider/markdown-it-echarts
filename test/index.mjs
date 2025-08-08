import markdownit from "markdown-it";
import markdownItEcharts from "../index.mjs";
const md = markdownit();

const TEST = `\`\`\`echarts
  const config = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };
\`\`\``;

md.use(markdownItEcharts, {
  defaults: {
    font: {
      fontFamily: "iA Writer Quattro,system-ui,sans-serif",
    },
  },
});

const result = md.render(TEST);
console.log(result);
