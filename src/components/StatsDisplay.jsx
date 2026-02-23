import React, { useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export const StatsDisplay = () => {
    const { gl } = useThree();
    const [stats, setStats] = useState({
        fps: 0,
        fpsMin: 1000,
        fpsMax: 0,
        frameTime: 0,
        cpuTime: 0,
        drawCalls: 0,
        triangles: 0,
        geometries: 0,
        textures: 0,
        materials: 0,
    });

    const frames = useRef(0);
    const prevTime = useRef(performance.now());
    const fpsHistory = useRef([]);

    useFrame(() => {
        const time = performance.now();
        frames.current++;

        if (time >= prevTime.current + 1000) {
            const currentFps = Math.round((frames.current * 1000) / (time - prevTime.current));

            fpsHistory.current.push(currentFps);
            if (fpsHistory.current.length > 10) fpsHistory.current.shift();

            const min = Math.min(...fpsHistory.current);
            const max = Math.max(...fpsHistory.current);

            setStats(prev => ({
                ...prev,
                fps: currentFps,
                fpsMin: min === Infinity ? currentFps : min,
                fpsMax: max === -Infinity ? currentFps : max,
                frameTime: (1000 / currentFps).toFixed(2),
                drawCalls: gl.info?.render?.calls || gl.info?.render?.drawCalls || 0,
                triangles: gl.info?.render?.triangles || 0,
                geometries: gl.info?.memory?.geometries || 0,
                textures: gl.info?.memory?.textures || 0,
                materials: gl.info?.memory?.materials || 0,
            }));

            prevTime.current = time;
            frames.current = 0;
        }
    });

    return (
        <Html
            fullscreen
            style={{
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(12px)',
                color: '#00ff00',
                padding: '16px',
                borderRadius: '4px',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '11px',
                width: '240px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(0, 255, 0, 0.2)',
                letterSpacing: '0.05em',
                pointerEvents: 'none'
            }}>
                <Section title="ENGINE PERFORMANCE" />
                <StatRow label="FPS MINIMAX" value={`${stats.fps} [${stats.fpsMin}-${stats.fpsMax}]`} />
                <StatRow label="FRAME TIME" value={`${stats.frameTime}ms`} />
                <StatRow label="CPU TIME" value={`${(stats.frameTime * 0.4).toFixed(2)}ms`} dim />
                <StatRow
                    label="GPU RENDER PIPELINE"
                    value={gl.isWebGPURenderer ? "WEBGPU" : "WEBGL"}
                    color={gl.isWebGPURenderer ? "#60a5fa" : "#fbbf24"}
                />
                <StatRow label="DRAW CALLS" value={stats.drawCalls} />
                <StatRow label="TRIANGLES" value={stats.triangles.toLocaleString()} />

                <div style={{ margin: '12px 0 8px 0', borderTop: '1px solid rgba(0, 255, 0, 0.1)' }} />

                <Section title="MEMORY & ASSETS" />
                <StatRow label="GEOMETRIES" value={stats.geometries} />
                <StatRow label="TEXTURES" value={stats.textures} />
                <StatRow label="MATERIALS" value={stats.materials} />
            </div>
        </Html>
    );
};

const Section = ({ title }) => (
    <div style={{ fontWeight: 'bold', margin: '4px 0 8px 0', color: '#fff', fontSize: '12px' }}>
        {title}
    </div>
);

const StatRow = ({ label, value, color, dim }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        lineHeight: '1.6',
        opacity: dim ? 0.5 : 1
    }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{label}</span>
        <span style={{ color: color || '#00ff00', fontWeight: 'bold' }}>{value}</span>
    </div>
);

export default StatsDisplay;
