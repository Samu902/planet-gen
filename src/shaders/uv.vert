#version 300 es
in vec3 position;
in vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec2 Vuv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    Vuv = uv;
}
