<script lang="js">
import axios from "axios";

export default {
  props: ["pivot", "filtersAsDict", "filtersAsUrl", "aggregate", "maximumRows"],
  inject: ["filterChange", "filterReset", "apiEndPoint", "monthCategory", "yearCategory"],
  data() {
    return {
      baseUrl: "",
      chartLoaded: false,
      chartOptions: {
        chart: {
          id: `chart-${this.pivot}`,
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: this.aggregate,
          data: [],
        },
      ],
    };
  },
  watch: {
    filtersAsUrl() {
      this.fetchChart()
    }
  },
  computed: {
    ignoreSelfUrl() {
      let filters = ""
      for (const filter in this.filtersAsDict)
        if (filter !== this.pivot) {
          let baseFilter = `&${filter}=`
          baseFilter += this.filtersAsDict[filter].join(",")
          filters += baseFilter
        }
      return filters
    },
    selfFilters() {
      let filters = ""
      if (this.filtersAsDict[this.pivot]) {
        let baseFilter = `${this.pivot}=`
        baseFilter += this.filtersAsDict[this.pivot].join(",")
        filters += baseFilter
      }
      return filters
    }
  },
  methods: {
    selectionHandler(e, chartContext, config) {
      const selected = this.chartOptions.xaxis.categories[config.dataPointIndex]
      this.filterChange(selected, this.pivot)
    },
    resetFilter() {
      this.filterReset(this.pivot)
    },
    replaceData(data) {
      this.chartOptions.xaxis.categories.length = 0
      this.series[0].data.length = 0
      data.results.slice(0, this.maximumRows).forEach((dataPoint) => {
        this.chartOptions.xaxis.categories.push(dataPoint[this.pivot]);
        this.series[0].data.push(dataPoint[this.aggregate]);
      });
    },
    verbosePivot() {
      switch (this.pivot) {
        case "train":
          return "قطار"
        case "path":
          return "مسیر"
        case "region":
          return "ناحیه"
        case "year":
          return "سال"
        case "month":
          return "ماه"
      }
    },
    async fetchChart() {
      this.chartLoaded = false
      const { data } = await axios.get(this.baseUrl + this.ignoreSelfUrl);
      this.replaceData(data)
      this.chartLoaded = true
    }
  },
  created() {
    this.fetchChart()
  },
};
</script>
