import * as THREE from "three";

export default function TileMaterial({
  mousePosition,
  displacementRadius,
  displacementHeight,
}) {
  const material = new THREE.MeshPhongMaterial({
    color: 0x121013,
    shininess: 20,
    specular: 0x222222,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uMousePosition = new THREE.Uniform(mousePosition);
    shader.uniforms.uDisplacementRadius = new THREE.Uniform(
      displacementRadius.current
    );
    shader.uniforms.uDisplacementHeight = new THREE.Uniform(
      displacementHeight.current
    );
    shader.uniforms.uTime = new THREE.Uniform(0);

    shader.vertexShader = `
      uniform vec3 uMousePosition;
      uniform float uDisplacementRadius;
      uniform float uDisplacementHeight;
      uniform float uTime;

      attribute vec3 aPosition;
      attribute float aRandom;
      attribute float aSpeed;
      
      ${shader.vertexShader}
    `.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      
      // Apply position offset from instancing

      
      // Calculate mouse displacement
      float distanceToMouse = length(aPosition - uMousePosition);
      float falloff = max(0.0, 1.0 - distanceToMouse / uDisplacementRadius);
      float displacement = falloff * uDisplacementHeight;
      
      // Add vertical displacement and subtle animation
      transformed.y += displacement;
      transformed.y += sin(uTime * aSpeed) * 0.05 * aRandom;
      `
    );

    material.userData.shader = shader;
  };

  return material;
}
