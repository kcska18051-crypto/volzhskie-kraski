const rad=Math.PI/180;
export function project(lon,lat){if(lon<0)lon+=360;return [160+(lon-20)*13.5*Math.cos(50*rad),80+(83-lat)*13.5];}
export function mobileProject(lon,lat){const p=lat*rad,d=(lon-90)*rad,c=55*rad;return [450+450*Math.cos(p)*Math.sin(d),330-450*(Math.cos(c)*Math.sin(p)-Math.sin(c)*Math.cos(p)*Math.cos(d))];}
function inRing([x,y],ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
export function pointInCountry(point,feature){if(!feature)return false;const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];return polygons.some(rings=>inRing(point,rings[0])&&!rings.slice(1).some(hole=>inRing(point,hole)));}
