import { ref, inject } from "vue";
import useBasicChart from "../useBasicChart";
import fa from "apexcharts/dist/locales/fa.json";

const useLineChartConfig = (props) => {
  const { verbosePivot } = useBasicChart(props);
  const monthCategory = inject("monthCategory");
  const yearCategory = inject("yearCategory");

  const categorySelector = () => {
    switch (props.category) {
      case "year":
        return yearCategory;
      case "month":
        return monthCategory;
    }
  };

  const series = ref([
    {
      name: props.aggregate,
      data: [],
    },
  ]);

  const chartOptions = ref({
    chart: {
      id: `line-chart-${props.pivot}`,
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
      offsetX: -20,
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
      categories: categorySelector(),
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          colors: [],
          fontSize: "12px",
          fontFamily: "Sahel FD",
          fontWeight: 400,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  });

  return {
    series,
    chartOptions,
  };
};

export default useLineChartConfig;
