import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import App from "./App.vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { fa } from "vuetify/locale";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";
import "./assets/styles/rtl.css";

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: "fa",
  },
});

const app = createApp(App);
app.use(vuetify);
app.use(VueApexCharts);
app.mount("#app");
