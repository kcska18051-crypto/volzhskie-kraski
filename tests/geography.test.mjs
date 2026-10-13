import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {geographyOrigin,geographyRoutes,geographyCountries,geographyViews} from '../src/geography-config.js';
import {project,mobileProject,pointInCountry} from '../scripts/map-geometry.mjs';
import {getGeographyCountry,geographyContext} from '../src/geography.js';

const features=JSON.parse(await readFile(new URL('../docs/map-data/countries.json',import.meta.url),'utf8')).features;
const country=id=>features.find(f=>f.properties.ADM0_A3===id);
const within=(point,view)=>point[0]>=view[0]&&point[0]<=view[0]+view[2]&&point[1]>=view[1]&&point[1]<=view[1]+view[3];

test('three representative endpoints and the only production node are on their corresponding land',()=>{
 assert.equal(geographyRoutes.length,3);
 assert.deepEqual(new Set(geographyRoutes.map(route=>route.country)),new Set(['RUS','BLR','KAZ']));
 for(const route of geographyRoutes){assert.equal(pointInCountry([route.lon,route.lat],country(route.country)),true);assert.equal(within(project(route.lon,route.lat),geographyViews.desktop),true);assert.equal(within(mobileProject(route.lon,route.lat),geographyViews.mobile),true);}
 assert.equal(pointInCountry([geographyOrigin.lon,geographyOrigin.lat],country('RUS')),true);
 assert.equal(pointInCountry([165,55],country('RUS')),false);
});

test('compact viewBoxes retain every original country vertex and both production locations',()=>{
 for(const feature of features){const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];for(const polygon of polygons)for(const ring of polygon)for(const point of ring){assert.ok(within(project(...point),geographyViews.desktop),feature.properties.ADM0_A3+' desktop');assert.ok(within(mobileProject(...point),geographyViews.mobile),feature.properties.ADM0_A3+' mobile');}}
 assert.ok(within(project(geographyOrigin.lon,geographyOrigin.lat),geographyViews.desktop));
 assert.ok(within(mobileProject(geographyOrigin.lon,geographyOrigin.lat),geographyViews.mobile));
});

test('country selection gives an editable destination context without inventing client cities',()=>{
 assert.equal(getGeographyCountry('missing'),null);
 assert.equal(geographyContext(null),'Поставка в мой регион');
 assert.equal(geographyContext('missing'),'Поставка в мой регион');
 for(const entry of geographyCountries){assert.deepEqual(getGeographyCountry(entry.id),entry);assert.equal(geographyContext(entry.id),entry.context);}
 assert.equal(geographyContext('BLR'),'Поставка в Беларусь');
 assert.equal(geographyContext('KAZ'),'Поставка в Казахстан');
});
