#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 vNormal;

void main() {
    vNormal = normalize(normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
