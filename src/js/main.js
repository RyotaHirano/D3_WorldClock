import d3 from 'D3';
import queue from 'queue-async';

import slice2 from './lib/slice2';

import createProjection from './geo/create-projection';
import createPath from './geo/create-path';
import createMap from './geo/create-map';
import createGeo from './geo/create-geo';

import rotateEarth from './func/rotate-earth';
import addEffects from './func/add-effects';

import createDispText from './func/create-disp-text';

import { stageSize } from './conf/conf';

let projectionBak;
let projection;
let projectionDummy;
let bakPath;
let path;
let pathDummy;
let bakMap;
let map;
let mapDummy;

let svg;
let stage;
let stage2;
let rotateAnimation;
let gEarthX = 0;
let startTimezone = 9;

/* global requestAnimationFrame, $, d3 */
window.requestAnimationFrame = (() => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (callback, element), function() {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

function addSvgToDom() {
  svg = d3.select('body').append('svg');

  stage = svg.attr({
    width: stageSize,
    height: stageSize
  });

  stage2 = svg.attr({
    width: stageSize,
    height: stageSize
  });
}

function init() {
  createProjection();
  createPath();
  addSvgToDom();
  createGeo();
}

function geoReady(error, world) {
  if (error) throw error;
  createMap();

  /*setInterval(function() {
  	rotateEarth();
  }, 80);*/
  rotateAnimation = requestAnimationFrame(rotateEarth);

  addEffects();
  createDispText();
}

init();
