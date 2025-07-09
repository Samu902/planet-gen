#version 300 es
precision highp float;

in vec2 vUv;

out vec4 outColor;

void main() {
    float stitchWidth = 0.4;

    vec2 newUv;
    if (vUv.x < stitchWidth * 0.5)
        newUv = mix(vec2(vUv.x + 1.0 , vUv.y), vUv, (vUv.x + stitchWidth * 0.5) / stitchWidth);
    else if (vUv.x > 1.0 - stitchWidth * 0.5)
        newUv = mix(vUv, vec2(vUv.x - 1.0 , vUv.y), (vUv.x - (1.0 - stitchWidth * 0.5)) / stitchWidth);
    else 
        newUv = vUv;

    outColor = vec4(newUv, 0.4, 1.0);
}
