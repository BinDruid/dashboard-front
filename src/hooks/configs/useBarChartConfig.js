import { ref, inject } from "vue";
import useBasicChart from "../useBasicChart";
import fa from "apexcharts/dist/locales/fa.json";

const useLineChartConfig = (props) => {
  const { verbosePivot } = useBasicChart(props);

  const series = ref([
    {
      name: props.aggregate,
      data: [],
    },
  ]);

  const chartOptions = ref({
    chart: {
      id: `bar-chart-${props.pivot}`,
      zoom: {
        enabled: true,
      },
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
      text: `متوسط تاخیر به تفکیک ${verbosePivot.value}`,
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Sahel FD",
        color: "#008ffb",
      },
    },
    xaxis: {
      categories: [],
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        gradientToColors: ["#35D7FC"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 0.9,
        opacityTo: 1,
        stops: [0, 20, 100, 100],
      },
    },
  });

  return {
    series,
    chartOptions,
  };
};

export default useLineChartConfig;
