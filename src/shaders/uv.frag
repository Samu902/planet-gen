#version 300 es
precision highp float;
//uniform vec4 customColor;
out vec4 outColor;
in vec2 Vuv;

void main() {
    //outColor = customColor;
    outColor = vec4(Vuv, 0.4, 1.0);
}
