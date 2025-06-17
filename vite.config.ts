import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

// plugin to remove `#version 300 es` at the beginning of shader files: 
// it must be called before glsl() plugin and it's needed to balance linting by glsl extension and code injection by three.js
function es3fix() {
    return {
        name: 'strip-glsl-version',
        enforce: 'pre' as const,
        transform(code: string, id: string) {
            if (id.endsWith('.glsl') || id.endsWith('.vert') || id.endsWith('.frag')) {
                return {
                    code: code.replace(/^#version\s+300\s+es\s*\n/, ''),
                    map: null
                };
            }
        }
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        es3fix(),
        glsl(),
    ],
    server: {
        port: 3000,
    },
    base: '/planet-gen/'
})
