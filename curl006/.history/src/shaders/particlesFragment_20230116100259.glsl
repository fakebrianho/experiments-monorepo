uniform float uOpacity;
varying vec3 vPosition;
varying float vTest;
void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength; 
  strength = pow(strength, 3.0);
  strength *= uOpacity;
  // gl_FragColor = vec4(vec3(1.0), 0.25);
  vec3 color1 = vec3(10.0/255.0, 30.0/255.0, 100.0/255.0);
  vec3 color2 = vec3(1.0, 1.0, 0.0);
  vec3 finalColor = mix(color1, color2, vPosition.z * 0.5 + 0.5);
  // vec3 finalColor = mix(color1, color2, vTest/100.);
  gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), vPosition.z * 0.5 + 0.5);
  // gl_FragColor = vec4(finalColor, strength);
}