import { ref, inject } from "vue";
import useBasicChart from "../useBasicChart";
import fa from "apexcharts/dist/locales/fa.json";

const useCompareChartConfig = (props) => {
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

  const chartOptions = ref({
    chart: {
      id: `compare-chart-${props.pivot}`,
      locales: [fa],
      defaultLocale: "fa",
      height: 100,
    },
    title: {
      text: `روند تاخیرات در دو سال متوالی به تفکیک ${verbosePivot.value}`,
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: true,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Sahel FD",
        color: "#263238",
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
    yaxis: {
      tooltip: {
        enabled: true,
        offsetX: 0,
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [2],
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
    },
  });
  const series = ref([
    {
      name: "سال ۱۴۰۰",
      data: [],
      type: "bar",
    },
    {
      name: "سال ۱۳۹۹",
      data: [],
      type: "bar",
    },
  ]);

  return {
    series,
    chartOptions,
  };
};

export default useCompareChartConfig;
