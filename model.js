const canvas = document.querySelector("#model-canvas");
const modelStatus = document.querySelector("#model-status");

if (canvas && window.BABYLON) {
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.025, 0.06, 0.11, 1);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.25,
    12,
    new BABYLON.Vector3(0, 0.4, 0),
    scene
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 17;
  camera.lowerBetaLimit = 0.35;
  camera.upperBetaLimit = Math.PI / 2.05;
  camera.wheelPrecision = 35;

  const light = new BABYLON.HemisphericLight("fill", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.75;

  const rimLight = new BABYLON.PointLight("rim", new BABYLON.Vector3(-5, 5, -4), scene);
  rimLight.diffuse = new BABYLON.Color3(0.15, 0.55, 1);
  rimLight.intensity = 55;

  const warmLight = new BABYLON.PointLight("warm", new BABYLON.Vector3(5, 2, 3), scene);
  warmLight.diffuse = new BABYLON.Color3(1, 0.35, 0.12);
  warmLight.intensity = 25;

  const metal = new BABYLON.PBRMaterial("hand metal", scene);
  metal.albedoColor = new BABYLON.Color3(0.12, 0.17, 0.23);
  metal.metallic = 0.92;
  metal.roughness = 0.26;

  const jointMaterial = new BABYLON.PBRMaterial("joints", scene);
  jointMaterial.albedoColor = new BABYLON.Color3(0.04, 0.32, 0.58);
  jointMaterial.metallic = 0.82;
  jointMaterial.roughness = 0.2;
  jointMaterial.emissiveColor = new BABYLON.Color3(0.015, 0.13, 0.3);

  const computerMaterial = new BABYLON.PBRMaterial("computer", scene);
  computerMaterial.albedoColor = new BABYLON.Color3(0.06, 0.075, 0.1);
  computerMaterial.metallic = 0.78;
  computerMaterial.roughness = 0.22;

  const screenMaterial = new BABYLON.StandardMaterial("screen", scene);
  screenMaterial.diffuseColor = new BABYLON.Color3(0.025, 0.12, 0.22);
  screenMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.42, 0.78);

  const model = new BABYLON.TransformNode("hand and computer", scene);
  model.rotation = new BABYLON.Vector3(-0.08, -0.35, 0.02);

  function makeBox(name, width, height, depth, position, material, parent = model) {
    const box = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    box.position = position;
    box.material = material;
    box.parent = parent;
    return box;
  }

  function makeJoint(name, position, diameter = 0.34, parent = model) {
    const joint = BABYLON.MeshBuilder.CreateSphere(name, { diameter, segments: 18 }, scene);
    joint.position = position;
    joint.material = jointMaterial;
    joint.parent = parent;
    return joint;
  }

  function makeFinger(name, x, z, spread, lengths) {
    const finger = new BABYLON.TransformNode(name, scene);
    finger.position = new BABYLON.Vector3(x, 0.34, z);
    finger.rotation.z = spread;
    finger.parent = model;

    let y = 0;
    lengths.forEach((length, index) => {
      const segment = BABYLON.MeshBuilder.CreateCapsule(`${name}-${index}`, {
        height: length,
        radius: 0.17,
        tessellation: 18
      }, scene);
      segment.position = new BABYLON.Vector3(0, y + length / 2, index * -0.08);
      segment.rotation.x = index * 0.16;
      segment.material = metal;
      segment.parent = finger;
      makeJoint(`${name}-joint-${index}`, new BABYLON.Vector3(0, y, index * -0.08), 0.36, finger);
      y += length * 0.78;
    });
  }

  makeBox("palm", 3.8, 0.72, 3.25, new BABYLON.Vector3(0, -0.35, 0.15), metal);
  makeBox("wrist", 2.15, 0.88, 1.7, new BABYLON.Vector3(0, -1.05, 1.9), metal);

  makeFinger("index finger", -1.34, -1.05, -0.05, [1.15, 1.02, 0.78]);
  makeFinger("middle finger", -0.46, -1.32, -0.015, [1.3, 1.1, 0.82]);
  makeFinger("ring finger", 0.46, -1.28, 0.015, [1.22, 1.02, 0.76]);
  makeFinger("little finger", 1.32, -0.94, 0.08, [1.0, 0.88, 0.68]);

  const thumb = new BABYLON.TransformNode("thumb", scene);
  thumb.position = new BABYLON.Vector3(-2.0, -0.15, 0.55);
  thumb.rotation = new BABYLON.Vector3(0.35, 0.1, -0.9);
  thumb.parent = model;
  makeBox("thumb lower", 0.5, 1.55, 0.55, new BABYLON.Vector3(0, 0.6, 0), metal, thumb);
  makeJoint("thumb joint", new BABYLON.Vector3(0, 1.27, 0), 0.5, thumb);
  const thumbTip = makeBox("thumb tip", 0.46, 1.1, 0.5, new BABYLON.Vector3(0.1, 1.72, -0.16), metal, thumb);
  thumbTip.rotation.x = 0.42;

  const laptop = new BABYLON.TransformNode("laptop", scene);
  laptop.position = new BABYLON.Vector3(0, 1.45, -0.1);
  laptop.rotation.x = -0.08;
  laptop.parent = model;

  makeBox("keyboard base", 3.7, 0.18, 2.45, new BABYLON.Vector3(0, 0, 0.15), computerMaterial, laptop);
  makeBox("keyboard inset", 2.75, 0.035, 1.45, new BABYLON.Vector3(0, 0.11, -0.05), jointMaterial, laptop);

  const screenGroup = new BABYLON.TransformNode("screen group", scene);
  screenGroup.position = new BABYLON.Vector3(0, 0.1, -1.0);
  screenGroup.rotation.x = -0.28;
  screenGroup.parent = laptop;
  makeBox("screen case", 3.65, 2.35, 0.16, new BABYLON.Vector3(0, 1.08, 0), computerMaterial, screenGroup);
  makeBox("screen glow", 3.22, 1.88, 0.03, new BABYLON.Vector3(0, 1.08, -0.1), screenMaterial, screenGroup);

  const ground = BABYLON.MeshBuilder.CreateDisc("ground glow", { radius: 4.5, tessellation: 64 }, scene);
  ground.rotation.x = Math.PI / 2;
  ground.position.y = -1.55;
  const groundMaterial = new BABYLON.StandardMaterial("ground material", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.02, 0.08, 0.14);
  groundMaterial.emissiveColor = new BABYLON.Color3(0.01, 0.08, 0.16);
  groundMaterial.alpha = 0.75;
  ground.material = groundMaterial;

  modelStatus.textContent = "DRAG TO ROTATE · SCROLL TO ZOOM";

  let autoRotate = true;
  scene.onPointerObservable.add(() => { autoRotate = false; });

  engine.runRenderLoop(() => {
    if (autoRotate) model.rotation.y += 0.0025;
    scene.render();
  });

  window.addEventListener("resize", () => engine.resize());
} else if (modelStatus) {
  modelStatus.textContent = "3D VIEWER COULD NOT LOAD";
}
