import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import App from "./App.vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { createWebHistory, createRouter } from "vue-router";
import { fa } from "vuetify/locale";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import DelayCharts from "./pages/DelayCharts.vue";
import TimeLineCharts from "./pages/TimeLineCharts.vue";

import "@mdi/font/css/materialdesignicons.css";
import "./assets/styles/rtl.css";

const routes = [
  { path: "/", component: DelayCharts, name: "delay_report" },
  { path: "/timeline", component: TimeLineCharts, name: "timeline" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: "fa",
  },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(VueApexCharts);
app.mount("#app");
