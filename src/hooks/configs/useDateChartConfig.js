import { ref, inject } from "vue";
import fa from "apexcharts/dist/locales/fa.json";

const useDateChartConfig = (props) => {
  const xMin = ref(null);
  const xMax = ref(null);
  const days = ref([]);
  const chartOptions = ref({
    chart: {
      id: "area-datetime",
      locales: [fa],
      defaultLocale: "fa",
      zoom: {
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      min: xMin.value,
      max: xMax.value,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 3,
      style: "hollow",
    },
  });

  const series = ref([
    {
      name: props.aggregate,
      data: [],
    },
  ]);

  return {
    series,
    chartOptions,
    days,
    xMin,
    xMax,
  };
};

export default useDateChartConfig;
