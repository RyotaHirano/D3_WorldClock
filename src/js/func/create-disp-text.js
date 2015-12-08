export default function createDispText() {
  const countryRect = svg.append('g').
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

  const countryText = svg.append('g')
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

  const clockText = svg.append("text")
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

  const YYYYMMDDWRect = svg.append("g")
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

  const YYYYMMDDWText = svg.append('text')
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
                          });

  setInterval(function() {
    setWorldTime(startTimezone);
  }, 1);
}
