export default function createGeo() {
  stage = stage.append('g').attr('transform', 'rotate(23.4, ' + translateX + ', ' + translateY + ')');
  stage2 = stage2.append('g').attr('transform', 'rotate(23.4, ' + translateX + ', ' + translateY + ')');

  queue()
    .defer(d3.json, geoJsonUrl) // geojsonの読み込み
    .await(geoReady);
}
