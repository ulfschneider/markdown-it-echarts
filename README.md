# markdown-it-echarts

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to transform render [echarts](https://echarts.apache.org/) diagram definitions.

In your Markdown, describe the echarts chart within a fenced codeblock, introduced with the `echarts` keyword.

> [NOTE!]
> It is mandatory to to create an object named `config` that holds your chart definition.
> You cannot choose a different name!

~~~markdown
```echarts
const config = {
  figcaption = 'This is the most simple line chart rendered by echarts',
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
```
~~~

As a result you get the chart code, wrapped into a `figure` tag:

```html
<figure id="echarts-tifftwsxeckl" class="echarts">
  <div id="echarts-rfisxrzggkaz" class="echarts-container line">
  </div>
  <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
  <script type="module">
  //... the plugin will put the chart definition code here
  </script>
  <figcaption>This is the most simple line chart rendered by echarts</figcaption>
</figure>
```

Notice how the `figcaption` is created from the `config.figcaption` property.

Your charts will react to light mode and dark mode when you define `darkMode` settings within your `defaults` settings property. Please refer to options section further down.

The diagram types of all data series in the diagram are added as CSS class names to the echarts container. In the example above you see `echarts-container line`, because we are rendering a line chart. You can use that information for the CSS styling of your diagrams.

The plugin will make your charts responsive by default, but it is important to start with proper `width` and `height` settings for the echarts container, othwerwise you end up with a container that does have zero width or zero height and you won´t be able to see any diagram. You can for example do something like:

```css
.echarts-container {
    height: 60vh;
    width: 100%;
    &.pie {
        height: unset;
        aspect-ratio: 1 / 1;
        max-width: 65ch;
        max-height: 60vh;
    }
}
```

## Install

`npm install @ulfschneider/markdown-it-echarts`

## Use

```js
import markdownItEcharts from '@ulfschneider/markdown-it-echarts'
import markdownIt from 'markdown-it'

const md = markdownIt()

//default settings
const markdownItEchartsOptions = {
  echarts: "https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js",
  throwOnError: false,
  verbose: false,
  defaults: {},
};

md.use(markdownItEcharts, markdownItEchartsOptions)
```

## Options

- `echarts`: The location of the echarts library code. You might host the code on your own server and would have to adapt this setting in that case to point to that location.
- `throwOnError`: A value of `true` will throw errors that occurred during processing. A value of `false` will only log errors. Default value is `false`.
- `verbose`: A value of `true` will activate detailed logging. Default is `false`.
- `defaults` : The default settings to be applied to all echart diagrams prepared by the plugin. Use the it exactly how you would set options for an echart. There are two specialities that expand the settings:
  1. The `series` property as part of `defaults`, which you can use to make settings that belong to all series used in your chart.
  2. The `darkMode` property as part of `defaults`, which you can use for dark mode settings. Dark mode is automatically detected during runtime and the settings you define here are applied to the chart. `darkMode` can also contain a `series` property which is used for settings that should be applied to all series when dark mode is active.

Here is an example for settings that apply a default styling to the echart diagrams. These settings ensure the charts respond to changes from light mode to dark mode:

```js
mdLib.use(markdownItEcharts, {
  defaults: {
    color: [
      "#007affa0",
      "#ffa500a0",
      "#008000a0",
      "#9370DBa0",
      "#FFD700a0",
      "#ff0000a0",
    ],
    aria: {
      show: true,
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    title: {
      textStyle: {
        color: "#262626",
      },
    },
    legend: {
      textStyle: {
        color: "#262626",
      },
    },
    textStyle: {
      color: "#262626",
    },
    series: {
      label: {
        show: true,
        textStyle: {
          color: "#262626",
        },
      },
      markPoint: {
        label: {
          show: true,
          textStyle: {
            color: "#262626",
          },
        },
      },
    },
    darkMode: {
      title: {
        textStyle: {
          color: "#c3c3c3",
        },
      },
      textStyle: {
        color: "#c3c3c3",
      },
      legend: {
        textStyle: {
          color: "#c3c3c3",
        },
      },
      series: {
        label: {
          textStyle: {
            color: "#c3c3c3",
          },
        },
        markPoint: {
          label: {
            textStyle: {
              color: "#c3c3c3",
            },
          },
        },
      },
    },
  },
});
```
