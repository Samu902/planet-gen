#version 300 es
precision highp float;
out vec4 outColor;
in vec2 Vuv;

void main() {
    outColor = vec4(Vuv, 0.4, 1.0);
}
