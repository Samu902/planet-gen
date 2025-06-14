#version 300 es
precision highp float;
uniform vec4 customColor;
out vec4 outColor;

void main() {
    //outColor = customColor;
    outColor = vec4(1, 1, 1, 1);    //da settare furoi il custom color
}