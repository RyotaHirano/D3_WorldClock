import d3 from 'D3';
import queue from 'queue-async';

import { stageSize, translateX, translateY, geoJsonUrl, weekDay, startCountry, fill, scale } from './conf/conf';

let projectionBak;
let projection;
let projectionDummy;
let bakPath;
let path;
let pathDummy;
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
    (callback, element) => {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

function createProjection() {
  // 裏側の設定
  projectionBak = d3.geo.orthographic()
    .translate([translateX, translateY])
    .scale(scale)
    .rotate([0, 0, 0])
    .clipAngle(180); // 裏側

  // 表側の設定
  projection = d3.geo.orthographic()
    .translate([translateX, translateY])
    .scale(scale)
    .rotate([0, 0, 0])
    .clipAngle(90);

  projectionDummy = d3.geo.orthographic()
    .translate([translateX, translateY])
    .scale(scale)
    .rotate([0, 0, 0])
    .clipAngle(90);
}

function createPath() {
  bakPath = d3.geo.path().projection(projectionBak);
  path = d3.geo.path().projection(projection);
  pathDummy = d3.geo.path().projection(projectionDummy);
}

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

function createGeo() {
  stage = stage.append('g').attr('transform', 'rotate(23.4, ' + translateX + ', ' + translateY + ')');
  stage2 = stage2.append('g').attr('transform', 'rotate(23.4, ' + translateX + ', ' + translateY + ')');

  queue()
    .defer(d3.json, geoJsonUrl)
    .await(geoReady);
}

function init() {
  createProjection();
  createPath();
  addSvgToDom();
  createGeo();
}

function geoReady(error, world) {
  if (error) throw error;

  //裏面(stage1)
  var bakMap = stage.append("svg:path")
    .attr({
      "d": bakPath,
      "fill-opacity": 1,
      "fill": "#EDE9F1",
      "stroke": "none"
    });

  //表面(stage1)
  var map = stage.selectAll('path').data(world.features).enter().append('path')
    .attr({
      "d": function(d, i) {
        return path(world.features[i]);
      },
      "fill-opacity": 1,
      "fill": "#000",
      "stroke": "none"
        /*,
        "country-name": function(d, i) {
        		return world.features[i].properties.adm0_a3
        },
        "timezone": function(d, i) {
        		return world.features[i].properties.timezone
        }*/
    })
    /*.on("click", function(d) {
    	stage.selectAll('path')
    	.attr({
    		"class": ""
    	});
    	d3.select(this)
    	.attr({
    		"class": "select-country"
    	});
    })*/
  ;

  // click時の面(stage2)
  var mapDummy = stage2.selectAll('path').data(world.features).enter().append('path')
    .attr({
      "d": function(d, i) {
        return pathDummy(world.features[i]);
      },
      "fill-opacity": 0,
      "fill": "#000",
      "stroke": "none",
      "country-name": function(d, i) {
        return world.features[i].properties.adm0_a3
      },
      "timezone": function(d, i) {
        return world.features[i].properties.timezone
      }
    })
    .on("click", function(d) {
      stage2.selectAll('path')
        .attr({
          "class": ""
        });
      d3.select(this)
        .attr({
          "class": "select-country"
        });
    });

  var rotateEarth = function rotateEarth() {
    gEarthX = gEarthX + 0.5;

    projectionBak.rotate([gEarthX, 0, 0]);
    projectionDummy.rotate([gEarthX, 0, 0]);
    projection.rotate([gEarthX, 0, 0]);

    bakPath = d3.geo.path().projection(projectionBak);
    pathDummy = d3.geo.path().projection(projectionDummy);
    path = d3.geo.path().projection(projection);

    bakMap.attr({
      'd': function(d) {
        return bakPath(world)
      }
    });

    map.attr({
        'd': function(d, i) {
          return path(world.features[i]);
        },
        "fill": function(d, i) {
          return fill(i)
        }
      })
      /*.on("click", function(d) {
      	stage.selectAll('path')
      	.attr({
      		"class": ""
      	});
      	d3.select(this)
      	.attr({
      		"class": "select-country"
      	});

      	var countryName = d3.select(this).attr('country-name');
      	setCountryName(countryName);

      	var timezone = d3.select(this).attr('timezone');
      	setWorldTime(timezone);
      })*/
    ;

    mapDummy.attr({
        'd': function(d, i) {
          return pathDummy(world.features[i]);
        },
        "fill": "#000"
      })
      .on("click", function(d) {
        stage2.selectAll('path')
          .attr({
            "class": "",
            "fill-opacity": 0
          });

        projectionDummy.scale(scale * 1.4);

        d3.select(this)
          .attr({
            "class": "select-country",
            "fill-opacity": 1
          });

        var countryName = d3.select(this).attr('country-name');
        setCountryName(countryName);

        var timezone = d3.select(this).attr('timezone');
        setWorldTime(timezone);
      });

    rotateAnimation = requestAnimationFrame(rotateEarth);
  }

  /*setInterval(function() {
  	rotateEarth();
  }, 80);*/
  rotateAnimation = requestAnimationFrame(rotateEarth);

  // zoomの設定
  var zoom = d3.behavior.zoom().on('zoom', function() {
    projection.scale(scale * d3.event.scale);
    map.attr('d', path);
    mapDummy.attr('d', pathDummy);
    bakMap.attr('d', bakPath);
  });
  svg.call(zoom).on("dblclick.zoom", null);

  // drag rollの設定
  var roll = d3.behavior.drag()
    .origin(function() {
      var r = projection.rotate();
      return {
        x: r[0] / 0.25,
        y: r[1] * 0.25 * -1
      };
    })
    .on('drag', function() {
      cancelAnimationFrame(rotateAnimation);

      var newX = d3.event.x * 0.25;
      var newY = d3.event.y * 0.25 * -1;
      projection.rotate([newX, 0, 0]);
      projectionDummy.rotate([newX, 0, 0]);
      projectionBak.rotate([newX, 0, 0]);
      gEarthX = newX; //現在位置の更新
      map.attr('d', path);
      bakMap.attr('d', path);
    })
    .on("dragend", function() {
      // clickでも走ってしまうので一旦キャンセル
      cancelAnimationFrame(rotateAnimation);
      rotateAnimation = requestAnimationFrame(rotateEarth);
    });
  svg.call(roll);

  createDispText();
}

function createDispText() {
  var countryRect = svg.append('g').
  attr({
      'transform': 'translate(530, 300)'
    })
    .append('rect')
    .attr({
      'width': 120,
      'height': 40,
      'fill': '#9C9A9E',
      'fill-opacity': 0.4
    });

  setCountryName('JPN');

  var countryText = svg.append('g')
    .attr({
      'transform': 'translate(130, 350)'
    })
    .append('rect')
    .attr({
      'width': 940,
      'height': 140,
      'fill': '#9C9A9E',
      'fill-opacity': 0.4
    });

  var clockText = svg.append("text")
    .attr({
      "x": "592",
      "y": "465",
      "font-size": 130,
      "font-weight": "bold",
      "font-family": "arial",
      "line-height": 1.8,
      "letter-spacing": 4,
      "word-spacing": 4,
      "text-anchor": "middle",
      "id": "worldTime"
    });

  var YYYYMMDDWRect = svg.append("g")
    .attr({
      'transform': 'translate(450, 500)'
    })
    .append('rect')
    .attr({
      'width': 280,
      'height': 40,
      'fill': '#9C9A9E',
      'fill-opacity': 0.4
    });

  var YYYYMMDDWText = svg.append('text')
    .attr({
      "x": "592",
      "y": "528",
      "font-size": 24,
      "font-weight": "bold",
      "font-family": "arial",
      "line-height": 1.4,
      "letter-spacing": 3,
      "word-spacing": 1,
      "text-anchor": "middle",
      "id": "worldDate"
    })

  setInterval(function() {
    setWorldTime(startTimezone);
  }, 1);
}

function zeroPadding(num) {
  return ('0' + num).slice(-2);
}

function slice2(num) {
  return ('' + num).slice(-2);
}

function setCountryName(name) {
  svg.select('#disp-country-name').remove();
  svg.append('text')
    .attr({
      "x": "588",
      "y": "333",
      "font-size": 35,
      "font-weight": "bold",
      "font-family": "arial",
      "line-height": 1.4,
      "letter-spacing": 4,
      "word-spacing": 1,
      "text-anchor": "middle",
      "id": "disp-country-name"
    }).text(name);
}

function setWorldTime(timezone) {
  startTimezone = timezone;

  //標準時の取得
  var standerdTimeGMT = (new Date()).getTime() + (new Date()).getTimezoneOffset() * 60 * 1000;
  //時差分を加える
  var standerdTime = new Date(standerdTimeGMT + (parseInt(timezone, 10) * 60 * 60 * 1000));
  var formatYYYYMMDDW = standerdTime.getFullYear() + '/' + (standerdTime.getMonth() + 1) + '/' + standerdTime.getDate() + ' (' + weekDay[standerdTime.getDay()] + ')';
  d3.select('#worldDate').text(formatYYYYMMDDW);

  var formatSelectCountryTime = standerdTime.getHours() + ":" + zeroPadding(standerdTime.getMinutes()) + ":" + zeroPadding(standerdTime.getSeconds()) + ":" + zeroPadding(standerdTime.getMilliseconds());
  d3.select('#worldTime').text(formatSelectCountryTime);
}

init();
