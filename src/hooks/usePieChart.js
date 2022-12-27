import axios from "axios";
import { inject, computed } from "vue";
import useBasicChart from "./useBasicChart";
import usePieChartConfig from "./configs/usePieChartConfig";

const useLineChart = (props) => {
  const api = inject("api");
  const { chartLoaded, extraFilters } = useBasicChart(props);
  const { series, chartOptions } = usePieChartConfig(props);

  const baseUrl = computed(() => {
    return `${api}/${props.endpoint}/?pivot=${props.pivot}`;
  });

  const replaceData = (data) => {
    chartOptions.value.labels.length = 0;
    series.value.length = 0;
    data.results.slice(0, props.maxCategory).forEach((dataPoint) => {
      chartOptions.value.labels.push(dataPoint[props.pivot]);
      series.value.push(Math.round(dataPoint[props.aggregate]));
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
    fetchChart,
    chartOptions,
    series,
  };
};

export default useLineChart;
