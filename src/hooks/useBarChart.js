import axios from "axios";
import { inject, computed } from "vue";
import useBasicChart from "./useBasicChart";
import useBarChartConfig from "./configs/useBarChartConfig";

const useBarChart = (props) => {
  const api = inject("api");
  const filterChange = inject("filterChange");
  const { chartLoaded, selfFilters, extraFilters, resetFilter } =
    useBasicChart(props);
  const { series, chartOptions } = useBarChartConfig(props);

  const baseUrl = computed(() => {
    return `${api}/${props.endpoint}/?pivot=${props.pivot}`;
  });

  const selectionHandler = (e, chartContext, config) => {
    const selected = chartOptions.value.xaxis.categories[config.dataPointIndex];
    filterChange(selected, props.pivot);
  };

  const replaceData = (data) => {
    chartOptions.value.xaxis.categories.length = 0;
    series.value[0].data.length = 0;
    data.results.slice(0, props.maxCategory).forEach((dataPoint) => {
      chartOptions.value.xaxis.categories.push(dataPoint[props.pivot]);
      series.value[0].data.push(dataPoint[props.aggregate]);
    });
  };

  const fetchChart = async () => {
    chartLoaded.value = false;
    const { data } = await axios.get(baseUrl.value + extraFilters.value);
    replaceData(data);
    chartLoaded.value = true;
  };

  return {
    chartLoaded,
    selfFilters,
    fetchChart,
    selectionHandler,
    resetFilter,
    chartOptions,
    series,
  };
};

export default useBarChart;
