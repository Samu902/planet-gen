#version 300 es
precision mediump float;

uniform vec3 lightDirection;
uniform vec3 customColor;

in vec3 vNormal;
out vec4 outColor;

void main() {
    float light = max(dot(normalize(vNormal), normalize(lightDirection)), 0.0);
    
    outColor = vec4(customColor * light, 1.0);
}
