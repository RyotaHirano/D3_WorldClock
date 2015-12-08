export default function addEffects() {
  // zoomの設定
  const zoom = d3.behavior.zoom().on('zoom', () => {
    projection.scale(scale * d3.event.scale);
    map.attr('d', path);
    mapDummy.attr('d', pathDummy);
    bakMap.attr('d', bakPath);
  });
  svg.call(zoom).on('dblclick.zoom', null); // イベントの登録

  // dragRollの設定
  const roll = d3.behavior.drag()
    .origin(() => {
      const r = projection.rotate();
      return {
        x: r[0] / 0.25,
        y: r[1] * 0.25 * -1
      };
    })
    .on('drag', () => {
      cancelAnimationFrame(rotateAnimation);
      const newX = d3.event.x * 0.25;
      const newY = d3.event.y * 0.25 * -1;
      projection.rotate([newX, 0, 0]);
      projectionDummy.rotate([newX, 0, 0]);
      projectionBak.rotate([newX, 0, 0]);
      gEarthX = newX; //現在位置の更新
      map.attr('d', path);
      bakMap.attr('d', path);
    })
    .on("dragend", () => {
      // clickでも走ってしまうので一旦キャンセル
      cancelAnimationFrame(rotateAnimation);
      rotateAnimation = requestAnimationFrame(rotateEarth);
    });
  svg.call(roll); // イベントの登録
}
