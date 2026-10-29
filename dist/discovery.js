import {randomDigits} from './random.js';
export function secureIndex(size,source=globalThis.crypto){
 if(!Number.isInteger(size)||size<1||size>65536)throw new Error('ขนาดชุดข้อมูลไม่ถูกต้อง');
 if(!source?.getRandomValues)throw new Error('เบราว์เซอร์นี้ไม่รองรับการสุ่มที่ปลอดภัย');
 const limit=Math.floor(4294967296/size)*size;let value;
 do{value=source.getRandomValues(new Uint32Array(1))[0];}while(value>=limit);
 return value%size;
}
export function uniqueNumbers(digits,count,source=globalThis.crypto){
 if(![2,3,6].includes(digits)||![1,3,5].includes(count))throw new Error('กรุณาเลือกจำนวนหลักและจำนวนชุดที่รองรับ');
 const values=new Set();while(values.size<count)values.add(randomDigits(digits,source));return [...values];
}
