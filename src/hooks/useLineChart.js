import axios from "axios";
import { inject, computed } from "vue";
import useBasicChart from "./useBasicChart";
import useLineChartConfig from "./configs/useLineChartConfig";

const useLineChart = (props) => {
  const api = inject("api");
  const filterChange = inject("filterChange");
  const { chartLoaded, selfFilters, extraFilters, resetFilter } =
    useBasicChart(props);
  const { series, chartOptions } = useLineChartConfig(props);

  const baseUrl = computed(() => {
    return `${api}/${props.endpoint}/?pivot=${props.pivot}`;
  });

  const categoryConvertor = (categoryIndex) => {
    return categoryIndex < 9 ? `0${categoryIndex + 1}` : categoryIndex + 1;
  };

  const selectionHandler = (
    event,
    chartContext,
    { seriesIndex, dataPointIndex, config }
  ) => {
    let category = "";
    if (props.category === "month")
      category = categoryConvertor(dataPointIndex);
    if (props.category === "year")
      category = chartOptions.value.xaxis.categories[dataPointIndex];
    filterChange(category, props.pivot);
  };

  const replaceData = (data) => {
    series.value[0].data.length = 0;
    data.results.slice(0, props.maxCategory).forEach((dataPoint) => {
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

export default useLineChart;
