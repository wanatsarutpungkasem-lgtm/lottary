// Original geometric interpretation of the user's supplied seated, four-armed reference.
// No photo texture or claim of a scan/reconstruction from unseen angles.
import * as T from 'three';
export function makeReferenceGanesha(){
 const root=new T.Group();root.name='reference-inspired-ganesha';
 const material=(color,metalness=0,roughness=.6)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const skin=material('#dc8c58',.02,.64),inner=material('#db7a75',.01,.7),gold=material('#d5a63f',.65,.3),bright=material('#efd48a',.45,.4),ruby=material('#a62c39',.3,.25),ivory=material('#f8e5bc',.02,.5),pink=material('#bd395e',.05,.55),pinkLight=material('#e56785',.05,.6),blue=material('#226178',.2,.6),dark=material('#3b2330',0,.8);
 function mesh(geometry,mat,x=0,y=0,z=0,parent=root){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function ellipsoid(r,mat,x,y,z,sx=1,sy=1,sz=1,parent=root){const m=mesh(new T.SphereGeometry(r,32,24),mat,x,y,z,parent);m.scale.set(sx,sy,sz);return m;}
 function ring(r,t,mat,x,y,z,horizontal=false,sx=1,sy=1){const m=mesh(new T.TorusGeometry(r,t,10,64),mat,x,y,z);if(horizontal)m.rotation.x=Math.PI/2;m.scale.set(sx,sy,1);return m;}
 function cylinder(a,b,h,mat,x,y,z){return mesh(new T.CylinderGeometry(a,b,h,40),mat,x,y,z);}
 function tube(points,r,mat){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(curve,40,r,12,false),mat);}
 function beadChain(points,r,mat){const inst=new T.InstancedMesh(new T.SphereGeometry(r,10,8),mat,points.length);const helper=new T.Object3D();points.forEach((p,i)=>{helper.position.set(...p);helper.updateMatrix();inst.setMatrixAt(i,helper.matrix);});inst.castShadow=true;root.add(inst);return inst;}
 function circleBeads(r,y,z,n,mat,scaleY=1,bead=.035){const points=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;points.push([Math.cos(a)*r,y+Math.sin(a)*r*scaleY,z]);}beadChain(points,bead,mat);}
 // Lotus: two tiers of gently cupped petals, not a flat picture plane.
 cylinder(.9,1,.15,gold,0,.08,0);const petalShape=new T.Shape();petalShape.moveTo(0,0);petalShape.bezierCurveTo(-.45,.12,-.42,.66,0,.88);petalShape.bezierCurveTo(.42,.66,.45,.12,0,0);
 const petalGeo=new T.ExtrudeGeometry(petalShape,{depth:.045,bevelEnabled:true,bevelSize:.04,bevelThickness:.035,bevelSegments:3,steps:1,curveSegments:14});
 for(let tier=0;tier<2;tier++)for(let i=0;i<12;i++){const a=i/12*Math.PI*2+tier*.26,g=new T.Group();g.position.set(Math.cos(a)*(.72-tier*.18),.1+tier*.11,Math.sin(a)*(.72-tier*.18));g.rotation.y=Math.PI/2-a;g.rotation.x=.95-tier*.35;root.add(g);const petal=mesh(petalGeo,tier?pinkLight:pink,0,0,0,g);petal.scale.y=.65;}
 cylinder(.82,.9,.16,pink,0,.34,0);
 // Seated body and crossed legs.
 ellipsoid(.73,skin,0,1.18,0,1.08,1.02,.77);ellipsoid(.51,skin,0,1.7,-.04,.92,1.1,.7);
 ellipsoid(.45,skin,-.52,.63,.28,1.35,.7,.9).rotation.z=-.24;ellipsoid(.45,skin,.52,.63,.28,1.35,.7,.9).rotation.z=.24;
 ellipsoid(.24,skin,-.32,.5,.75,.83,.6,1.1).rotation.y=.4;ellipsoid(.24,skin,.32,.5,.75,.83,.6,1.1).rotation.y=-.4;
 ring(.65,.05,gold,0,.77,.02,true,1.1,1);for(const side of [-1,1]){ring(.17,.035,gold,side*.32,.52,.71,false,1,.65);for(let j=0;j<4;j++)ellipsoid(.04,skin,side*(.22+j*.065),.46,.93,1,1,.8);}
 // Elephant face, soft cheeks and broad inner ears.
 ellipsoid(.48,skin,0,2.31,.02,1,1.11,.84);
 for(const side of [-1,1]){const ear=ellipsoid(.45,skin,side*.59,2.3,-.02,.78,1.06,.3);ear.rotation.z=side*-.14;ellipsoid(.34,inner,side*.62,2.31,.106,.7,1.05,.16);ring(.1,.025,gold,side*.72,1.98,.14);ellipsoid(.045,ruby,side*.72,1.86,.16);}
 // Painted eyes and forehead details sit on shaped surfaces, with original vector-like marks.
 const faceCanvas=document.createElement('canvas');faceCanvas.width=512;faceCanvas.height=256;const ctx=faceCanvas.getContext('2d');
 for(const side of [-1,1]){const x=256+side*130;ctx.save();ctx.translate(x,136);ctx.scale(side,1);ctx.fillStyle='#fff7e1';ctx.beginPath();ctx.moveTo(-62,0);ctx.bezierCurveTo(-20,-53,37,-48,60,0);ctx.bezierCurveTo(15,35,-30,25,-62,0);ctx.fill();ctx.strokeStyle='#3c2028';ctx.lineWidth=9;ctx.stroke();ctx.fillStyle='#573528';ctx.beginPath();ctx.ellipse(0,-5,19,28,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#171621';ctx.beginPath();ctx.ellipse(0,-5,10,24,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-6,-16,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#542726';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-64,-52);ctx.quadraticCurveTo(0,-93,62,-48);ctx.stroke();ctx.restore();}
 const eyeTexture=new T.CanvasTexture(faceCanvas);eyeTexture.colorSpace=T.SRGBColorSpace;const eyes=mesh(new T.SphereGeometry(.485,48,24,Math.PI/2-.72,1.44,1.05,.62),new T.MeshStandardMaterial({map:eyeTexture,transparent:true,depthWrite:false,roughness:.8}),0,2.31,.02);eyes.scale.set(1,1.11,.845);
 ellipsoid(.055,ruby,0,2.65,.368,.65,1,.15);tube([[0,2.73,.34],[0,2.84,.31],[.07,2.85,.3]],.012,ruby);
 // A tapered curled trunk with subtle rings.
 const trunkCurve=new T.CatmullRomCurve3([[0,2.3,.39],[0,2.05,.63],[.01,1.7,.74],[.16,1.5,.83],[.45,1.55,.89],[.51,1.76,.9]].map(v=>new T.Vector3(...v)));
 const trunkGeo=new T.TubeGeometry(trunkCurve,64,.17,16,false),pos=trunkGeo.attributes.position;
 for(let i=0;i<=64;i++){const center=trunkCurve.getPointAt(i/64),scale=1-i/64*.6;for(let j=0;j<=16;j++){const k=i*17+j,v=new T.Vector3().fromBufferAttribute(pos,k).sub(center).multiplyScalar(scale).add(center);pos.setXYZ(k,v.x,v.y,v.z);}}trunkGeo.computeVertexNormals();mesh(trunkGeo,skin);
 for(let i=1;i<8;i++){const t=i*.09,c=trunkCurve.getPointAt(t),normal=trunkCurve.getTangentAt(t),wrinkle=ring(.17*(1-t*.6),.004,inner,c.x,c.y,c.z);wrinkle.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);}
 for(const side of [-1,1]){const tusk=cylinder(.014,.075,.32,ivory,side*.25,2.01,.47);tusk.rotation.z=side*.4;tusk.rotation.x=.22;}
 // Four distinct arms; front left blessing palm and front right offering bowl.
 for(const side of [-1,1]){tube([[side*.42,1.83,-.13],[side*.82,2,-.18],[side*1.03,2.5,-.08],[side*1.02,2.72,.02]],.105,skin);ellipsoid(.135,skin,side*1.02,2.73,.02,.85,1.1,.8);ring(.12,.027,gold,side*1.02,2.55,.01,true);}
 tube([[-.48,1.66,.05],[-.86,1.35,.2],[-1.02,1.62,.42]],.12,skin);ellipsoid(.16,skin,-1.02,1.77,.44,.88,1.1,.45);
 for(let i=0;i<4;i++)tube([[-1.13+i*.065,1.82,.44],[-1.14+i*.067,2.05+(i===1?.05:0),.43]],.027,skin);tube([[-.9,1.75,.45],[-.82,1.86,.48]],.035,skin);ring(.12,.025,gold,-1.01,1.59,.4,true);
 tube([[.48,1.65,.05],[.83,1.29,.24],[1.05,1.31,.55]],.12,skin);ellipsoid(.15,skin,1.05,1.32,.57,1,.45,1.2);ring(.12,.025,gold,.88,1.31,.37,false);
 cylinder(.36,.22,.13,gold,1.08,1.49,.58);for(let row=0;row<3;row++)for(let i=0;i<6-row;i++){const a=i/(6-row)*Math.PI*2,r=.23-row*.075;ellipsoid(.075,bright,1.08+Math.cos(a)*r,1.6+row*.1,.58+Math.sin(a)*r);}
 // Gold crown, halo and jeweled necklaces.
 ring(1.06,.045,gold,0,2.45,-.45);ring(.94,.065,blue,0,2.45,-.445);circleBeads(1.1,2.45,-.45,60,gold,1,.035);
 for(const [y,r,t]of [[2.76,.39,.045],[2.89,.4,.035],[3.04,.33,.045],[3.22,.28,.035]]){ring(r,t,gold,0,y,0,true);const points=[];for(let i=0;i<22;i++){const a=i/22*Math.PI*2;points.push([Math.cos(a)*r,y+.025,Math.sin(a)*r]);}beadChain(points,.028,bright);}
 const crownProfile=[[0,2.78],[.37,2.78],[.39,2.88],[.33,3.02],[.31,3.14],[.24,3.25],[.2,3.37],[.08,3.46],[0,3.55]].map(([x,y])=>new T.Vector2(x,y));mesh(new T.LatheGeometry(crownProfile,48),gold);
 ellipsoid(.11,ruby,0,3.05,.34,.75,1.3,.35);for(const side of [-1,1])ellipsoid(.055,blue,side*.25,2.88,.31,.7,1,.3);
 for(const [r,y,stretch]of [[.36,1.73,1.1],[.46,1.6,1.2],[.55,1.45,1.1]]){ring(r,.026,gold,0,y,.49,false,1,stretch);circleBeads(r,y,.515,36,bright,stretch,.024);}ellipsoid(.1,ruby,0,1.03,.59,.75,1.2,.35);
 // Two gold emblems held in the raised hands, inspired by the reference silhouette.
 for(const side of [-1,1]){const staff=cylinder(.022,.025,.78,gold,side*1.04,3.02,.02);staff.rotation.z=side*-.12;ring(.18,.035,gold,side*1.08,3.39,.025);ellipsoid(.06,ruby,side*1.08,3.39,.04,1,1,.4);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ellipsoid(.07,gold,side*1.08+Math.cos(a)*.19,3.39+Math.sin(a)*.19,.025,.65,1,.35);}}
 return root;
}
