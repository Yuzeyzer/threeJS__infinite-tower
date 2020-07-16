export function getBrick(index, number, odd) {
  let radius = 3;
  let angle = (index * 2 * Math.PI) / number;

  let width = 2 * radius * Math.sin(Math.PI / number) + odd*Math.PI/number;

  let mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(width, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0xcccccc }),
  );
  mesh.position.set((radius + 0.45) * Math.sin(angle), 0, (radius + 0.45) * Math.cos(angle));
  mesh.rotation.y = angle;
  return mesh;
}