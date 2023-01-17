uniform sampler2D positions;
uniform float uPointSize; 
varying vec3 vPosition;
varying float vTest;
void main() { 
  vec3 pos = texture2D(positions, position.xy).xyz;
  vPosition = pos; 
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // gl_PointSize = uPointSize / -mvPosition.z;
  // gl_PointSize = uPointSize;
  gl_PointSize = uPointSize * 3.0;
  gl_PointSize *= step(1.0 - (1.0/64.0), position.z) + 0.5;
  vTest = gl_PointSize;
}
