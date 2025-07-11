#version 300 es
precision highp float;

in float vElevation;
in vec2 vUv;
in mat3 vTBNMatrix;

out vec4 fragColor;

uniform sampler2D tex0; // Oceano
uniform sampler2D tex1; // Costa
uniform sampler2D tex2; // Prateria
uniform sampler2D tex3; // Roccia
uniform sampler2D tex4; // Neve

uniform sampler2D normal0; // Oceano
uniform sampler2D normal1; // Costa
uniform sampler2D normal2; // Prateria
uniform sampler2D normal3; // Roccia
uniform sampler2D normal4; // Neve

uniform float time;
uniform float minHeight;
uniform float maxHeight;
uniform vec3 lightDirection;
uniform float wind;

void main() {
    vec2 uv = vUv * 2.0;

    vec4 color;

    float limit01 = 0.05;
    float limit12 = 0.2;
    float limit23 = 0.75;
    float limit34 = 0.85;

    vec3 normalRGB;
    float t = clamp((vElevation - minHeight) / (maxHeight - minHeight), 0.0, 1.0);
    if (t < limit01) {
        float f = t / limit01;
        color = mix(vec4(0.302, 0.463, 0.8, 1.0), texture(tex1, uv * 5.0), f);
        vec2 uv1 = uv * 2.0 + vec2(time * wind * 0.01, time * wind * 0.005) * 0.5;
        vec2 uv2 = uv * 1.5 - vec2(time * wind * 0.01, time * wind * 0.015) * 1.0;
        vec3 n0 =  texture(normal0, uv1).rgb + texture(normal0, uv2).rgb;
        normalRGB = mix(n0, texture(normal1, uv).rgb, f);
    } else if (t < limit12) {
        float f = (t - limit01) / (limit12 - limit01);
        color = mix(texture(tex1, uv * 5.0), texture(tex2, uv * 7.5), f);
        normalRGB = mix(texture(normal1, uv).rgb, texture(normal2, uv * 7.5).rgb, f);
    } else if (t < limit23) {
        float f = (t - limit12) / (limit23 - limit12);
        color = mix(texture(tex2, uv * 7.5), texture(tex3, uv * 2.0), f);
        normalRGB = mix(texture(normal2, uv * 7.5).rgb, texture(normal3, uv * 2.0).rgb, f);
    } else if (t < limit34) {
        float f = (t - limit23) / (limit34 - limit23);
        color = mix(texture(tex3, uv * 2.0), texture(tex4, uv), f);
        normalRGB = mix(texture(normal3, uv * 2.0).rgb, texture(normal4, uv).rgb, f);
    } else {
        color = texture(tex4, uv);
        normalRGB = texture(normal4, uv).rgb;
    }
    vec3 normal = normalize(vTBNMatrix * (normalRGB * 2.0 - 1.0));

    float light = max(dot(normalize(normal), normalize(lightDirection)), 0.0);
    light = mix(0.1, 0.9, light);

    fragColor = vec4(color.rgb * light, 1.0);
}
