import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 12);
import chalk from "chalk";
import pkg from "./package.json" with { type: "json" };

let settings = {
  echarts: "https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js",
  throwOnError: false,
  verbose: false,
  defaults: {},
};

function printSettings() {
  if (settings.verbose) {
    writeLog(JSON.stringify(settings, null, "  "));
  }
}

function writeLog(message) {
  if (settings.verbose) {
    console.log(chalk.white.bold(`[${pkg.name}]`), message);
  }
}

function enforceLog(message) {
  console.log(chalk.white.bold(`[${pkg.name}]`), message);
}

function createId() {
  return "echarts-" + nanoid();
}

/**
 * Initialize the plugin and create non-existing folders
 * @param {Object} options The settings given to the plugin
 */
function initialize(options) {
  settings = Object.assign(settings, options);

  printSettings();
}

function removeEmptyLines(value) {
  return value.replace(/\r/g, "").replace(/\n[\s]*\n/g, "\n");
}

function prepareChart(chartDefinition) {
  const containerId = createId();
  const figureId = createId();

  let chartEmbedCode = `<figure id="${figureId}" class="echarts">
  <div id="${containerId}" class="echarts-container">
  </div>
  <script src="${settings.echarts}"></script>
  <script type="module">
  const ctx = document.querySelector("#${containerId}");
  const chart = echarts.init(ctx);
  function deepMerge(target, ...sources) {
    for (const source of sources) {
      for (const k in source) {
        let vs = source[k], vt = target[k]
        if (Object(vs) == vs && Object(vt) === vt) {
          target[k] = deepMerge(vt, vs)
          continue
        }
        target[k] = source[k]
      }
    }
    return target
  }
  function applyDefaults(config, defaults) {
     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
     if (isDarkMode && defaults.darkMode) {
       defaults = deepMerge({}, defaults, defaults.darkMode);
     } else {
       defaults = deepMerge({}, defaults);
     }
     delete defaults.darkMode;
     let adjustedConfig = deepMerge({}, config);
     if (defaults.series && adjustedConfig.series) {
       for (const def in defaults.series) {
         for (const conf of adjustedConfig.series) {
           conf[def] = deepMerge({}, defaults.series[def], conf[def]);
         }
       }
     }
     delete defaults.series;
     adjustedConfig = deepMerge(defaults, adjustedConfig);
     return adjustedConfig;
  }
  function renderChart() {
    try {
      const width = ctx.clientWidth;
      const height = ctx.clientHeight;
      ${chartDefinition}
      for(const data of config.series) {
        ctx.classList.add(data.type);
      }
      if (config.figcaption) {
        const figure = document.querySelector("#${figureId}");
        let figcaption = figure.querySelector('figcaption');
        if (!figcaption) {
          figcaption = document.createElement('figcaption');
          figcaption.innerHTML = config.figcaption;
          figure.appendChild(figcaption);
        }
      }
      const adjustedConfig = applyDefaults(config, ${JSON.stringify(settings.defaults)});
      chart.setOption(adjustedConfig);
    } catch (err) {
      console.error(err);
    }
  }
  renderChart();
  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      chart.resize();
      renderChart();
    });
  });
  resizeObserver.observe(ctx);
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', renderChart);
  </script>
</figure>`;
  return removeEmptyLines(chartEmbedCode);
}

/**
 * Will take a Chart.js chart definition and transform it
 * into a HTML figure tag
 * @param {String} chartDefinition The Chart.js chart definition
 * @return
 * {String} A HTML figure tag prepared with all data to be rendered
 * on the client by Chart.js,
 * or a HTML pre tag with the chart definition in case of a failure
 */
function renderChart(chartDefinition) {
  try {
    writeLog("Transforming chart");
    return prepareChart(chartDefinition);
  } catch (err) {
    if (settings.throwOnError) {
      enforceLog(chalk.red(`Failure rendering ${chartDefinition}`));
      throw err;
    } else {
      enforceLog(chalk.red(`Failure rendering ${chartDefinition}`), err);
      return removeEmptyLines(`<pre>${chartDefinition}</pre>`);
    }
  }
}

/**
 * A plugin to transform echarts chart definitions with markdown-it
 *
 * @param {Object} md The markdown instance
 * @param {Object} options The settings of the plugin, optional
 * @param {String} options.echarts The location of the echarts library.
 *   Default is https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js
 * @param {Boolean} options.throwOnError A value of true means errors are not catched and instead thrown.
 *   A value of false will catch and log errors. Default value is false.
 * @param {Boolean} options.verbose When true, logging is detailed. Default is false.
 * @param {Object} options.defaults The default settings for echarts
 */
export default function echartsPlugin(md, options) {
  initialize(options);
  const temp = md.renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info.toLowerCase() == "echarts") {
      return renderChart(code);
    }
    return temp(tokens, idx, options, env, slf);
  };
}
