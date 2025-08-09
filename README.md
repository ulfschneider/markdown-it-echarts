# markdown-it-responsive-echarts

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to render [echarts](https://echarts.apache.org/) diagram definitions.

In your Markdown, describe the chart within a fenced codeblock, introduced with the `echarts` keyword.

> [!NOTE]
> It is mandatory to create an object named `config` that holds your chart definition.
> You cannot choose a different name!

~~~markdown
```echarts
const config = {
  renderer: "svg",
  figcaption: 'This is the most simple line chart rendered by echarts',
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
    <!-- the chart will be here -->
  </div>
  <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
  <script type="module">
  //... the plugin will put the chart definition code here
  </script>
  <figcaption>This is the most simple line chart rendered by echarts</figcaption>
</figure>
```

Notice how the `figcaption` is created from the `config.figcaption` property.

It is possible to set the echarts renderer on a per-chart basis with `config.renderer` as well as for all charts in the `defaults.renderer` property. The renderer can be either `"canvas"` (default), or `"svg"`.

The diagram types of all data series in the diagram are added as CSS class names to the echarts container. In the example above you see `echarts-container line`, because we are preparing a line chart. You can use that information for the CSS styling of your diagrams.

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

Your charts will react to light mode and dark mode when you have `defaults.darkMode` settings, which will be applied when automatically when dark mode is detected.

The settings to be applied to all `series` of all charts can be defined in the `defaults.series` settings object.

## Install

`npm install markdown-it-responsive-echarts`

## Use

```js
import markdownItEcharts from 'markdown-it-responsive-echarts'
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
- `defaults` : The default settings to be applied to all echart diagrams prepared by the plugin. Use it exactly how you would set options for an echart. There are some specialities that expand the defaults:
  1. The `series` property, which you can use to make settings that belong to all series used in your chart.
  2. The `darkMode` property, which you can use for dark mode settings. Dark mode is automatically detected during runtime and the settings you define here are applied to the chart. `darkMode` can also contain a `series` property which is used for settings that should be applied to all series of a chart when dark mode is active.
  3. The `renderer` property, wich controls how the charts are rendered. It can be either `"canvas"` or `"svg"`. The default setting is `"canvas"`. You can set the renderer as well on a per-chart basis via the `config` object.

Here is an example for default settings that will be applied to all echart diagrams. These settings ensure the charts respond to changes from light mode to dark mode and the charts are rendered in SVG format:

```js
mdLib.use(markdownItEcharts, {
  verbose: true,
  defaults: {
    renderer: "svg",
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
        color: "#000",
      },
    },
    legend: {
      textStyle: {
        color: "#000",
      },
    },
    textStyle: {
      color: "#000",
    },
    series: {
      label: {
        show: true,
        textStyle: {
          color: "#000",
        },
      },
      markPoint: {
        label: {
          show: true,
          textStyle: {
            color: "#000",
          },
        },
      },
    },
    darkMode: {
      title: {
        textStyle: {
          color: "#fff",
        },
      },
      textStyle: {
        color: "#fff",
      },
      legend: {
        textStyle: {
          color: "#fff",
        },
      },
      series: {
        label: {
          textStyle: {
            color: "#fff",
          },
        },
        markPoint: {
          label: {
            textStyle: {
              color: "#fff",
            },
          },
        },
      },
    },
  },
});
```
