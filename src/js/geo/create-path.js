export default function createPath() {
  bakPath = d3.geo.path().projection(projectionBak);
  path = d3.geo.path().projection(projection);
  pathDummy = d3.geo.path().projection(projectionDummy);
}
