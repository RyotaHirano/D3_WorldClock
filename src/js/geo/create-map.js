export default function createMap() {
  //裏面(stage1)
  bakMap = stage.append("svg:path")
    .attr({
      d: bakPath,
      'fill-opacity': 1,
      fill: '#EDE9F1',
      stroke: "none"
    });

  //表面(stage1)
  map = stage.selectAll('path').data(world.features).enter().append('path')
    .attr({
      d: function(d, i) {
        return path(world.features[i]);
      },
      'fill-opacity': 1,
      fill: '#000',
      stroke: 'none'
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
  mapDummy = stage2.selectAll('path').data(world.features).enter().append('path')
    .attr({
      d: function(d, i) {
        return pathDummy(world.features[i]);
      },
      'fill-opacity': 0,
      fill: '#000',
      stroke: 'none',
      'country-name': function(d, i) {
        return world.features[i].properties.adm0_a3;
      },
      timezone: function(d, i) {
        return world.features[i].properties.timezone;
      }
    })
    .on('click', function(d) {
      stage2.selectAll('path')
        .attr({
          'class': ''
        });
      d3.select(this)
        .attr({
          'class': 'select-country'
        });
    });
}
