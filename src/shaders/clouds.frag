#version 300 es
precision highp float;

in vec2 vUv;
in vec3 vNormal;

out vec4 fragColor;

uniform float time;
uniform float wind;
uniform vec3 lightDirection;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.6;
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

vec2 animate(vec2 v2) {
    vec2 uv = v2 * 6.0;
    uv.y += time * 0.02 * wind;
    uv.x += sin(time * 0.1 * wind) * 0.5;
    return uv;
}

void main() {    
    float stitchWidth = 0.4;

    float density;
    if (vUv.x < stitchWidth * 0.5)
        density = mix(fbm(animate(vec2(vUv.x + 1.0 , vUv.y))), fbm(animate(vUv)), (vUv.x + stitchWidth * 0.5) / stitchWidth);
    else if (vUv.x > 1.0 - stitchWidth * 0.5)
        density = mix(fbm(animate(vUv)), fbm(animate(vec2(vUv.x - 1.0 , vUv.y))), (vUv.x - (1.0 - stitchWidth * 0.5)) / stitchWidth);
    else 
        density = fbm(animate(vUv));

    float softness = smoothstep(0.3, 0.8, density);
    vec3 cloudColor = mix(vec3(0.05, 0.07, 0.15), vec3(0.8), softness);
    float light = max(dot(normalize(vNormal), normalize(lightDirection)), 0.0);
    float alpha = softness * 0.8;

    fragColor = vec4(cloudColor * light, alpha);
}
