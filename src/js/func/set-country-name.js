export default function setCountryName(name) {
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
