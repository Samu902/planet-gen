#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vPosition;
out vec4 fragColor;

uniform vec3 wireframeColor;
uniform float thickness;

void main() {
    float edgeFactor = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float lineThickness = smoothstep(0.0, thickness, edgeFactor);

    fragColor = mix(vec4(wireframeColor, 1.0), vec4(0.0, 0.0, 0.0, 1.0), lineThickness);
}
