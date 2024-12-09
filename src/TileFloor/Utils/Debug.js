import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    // this.active = window.location.hash === "#debug";
    this.active = true;

    if (!this.active) return;

    if (window.gui) {
      this.gui = window.gui;
    } else {
      this.gui = new Pane({
        title: "Parameters",
      });

      window.gui = this.gui;

      this.gui.expanded = false;
    }
  }

  destroy() {
    if (!this.gui) return;

    this.gui.dispose();

    this.gui = null;
    window.gui = null;
  }
}
