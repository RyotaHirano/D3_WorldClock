import setCountryName from '../func/set-country-name';
import setWorldTime from '../func/set-world-time';

export default function rotateEarth() {
  gEarthX = gEarthX + 0.5;

  projectionBak.rotate([gEarthX, 0, 0]);
  projectionDummy.rotate([gEarthX, 0, 0]);
  projection.rotate([gEarthX, 0, 0]);

  bakPath = d3.geo.path().projection(projectionBak);
  pathDummy = d3.geo.path().projection(projectionDummy);
  path = d3.geo.path().projection(projection);

  bakMap.attr({
    d: function(d) {
      return bakPath(world);
    }
  });

  map.attr({
      d: function(d, i) {
        return path(world.features[i]);
      },
      fill: function(d, i) {
        return fill(i);
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
      d: function(d, i) {
        return pathDummy(world.features[i]);
      },
      fill: '#000'
    })
    .on('click', function(d) {
      stage2.selectAll('path')
        .attr({
          'class': '',
          'fill-opacity': 0
        });

      projectionDummy.scale(scale * 1.4);

      d3.select(this)
        .attr({
          'class': 'select-country',
          'fill-opacity': 1
        });

      const countryName = d3.select(this).attr('country-name');
      setCountryName(countryName);

      const timezone = d3.select(this).attr('timezone');
      setWorldTime(timezone);
    });

  rotateAnimation = requestAnimationFrame(rotateEarth);
}
