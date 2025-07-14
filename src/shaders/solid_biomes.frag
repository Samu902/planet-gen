#version 300 es
precision mediump float;

in vec3 vNormal;
in float vElevation;

out vec4 fragColor;

uniform vec3 palette[5];
uniform float minHeight;
uniform float maxHeight;
uniform vec3 lightDirection;

void main() {
    float t = clamp((vElevation - minHeight) / (maxHeight - minHeight), 0.0, 1.0);

    float limit01 = 0.05;
    float limit12 = 0.25;
    float limit23 = 0.75;
    float limit34 = 0.85;

    vec3 color;
    if (t < limit01) {
        float f = t / limit01;
        color = mix(palette[0], palette[1], f);
    } else if (t < limit12) {
        float f = (t - limit01) / (limit12 - limit01);
        color = mix(palette[1], palette[2], f);
    } else if (t < limit23) {
        float f = (t - limit12) / (limit23 - limit12);
        color = mix(palette[2], palette[3], f);
    } else if (t < limit34) {
        float f = (t - limit23) / (limit34 - limit23);
        color = mix(palette[3], palette[4], f);
    } else {
        color = palette[4];
    }

    float light = max(dot(normalize(vNormal), normalize(lightDirection)), 0.0);
    fragColor = vec4(color * light, 1.0);
}
