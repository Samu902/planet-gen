#version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;

out vec3 vNormal;
out float vElevation;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vElevation = length(position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0f);
}
