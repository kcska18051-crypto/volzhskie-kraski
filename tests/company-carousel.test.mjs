import test from 'node:test';
import assert from 'node:assert/strict';
import {carouselDestination} from '../src/company-carousel.js';
test('order carousel advances through every window and loops in both directions',()=>{assert.equal(carouselDestination(0,-1,7),7);assert.equal(carouselDestination(7,1,7),0);assert.equal(carouselDestination(3,1,7),4);assert.equal(carouselDestination(0,1,0),0);});
