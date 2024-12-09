import * as THREE from "three";
import gsap from "gsap";
import Experience from "./Experience";
import EventEmitter from "./Utils/EventEmitter";

export default class Mouse extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.time = this.experience.time;

    this.cursor = new THREE.Vector2();
    this.mousePos = new THREE.Vector3(0, 0, 0);
    this.lastMousePos = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();

    this.intersectObjects = [];
    this.needsUpdate = false;

    this.xTo = gsap.quickTo(this.cursor, "x", {
      duration: 0.7,
      ease: "power2.out",
    });
    this.yTo = gsap.quickTo(this.cursor, "y", {
      duration: 0.7,
      ease: "power2.out",
    });

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerEnter = this.handlePointerEnter.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);

    document.addEventListener("pointermove", this.handlePointerMove);
    document.addEventListener("mouseenter", this.handlePointerEnter);
    document.addEventListener("mouseleave", this.handlePointerLeave);
  }

  handlePointerMove(event) {
    this.xTo((event.clientX / window.innerWidth) * 2 - 1);
    this.yTo(-(event.clientY / window.innerHeight) * 2 + 1);
  }

  handlePointerEnter(event) {
    this.trigger("mouseEnter");
  }

  handlePointerLeave(event) {
    this.trigger("mouseLeave");
  }

  update() {
    if (
      !this.raycaster ||
      !this.camera?.instance ||
      !this.time ||
      !this.cursor ||
      !this.scene ||
      !this.intersectObjects
    )
      return;

    this.raycaster.setFromCamera(this.cursor, this.camera.instance);

    const intersect = this.raycaster.intersectObjects(this.intersectObjects);

    this.needsUpdate = false;

    if (intersect.length > 0) {
      this.mousePos.set(
        intersect[0].point.x,
        intersect[0].point.y,
        intersect[0].point.z
      );

      if (this.mousePos.distanceTo(this.lastMousePos) > 0.001) {
        this.needsUpdate = true;
        this.lastMousePos.copy(this.mousePos);
      }
    }
  }
  destroy() {
    document.removeEventListener("pointermove", this.handlePointerMove);
    document.removeEventListener("mouseenter", this.handlePointerEnter);
    document.removeEventListener("mouseleave", this.handlePointerLeave);
  }
}
