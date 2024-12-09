import Stats from "stats-gl";

import Experience from "../Experience";

export default class StatsMonitor {
  constructor() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    if (!this.renderer?.instance) return;

    this.stats = new Stats();

    document.body.appendChild(this.stats.dom);

    this.stats.init(this.renderer?.instance);
  }

  update() {
    if (!this.stats) return;

    this.stats.update();
  }
}
