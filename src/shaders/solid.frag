#version 300 es
precision highp float;
uniform vec3 customColor;
out vec4 outColor;

void main() {
    outColor = vec4(customColor, 1);
}