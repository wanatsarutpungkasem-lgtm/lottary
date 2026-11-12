import * as T from 'three';

/** Small, original ritual objects. No networking, sensor work or probability state. */
export function createRitualProps(scene) {
  const root = new T.Group();
  root.name = 'sanctuary-ritual-objects';
  scene.add(root);
  const mat = (color, metalness = 0, roughness = .7) =>
    new T.MeshStandardMaterial({ color, metalness, roughness });
  const bronze = mat('#977545', .48, .52);
  const bronzeEdge = mat('#c4a578', .5, .45);
  const stone = mat('#39383d', .05, .85);
  const earth = mat('#554633', 0, 1);
  const pink = mat('#b46c7a', .03, .68);
  const innerPink = mat('#d2a4aa', .02, .72);
  const saffron = mat('#bc7c32', .02, .82);
  const leaf = mat('#465d49', .02, .8);
  const wax = mat('#d6cbb2', .01, .78);
  const wood = mat('#665243', .03, .8);
  const black = mat('#27282c', .2, .72);
  const fire = new T.MeshStandardMaterial({ color: '#f3ca89', emissive: '#e5a44b', emissiveIntensity: 1.2, roughness: .8 });
  const water = mat('#334e51', .23, .36);
  const smokeMaterial = new T.MeshBasicMaterial({ color: '#c3b9ae', transparent: true, opacity: .09, depthWrite: false });
  const rippleMaterial = new T.MeshBasicMaterial({ color: '#acb7a6', transparent: true, opacity: .11, depthWrite: false });

  const geo = {
    sphere: new T.SphereGeometry(1, 12, 8),
    petal: new T.SphereGeometry(1, 12, 8),
    cylinder: new T.CylinderGeometry(1, 1, 1, 28),
    box: new T.BoxGeometry(1, 1, 1),
    rim: new T.TorusGeometry(1, .025, 6, 48),
  };
  function mesh(geometry, material, parent, position = [0, 0, 0], scale = [1, 1, 1]) {
    const m = new T.Mesh(geometry, material);
    m.position.set(...position);
    m.scale.set(...scale);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function group(name, position) {
    const g = new T.Group();
    g.name = name;
    g.position.set(...position);
    root.add(g);
    return g;
  }
  function rim(parent, r, y, sx = 1, sz = 1) {
    const m = mesh(geo.rim, bronzeEdge, parent, [0, y, 0], [r * sx, r * sz, r]);
    m.rotation.x = Math.PI / 2;
    return m;
  }
  function instanced(geometry, material, transforms, parent) {
    const m = new T.InstancedMesh(geometry, material, transforms.length);
    const dummy = new T.Object3D();
    transforms.forEach(({ p, s, r = [0, 0, 0] }, i) => {
      dummy.position.set(...p); dummy.scale.set(...s); dummy.rotation.set(...r);
      dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    });
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function lotus(parent, position, size = 1) {
    const g = new T.Group(); g.position.set(...position); g.scale.setScalar(size); parent.add(g);
    const outer = [], inner = [];
    for (let layer = 0; layer < 2; layer++) {
      const count = layer ? 7 : 9;
      for (let i = 0; i < count; i++) {
        const a = i / count * Math.PI * 2 + layer * .23;
        const radius = layer ? .1 : .17;
        (layer ? inner : outer).push({
          p: [Math.cos(a) * radius, .1 + layer * .07, Math.sin(a) * radius],
          s: [.075, .16 - layer * .02, .045],
          r: [Math.sin(a) * .57, 0, -Math.cos(a) * .57],
        });
      }
    }
    instanced(geo.petal, pink, outer, g);
    instanced(geo.petal, innerPink, inner, g);
    mesh(geo.sphere, bronzeEdge, g, [0, .14, 0], [.07, .045, .07]);
    return g;
  }

  // Offering tray: approximately 1.5m wide at the foot of the pavilion.
  const flowerTray = group('flower-offering-tray', [0, 0, -1.5]);
  mesh(geo.cylinder, bronze, flowerTray, [0, .075, 0], [.75, .11, .43]);
  mesh(geo.cylinder, earth, flowerTray, [0, .135, 0], [.7, .015, .38]);
  rim(flowerTray, .7, .14, 1, .56);
  const lotusOffering = new T.Group(); lotusOffering.name = 'lotus-offering'; flowerTray.add(lotusOffering);
  lotus(lotusOffering, [-.32, .13, -.02], .82);
  lotus(lotusOffering, [.28, .13, .02], .9);
  // An oval marigold garland uses one instanced draw rather than many objects.
  const marigold = new T.Group(); marigold.name = 'marigold-offering'; flowerTray.add(marigold);
  const buds = [];
  for (let i = 0; i < 22; i++) {
    const a = i / 22 * Math.PI * 2;
    for (let j = 0; j < 6; j++) {
      const b = j / 6 * Math.PI * 2;
      buds.push({ p: [Math.cos(a) * .48 + Math.cos(b) * .04, .19 + Math.sin(b) * .025, Math.sin(a) * .22 + Math.sin(b) * .04], s: [.05, .045, .05] });
    }
  }
  instanced(geo.sphere, saffron, buds, marigold);

  const incenseGroup = group('incense-offering', [-1.2, 0, -1.5]);
  mesh(geo.cylinder, bronze, incenseGroup, [0, .15, 0], [.24, .26, .24]);
  mesh(geo.cylinder, earth, incenseGroup, [0, .285, 0], [.215, .012, .215]);
  rim(incenseGroup, .23, .28);
  const smoke = [];
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * .075;
    mesh(geo.cylinder, wood, incenseGroup, [x, .73, 0], [.013, .89, .013]);
    const ember = mesh(geo.sphere, fire, incenseGroup, [x, 1.178, 0], [.016, .024, .016]);
    ember.castShadow = false;
    const points = [[x, 1.2, 0], [x + .025, 1.4, -.01], [x - .04, 1.61, .025], [x + .04, 1.86, .02]];
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
    const wisp = mesh(new T.TubeGeometry(curve, 20, .013, 5, false), smokeMaterial, incenseGroup);
    wisp.castShadow = false; wisp.receiveShadow = false;
    smoke.push(wisp);
  }

  const candles = group('candle-offering', [1.2, 0, -1.5]);
  mesh(geo.cylinder, bronze, candles, [0, .05, 0], [.37, .08, .28]);
  const flames = [];
  for (const [x, z, height] of [[-.16, -.06, .52], [.13, .06, .36]]) {
    mesh(geo.cylinder, wax, candles, [x, .1 + height / 2, z], [.065, height, .065]);
    mesh(geo.cylinder, black, candles, [x, .13 + height, z], [.009, .045, .009]);
    const flame = mesh(geo.sphere, fire, candles, [x, .2 + height, z], [.04, .09, .032]);
    flame.castShadow = false; flames.push(flame);
  }

  // Discreet side places to pause; no extra shadow-casting lights or effects.
  const ambient = group('quiet-courtyard-corners', [0, 0, 0]);
  const pond = new T.Group(); pond.position.set(-5, 0, 3.8); ambient.add(pond);
  mesh(geo.cylinder, stone, pond, [0, .15, 0], [1.25, .25, .88]);
  const waterSurface = mesh(geo.cylinder, water, pond, [0, .282, 0], [1.14, .018, .77]);
  waterSurface.castShadow = false;
  const pondRim = mesh(geo.rim, bronze, pond, [0, .29, 0], [1.19, .81, 1]); pondRim.rotation.x = Math.PI / 2;
  const pads = [];
  for (const [x, z, scale] of [[-.56, .16, .18], [.46, -.2, .2], [.29, .26, .13], [-.25, -.27, .14]])
    pads.push({ p: [x, .303, z], s: [scale, .012, scale * .78] });
  instanced(geo.sphere, leaf, pads, pond);
  lotus(pond, [-.38, .3, -.05], .55);
  for (const radius of [.36, .57]) {
    const wave = mesh(new T.TorusGeometry(radius, .005, 3, 48), rippleMaterial, pond, [.15, .31, 0]);
    wave.rotation.x = -Math.PI / 2; wave.scale.y = .75; wave.castShadow = false;
  }
  const bench = new T.Group(); bench.position.set(5, 0, 3.8); bench.rotation.y = -.12; ambient.add(bench);
  for (const x of [-.8, .8]) mesh(geo.box, black, bench, [x, .3, 0], [.12, .6, .56]);
  for (const z of [-.19, 0, .19]) mesh(geo.box, wood, bench, [0, .63, z], [2.15, .1, .15]);
  for (const x of [-.86, .86]) mesh(geo.box, black, bench, [x, .92, -.26], [.07, .7, .07]);
  for (const y of [.92, 1.15]) mesh(geo.box, wood, bench, [0, y, -.26], [2.15, .13, .08]);

  let animateAmbient = false;
  let offeringState = { flower: 'none', incense: false, candle: false };
  function setOfferings(next = {}) {
    offeringState = { ...offeringState, ...next };
    lotusOffering.visible = offeringState.flower === 'lotus';
    marigold.visible = offeringState.flower === 'marigold';
    incenseGroup.visible = offeringState.incense === true;
    candles.visible = offeringState.candle === true;
  }
  function setMood(mood) {
    const palette = {
      evening: { fire: '#f3ca89', emission: '#e5a44b', intensity: 1.2, water: '#334e51' },
      night: { fire: '#f7d6a3', emission: '#e5a44b', intensity: 1.6, water: '#253b43' },
      dawn: { fire: '#ead2a9', emission: '#b57b36', intensity: .55, water: '#536c69' },
    }[mood] || { fire: '#f3ca89', emission: '#e5a44b', intensity: 1.2, water: '#334e51' };
    fire.color.set(palette.fire); fire.emissive.set(palette.emission); fire.emissiveIntensity = palette.intensity;
    water.color.set(palette.water);
  }
  function setAmbient(enabled) {
    animateAmbient = enabled === true;
    if (!animateAmbient) {
      flames.forEach(f => { f.scale.y = .09; });
      smoke.forEach(f => { f.rotation.y = 0; });
    }
  }
  function update(time) {
    if (!animateAmbient) return;
    const seconds = Number.isFinite(time) ? time / 1000 : 0;
    flames.forEach((f, i) => { f.scale.y = .09 + Math.sin(seconds * 2.6 + i) * .006; });
    smoke.forEach((f, i) => { f.rotation.y = Math.sin(seconds * .38 + i) * .035; });
  }
  setOfferings();
  setMood('evening');
  return { setOfferings, setMood, setAmbient, update };
}
