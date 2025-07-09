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

    // intervallo diviso in 4 fasce: 0.0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1.0
    // oceano, costa, pianura, collina, montagna
    vec3 color;
    if (t < 0.25) {
        float f = t / 0.25;
        color = mix(palette[0], palette[1], f);
    } else if (t < 0.5) {
        float f = (t - 0.25) / 0.25;
        color = mix(palette[1], palette[2], f);
    } else if (t < 0.75) {
        float f = (t - 0.5) / 0.25;
        color = mix(palette[2], palette[3], f);
    } else {
        float f = (t - 0.75) / 0.25;
        color = mix(palette[3], palette[4], f);
    }

    float light = max(dot(normalize(vNormal), normalize(lightDirection)), 0.0);
    fragColor = vec4(color * light, 1.0);
}
