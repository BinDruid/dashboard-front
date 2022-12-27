import { ref } from "vue";
import useBasicChart from "../useBasicChart";
import fa from "apexcharts/dist/locales/fa.json";

const usePieChartConfig = (props) => {
  const { verbosePivot } = useBasicChart(props);

  const series = ref([
    {
      name: props.aggregate,
      data: [],
    },
  ]);

  const chartOptions = ref({
    labels: [],
    series: [],
    chart: {
      id: `pie-chart-${props.pivot}`,
      locales: [fa],
      defaultLocale: "fa",
    },
    noData: {
      text: "داده‌ای برای نمایش وجود ندارد",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Sahel FD",
        color: "#008ffb",
      },
    },
    title: {
      text: `متوسط توقف به تفکیک ${verbosePivot.value}`,
      align: "center",
      margin: 0,
      offsetX: 0,
      offsetY: 5,
      floating: false,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Sahel FD",
        color: "#008ffb",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  return {
    series,
    chartOptions,
  };
};

export default usePieChartConfig;
