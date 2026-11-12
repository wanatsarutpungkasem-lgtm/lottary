import * as THREE from 'three';

// Original stylized adult, approximately 1.78 m high. Front faces +Z; feet at Y=0.
// Geometry is shared between visitors; per-visitor materials allow independent outfits.
const sphere = new THREE.SphereGeometry(1, 16, 12);
const segment = new THREE.CylinderGeometry(1, 1, 1, 12);
const up = new THREE.Vector3(0, 1, 0);
const tunic = new THREE.LatheGeometry([
  new THREE.Vector2(.205, .55), new THREE.Vector2(.225, .57),
  new THREE.Vector2(.19, .94), new THREE.Vector2(.165, 1.07),
  new THREE.Vector2(.19, 1.27), new THREE.Vector2(.205, 1.38),
  new THREE.Vector2(.145, 1.45), new THREE.Vector2(.075, 1.47),
], 20);

const matte = color => new THREE.MeshStandardMaterial({color, roughness:.88, metalness:0});
function piece(geometry, material, parent, position, scale){
  const mesh = new THREE.Mesh(geometry, material);
  if(position)mesh.position.set(...position);
  if(scale)mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function colorValue(value, fallback){
  return typeof value === 'string' || typeof value === 'number' || value?.isColor ? value : fallback;
}

export function createAdultVisitor({color='#76667e', skin='#b98260', hairStyle='short'}={}){
  const group = new THREE.Group();
  group.name = 'adult-visitor';
  const cloth = matte(colorValue(color, '#76667e'));
  const skinMat = matte(colorValue(skin, '#b98260'));
  const hairMat = matte('#241d22');
  const trousers = matte('#302b36');
  const shoes = matte('#302b2a');
  const trim = new THREE.MeshStandardMaterial({color:'#a68d60', roughness:.7, metalness:.15});
  const faceDetail = matte('#49362f');

  const torso = piece(tunic, cloth, group);
  torso.name = 'long-tunic';
  // Subtle collar and sash give the outfit structure without ornament overload.
  piece(segment, trim, group, [0, 1.455, 0], [.078,.023,.078]);
  piece(segment, trim, group, [0, 1.025, 0], [.171,.035,.171]);
  const placket = piece(segment, trim, group, [0, 1.30, .184], [.006,.23,.004]);
  placket.rotation.x = -.06;
  piece(segment, skinMat, group, [0,1.49,0], [.061,.11,.059]);

  const head = new THREE.Group();head.position.set(0,1.61,0);group.add(head);
  piece(sphere, skinMat, head, [0,0,0], [.112,.143,.105]);
  piece(sphere, skinMat, head, [-.115,-.005,-.004], [.022,.035,.017]);
  piece(sphere, skinMat, head, [.115,-.005,-.004], [.022,.035,.017]);
  piece(sphere, skinMat, head, [0,-.015,.107], [.018,.028,.018]);
  for(const x of [-.041,.041]){
    piece(sphere, faceDetail, head, [x,.018,.095], [.006,.004,.004]);
    const brow=piece(segment,hairMat,head,[x,.040,.091],[.003,.032,.003]);
    brow.rotation.z=Math.PI/2;
  }
  const mouth=piece(segment,faceDetail,head,[0,-.062,.092],[.002,.026,.002]);
  mouth.rotation.z=Math.PI/2;
  const shortHair = new THREE.Group();head.add(shortHair);
  piece(sphere,hairMat,shortHair,[0,.078,-.012],[.116,.085,.105]);
  piece(sphere,hairMat,shortHair,[-.093,.030,-.021],[.027,.074,.081]);
  piece(sphere,hairMat,shortHair,[.093,.030,-.021],[.027,.074,.081]);
  const tiedHair = new THREE.Group();head.add(tiedHair);
  piece(sphere,hairMat,tiedHair,[0,.073,-.020],[.116,.088,.105]);
  piece(sphere,hairMat,tiedHair,[0,.01,-.087],[.095,.11,.034]);
  piece(sphere,hairMat,tiedHair,[0,.076,-.136],[.061,.060,.052]);
  piece(segment,trim,tiedHair,[0,.074,-.136],[.061,.012,.054]);

  const limb = (material,radius) => piece(segment,material,group,null,[radius,1,radius]);
  const arms = [-1,1].map(side=>({
    side, upper:limb(cloth,.058), lower:limb(skinMat,.037),
    cuff:limb(trim,.041), hand:piece(sphere,skinMat,group,null,[.034,.062,.022]),
  }));
  const legs = [-1,1].map(side=>({
    side, thigh:limb(trousers,.069), shin:limb(trousers,.054),
    shoe:piece(sphere,shoes,group,null,[.068,.044,.112]),
  }));
  const a=new THREE.Vector3(),b=new THREE.Vector3(),direction=new THREE.Vector3();
  function connect(mesh, from, to, radius){
    a.set(...from);b.set(...to);direction.subVectors(b,a);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    const length=direction.length();
    mesh.quaternion.setFromUnitVectors(up,direction.divideScalar(length||1));
    mesh.scale.set(radius,length,radius);
  }
  let pose='idle', phase=0, walking=false;
  function apply(){
    const prayer=pose==='wai'&&!walking;
    head.rotation.x=prayer?.13:0;
    for(const arm of arms){
      const s=arm.side,swing=walking?Math.sin(phase)*s:0;
      const shoulder=[s*.205,1.39,0];
      const elbow=prayer?[s*.265,1.12,.125]:[s*.25,1.105,swing*.105];
      const wrist=prayer?[s*.027,1.265,.30]:[s*.245,.885,swing*.21+.025];
      connect(arm.upper,shoulder,elbow,.057);
      connect(arm.lower,elbow,wrist,.035);
      const cuffStart=elbow.map((n,i)=>n+(shoulder[i]-n)*.11);
      connect(arm.cuff,cuffStart,elbow,.058);
      arm.hand.position.set(...wrist);
      arm.hand.rotation.set(prayer?-.12:0,0,prayer?-s*.08:0);
      arm.hand.scale.set(prayer?.024:.034,.062,prayer?.030:.022);
    }
    for(const leg of legs){
      const s=leg.side,swing=walking?Math.sin(phase)*s:0;
      const hip=[s*.087,.79,0],knee=[s*.087,.425,swing*.10];
      const lift=walking?Math.max(0,swing)*.065:0;
      const ankle=[s*.087,.09+lift,swing*.22];
      connect(leg.thigh,hip,knee,.065);connect(leg.shin,knee,ankle,.049);
      leg.shoe.position.set(ankle[0],.045+lift,ankle[2]+.028);
      leg.shoe.rotation.x=walking?-swing*.12:0;
    }
  }
  function setAppearance(next={}){
    if(next.color!==undefined)cloth.color.set(colorValue(next.color,'#76667e'));
    if(next.skin!==undefined)skinMat.color.set(colorValue(next.skin,'#b98260'));
    if(next.hairStyle!==undefined)hairStyle=next.hairStyle==='tied'?'tied':'short';
    shortHair.visible=hairStyle!=='tied';tiedHair.visible=hairStyle==='tied';
  }
  function setWalking(nextPhase=0,isWalking=false){
    phase=Number.isFinite(nextPhase)?nextPhase:0;walking=Boolean(isWalking);
    if(walking)pose='idle';apply();
  }
  function setPose(next='idle'){pose=next==='wai'?'wai':'idle';if(pose==='wai')walking=false;apply();}
  setAppearance({hairStyle});apply();
  return {group,setAppearance,setWalking,setPose};
}
