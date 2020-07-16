export function getBrick(index, number) {
  let mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true,}),
  );
  return mesh;
}
