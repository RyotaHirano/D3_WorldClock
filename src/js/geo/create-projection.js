import d3 from 'D3';
import { translateX, translateY, scale } from '../conf/conf';

export default function createProjection() {
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
