import { ref, inject, computed } from "vue";

const useBasicChart = (props) => {
  const filterReset = inject("filterReset");

  const chartLoaded = ref(false);

  const verbosePivot = computed(() => {
    const pivotMapper = {
      train: "قطار",
      path: "مسیر",
      region: "ناحیه",
      year: "سال",
      month: "ماه",
      reason: "علل توقف",
    };
    return pivotMapper[props.pivot];
  });

  const extraFilters = computed(() => {
    let filters = "";
    for (const filter in props.queryFilters)
      if (filter !== props.pivot) {
        let baseFilter = `&${filter}=`;
        baseFilter += props.queryFilters[filter].join(",");
        filters += baseFilter;
      }
    return filters;
  });

  const selfFilters = computed(() => {
    let filters = "";
    if (props.queryFilters[props.pivot]) {
      const baseFilter = `${verbosePivot.value}=${props.queryFilters[
        props.pivot
      ].join(",")}`;
      filters += baseFilter;
    }
    return filters;
  });

  const resetFilter = () => {
    filterReset(props.pivot);
  };

  return {
    chartLoaded,
    verbosePivot,
    extraFilters,
    selfFilters,
    resetFilter,
  };
};

export default useBasicChart;
