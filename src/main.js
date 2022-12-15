import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import App from "./App.vue";

import "./assets/bootstrap.rtl.min.css";

const app = createApp(App);
app.use(VueApexCharts);

app.mount("#app");
