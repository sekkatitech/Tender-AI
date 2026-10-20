import { useEffect, useRef } from "react"

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.y, u_resolution.x);

    float color = 0.0;
    color += sin(p.x * 10.0 + u_time) * 0.1;
    color += sin(p.y * 8.0 - u_time * 0.8) * 0.1;

    vec3 baseColor = vec3(0.04, 0.05, 0.08);
    vec3 accentColor = vec3(0.0, 0.5, 0.7);
    vec3 highlightColor = vec3(0.0, 0.9, 1.0);

    float glow = 0.05 / length(p - vec2(sin(u_time * 0.5), cos(u_time * 0.3)) * 0.5);

    vec3 finalColor = mix(baseColor, accentColor, color + 0.1);
    finalColor += highlightColor * glow * 0.5;

    gl_FragColor = vec4(finalColor, 1.0);
}
`

/**
 * Ambient animated background for the Hero section — ported from a raw
 * WebGL shader (no charting/3D library needed for a single full-screen
 * gradient quad). Fails silently if WebGL isn't available.
 */
export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function syncSize() {
      const w = canvas!.clientWidth || 1280
      const h = canvas!.clientHeight || 720
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
      }
    }

    const resizeObserver = new ResizeObserver(syncSize)
    resizeObserver.observe(canvas)
    syncSize()

    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null
    if (!gl) {
      resizeObserver.disconnect()
      return
    }

    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)!
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      return shader
    }

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    const positionLoc = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, "u_time")
    const uRes = gl.getUniformLocation(program, "u_resolution")
    const uMouse = gl.getUniformLocation(program, "u_mouse")

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 }
    function handleMouseMove(event: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      if (rect.width && rect.height) {
        mouse.x = ((event.clientX - rect.left) / rect.width) * canvas!.width
        mouse.y = (1 - (event.clientY - rect.top) / rect.height) * canvas!.height
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    let rafId: number
    function render(t: number) {
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
      gl!.uniform1f(uTime, t * 0.001)
      gl!.uniform2f(uRes, canvas!.width, canvas!.height)
      gl!.uniform2f(uMouse, mouse.x, mouse.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(render)
    }
    render(0)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
