import axios from "axios";
import { ref, inject, computed } from "vue";
import useCompareChartConfig from "./configs/useCompareChartConfig";

const useCompareChart = (props) => {
  const api = inject("api");
  const chartLoaded = ref(false);
  const yearsSelected = ["1399", "1400"];
  const { series, chartOptions } = useCompareChartConfig(props);

  const baseUrl = computed(() => {
    return `${api}/${props.endpoint}/?pivot=${props.pivot}`;
  });

  const showDifference = (arr1, arr2) => {
    series.value.push({
      name: "تغییرات",
      data: [],
      type: "line",
    });
    const length = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < length; i++)
      series.value[2].data.push(
        Math.abs((arr1[i] || 0) - (arr2[i] || 0)).toFixed(2)
      );
  };

  const replaceData = (chartA, chartB) => {
    series.value[0].data.length = 0;
    series.value[1].data.length = 0;
    chartA.results.slice(0, props.maxCategory).forEach((dataPoint) => {
      series.value[0].data.push(dataPoint[props.aggregate]);
    });
    chartB.results.slice(0, props.maxCategory).forEach((dataPoint) => {
      series.value[1].data.push(dataPoint[props.aggregate]);
    });
    showDifference(series.value[0].data, series.value[1].data);
  };

  const fetchChart = async () => {
    chartLoaded.value = false;
    const { data: chartA } = await axios.get(
      baseUrl.value + `&year=${yearsSelected[0]}`
    );
    const { data: chartB } = await axios.get(
      baseUrl.value + `&year=${yearsSelected[1]}`
    );
    replaceData(chartA, chartB);
    chartLoaded.value = true;
  };

  return {
    chartLoaded,
    fetchChart,
    chartOptions,
    series,
  };
};

export default useCompareChart;
