#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;
in vec3 tangent;
in vec2 uv;

out float vElevation;
out vec2 vUv;
out mat3 vTBNMatrix;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
    vElevation = length(position);    
    vUv = uv;

    vec3 n = normalize(normalMatrix * normal);
    vec3 t = normalize(normalMatrix * tangent);
    vec3 b = normalize(cross(n, t));
    vTBNMatrix = mat3(t, b, n);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
