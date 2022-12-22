import { createWebHistory, createRouter } from "vue-router";
import DelayCharts from "./pages/DelayCharts.vue";
import TimeLineCharts from "./pages/TimeLineCharts.vue";

const routes = [
  { path: "/", component: DelayCharts, name: "delay_report" },
  { path: "/timeline", component: TimeLineCharts, name: "timeline" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
