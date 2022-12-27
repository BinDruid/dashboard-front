import axios from "axios";
import moment from "moment-jalaali";
import { ref, inject, computed } from "vue";
import useDateChartConfig from "./configs/useDateChartConfig";

const useDateChart = (props) => {
  const api = inject("api");
  const filterChange = inject("filterChange");
  const chartLoaded = ref(false);
  const { series, chartOptions, days, xMin, xMax } = useDateChartConfig(props);

  const baseUrl = computed(() => {
    return `${api}/${props.endpoint}/?pivot=${props.pivot}`;
  });

  const year = computed(() => {
    return props.queryFilters["year"] ?? "1400";
  });

  const convertDays = (dayMonth) => {
    const dayObject = moment(`${year.value}-${dayMonth}`, "jYYYY-jMM-jDD");
    return dayObject.format("M/D/YYYY");
  };

  const replaceData = (data) => {
    days.value.length = 0;
    series.value[0].data.length = 0;
    data.results.forEach((dataPoint) => {
      days.value.push(dataPoint[props.pivot]);
      const timeStampPoint = {};
      timeStampPoint["x"] = convertDays(dataPoint[props.pivot]);
      timeStampPoint["y"] = dataPoint[props.aggregate];
      series.value[0].data.push(timeStampPoint);
    });
    const length = series.value[0].data.length;
    xMin.value = series.value[0].data[0]["x"];
    xMax.value = series.value[0].data[length - 1]["x"];
  };

  const fetchChart = async () => {
    chartLoaded.value = false;
    const { data } = await axios.get(baseUrl.value + `&year=${year.value}`);
    replaceData(data);
    chartLoaded.value = true;
  };

  const convertXasis = (xaxis) => {
    return moment(xaxis).format("jMM-jDD");
  };

  const validateXaxis = (xaxis) => {
    // First non valid condition: User spans lefside of screen too much so it goes below 01-01 date
    if (xaxis["max"] < xaxis["min"] && xaxis["min"].split("-")[0] === "12")
      xaxis["min"] = convertXasis(xMin.value);

    // Second non valid condition: User spans rightside of screen too much so it goes over 12-29 date
    if (xaxis["max"] < xaxis["min"]) xaxis["max"] = convertXasis(xMax.value);
  };
  const zoomHandler = (chartContext, { xaxis, yaxis }) => {
    const zoomPoints = {
      min: convertXasis(xaxis["min"]),
      max: convertXasis(xaxis["max"]),
    };
    validateXaxis(zoomPoints);
    filterChange({ from: zoomPoints["min"], to: zoomPoints["max"] }, "from-to");
  };
  const resetZoomHandler = (chartContext, opts) => {
    return {
      min: xMin.value,
      max: xMax.value,
    };
  };

  return {
    chartLoaded,
    fetchChart,
    chartOptions,
    series,
    zoomHandler,
    resetZoomHandler,
  };
};

export default useDateChart;
