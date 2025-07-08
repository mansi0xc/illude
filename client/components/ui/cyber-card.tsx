"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CyberCardProps extends React.ComponentProps<"div"> {
  title?: string
  subtitle?: string
  variant?: "feature" | "story" | "character" | "testimonial" | "default"
  children: React.ReactNode
}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, children, title, subtitle, variant = "default", ...props }, ref) => {
    const getVariantColors = () => {
      switch (variant) {
        case "feature":
          return {
            primary: "0, 255, 170", // #00ffaa
            secondary: "0, 162, 255", // #00a2ff
            accent: "92, 103, 255" // #5c67ff
          }
        case "story":
          return {
            primary: "147, 51, 234", // purple
            secondary: "236, 72, 153", // pink
            accent: "59, 130, 246" // blue
          }
        case "character":
          return {
            primary: "168, 85, 247", // purple
            secondary: "244, 63, 94", // rose
            accent: "139, 92, 246" // violet
          }
        case "testimonial":
          return {
            primary: "34, 211, 153", // emerald
            secondary: "251, 191, 36", // amber
            accent: "34, 197, 94" // green
          }
        default:
          return {
            primary: "0, 255, 170", // #00ffaa
            secondary: "0, 162, 255", // #00a2ff
            accent: "92, 103, 255" // #5c67ff
          }
      }
    }

    const colors = getVariantColors()

    return (
      <div 
        className={cn("cyber-container noselect", className)} 
        ref={ref} 
        {...props}
        style={{
          "--primary-color": colors.primary,
          "--secondary-color": colors.secondary,
          "--accent-color": colors.accent,
        } as React.CSSProperties}
      >
        <div className="cyber-canvas">
          {/* 25 tracker grid */}
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className={`cyber-tracker cyber-tr-${i + 1}`}></div>
          ))}
          
          <div className="cyber-card" id="cyber-card">
            <div className="cyber-card-content">
              <div className="cyber-card-glare"></div>
              
              <div className="cyber-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              {title && (
                <div className="cyber-title">{title}</div>
              )}
              
              <div className="cyber-content-wrapper">
                {children}
              </div>

              <div className="cyber-glowing-elements">
                <div className="cyber-glow-1"></div>
                <div className="cyber-glow-2"></div>
                <div className="cyber-glow-3"></div>
              </div>

              {subtitle && (
                <div className="cyber-subtitle">
                  <span>{subtitle}</span>
                </div>
              )}

              <div className="cyber-card-particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="cyber-corner-elements">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="cyber-scan-line"></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .cyber-container {
            position: relative;
            width: 100%;
            min-height: 300px;
            transition: 200ms;
          }

          .cyber-container:active {
            transform: scale(0.98);
          }

          .cyber-card {
            position: absolute;
            inset: 0;
            z-index: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
            transition: 700ms;
            background: linear-gradient(45deg, #1a1a1a, #262626);
            border: 2px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            box-shadow:
              0 0 20px rgba(0, 0, 0, 0.3),
              inset 0 0 20px rgba(0, 0, 0, 0.2);
          }

          .cyber-card-content {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
          }

          .cyber-content-wrapper {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
          }

          .cyber-title {
            opacity: 0;
            transition: 300ms ease-in-out;
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 3px;
            text-align: center;
            background: linear-gradient(45deg, rgba(var(--primary-color), 1), rgba(var(--secondary-color), 1));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 15px rgba(var(--primary-color), 0.5));
            text-shadow:
              0 0 10px rgba(var(--accent-color), 0.5),
              0 0 20px rgba(var(--accent-color), 0.3);
            pointer-events: none;
          }

          .cyber-subtitle {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(30px);
            z-index: 20;
            width: 100%;
            text-align: center;
            font-size: 11px;
            letter-spacing: 2px;
            color: rgba(var(--primary-color), 0.8);
            transition: 300ms ease-in-out;
            opacity: 0;
            pointer-events: none;
          }

          .cyber-glowing-elements {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
          }

          .cyber-glow-1,
          .cyber-glow-2,
          .cyber-glow-3 {
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(
              circle at center,
              rgba(var(--primary-color), 0.4) 0%,
              rgba(var(--primary-color), 0.2) 50%,
              rgba(var(--primary-color), 0) 70%
            );
            filter: blur(20px);
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .cyber-glow-1 {
            top: -30px;
            left: -30px;
          }

          .cyber-glow-2 {
            top: 50%;
            right: -30px;
            transform: translateY(-50%);
          }

          .cyber-glow-3 {
            bottom: -30px;
            left: 30%;
          }

          .cyber-card-particles span {
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(var(--primary-color), 1);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 15;
          }

          .cyber-card-particles span:nth-child(1) {
            top: 40%;
            left: 20%;
          }
          
          .cyber-card-particles span:nth-child(2) {
            top: 60%;
            right: 20%;
          }
          
          .cyber-card-particles span:nth-child(3) {
            top: 20%;
            left: 40%;
          }
          
          .cyber-card-particles span:nth-child(4) {
            top: 80%;
            right: 40%;
          }
          
          .cyber-card-particles span:nth-child(5) {
            top: 30%;
            left: 60%;
          }
          
          .cyber-card-particles span:nth-child(6) {
            top: 70%;
            right: 60%;
          }

          .cyber-card::before {
            content: "";
            background: radial-gradient(
              circle at center,
              rgba(var(--primary-color), 0.15) 0%,
              rgba(var(--secondary-color), 0.08) 50%,
              transparent 100%
            );
            filter: blur(25px);
            opacity: 0;
            width: 120%;
            height: 120%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.4s ease;
            z-index: -1;
          }

          .cyber-canvas {
            perspective: 1000px;
            inset: 0;
            z-index: 200;
            position: absolute;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(5, 1fr);
            gap: 0;
          }

          .cyber-tracker {
            position: relative;
            z-index: 200;
            cursor: pointer;
          }

          .cyber-card-glare {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              125deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.05) 45%,
              rgba(255, 255, 255, 0.1) 50%,
              rgba(255, 255, 255, 0.05) 55%,
              rgba(255, 255, 255, 0) 100%
            );
            opacity: 0;
            transition: opacity 300ms;
            z-index: 5;
            pointer-events: none;
          }

          .cyber-lines span {
            position: absolute;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(var(--accent-color), 0.6),
              transparent
            );
            z-index: 2;
            pointer-events: none;
          }

          .cyber-lines span:nth-child(1) {
            top: 20%;
            left: 0;
            width: 100%;
            height: 1px;
            transform: scaleX(0);
            transform-origin: left;
            animation: cyber-lineGrow 4s linear infinite;
          }

          .cyber-lines span:nth-child(2) {
            top: 40%;
            right: 0;
            width: 100%;
            height: 1px;
            transform: scaleX(0);
            transform-origin: right;
            animation: cyber-lineGrow 4s linear infinite 1s;
          }

          .cyber-lines span:nth-child(3) {
            top: 60%;
            left: 0;
            width: 100%;
            height: 1px;
            transform: scaleX(0);
            transform-origin: left;
            animation: cyber-lineGrow 4s linear infinite 2s;
          }

          .cyber-lines span:nth-child(4) {
            top: 80%;
            right: 0;
            width: 100%;
            height: 1px;
            transform: scaleX(0);
            transform-origin: right;
            animation: cyber-lineGrow 4s linear infinite 1.5s;
          }

          .cyber-corner-elements span {
            position: absolute;
            width: 15px;
            height: 15px;
            border: 2px solid rgba(var(--accent-color), 0.4);
            transition: all 0.3s ease;
            z-index: 3;
            pointer-events: none;
          }

          .cyber-corner-elements span:nth-child(1) {
            top: 12px;
            left: 12px;
            border-right: 0;
            border-bottom: 0;
          }

          .cyber-corner-elements span:nth-child(2) {
            top: 12px;
            right: 12px;
            border-left: 0;
            border-bottom: 0;
          }

          .cyber-corner-elements span:nth-child(3) {
            bottom: 12px;
            left: 12px;
            border-right: 0;
            border-top: 0;
          }

          .cyber-corner-elements span:nth-child(4) {
            bottom: 12px;
            right: 12px;
            border-left: 0;
            border-top: 0;
          }

          .cyber-scan-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(var(--accent-color), 0.8),
              transparent
            );
            transform: translateY(-100%);
            animation: cyber-scanMove 3s linear infinite;
            z-index: 4;
            pointer-events: none;
          }

          @keyframes cyber-lineGrow {
            0%, 70% {
              transform: scaleX(0);
              opacity: 0;
            }
            85% {
              transform: scaleX(1);
              opacity: 1;
            }
            100% {
              transform: scaleX(0);
              opacity: 0;
            }
          }

          @keyframes cyber-scanMove {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(calc(100% + 300px));
            }
          }

          @keyframes cyber-particleFloat {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            50% {
              opacity: 1;
              transform: translate(var(--float-x, 10px), var(--float-y, -10px)) scale(1.5);
            }
            100% {
              transform: translate(calc(var(--float-x, 10px) * 2), calc(var(--float-y, -10px) * 2)) scale(0.5);
              opacity: 0;
            }
          }

          /* Particle custom properties */
          .cyber-card-particles span:nth-child(1) { --float-x: 20px; --float-y: -20px; }
          .cyber-card-particles span:nth-child(2) { --float-x: -20px; --float-y: -15px; }
          .cyber-card-particles span:nth-child(3) { --float-x: 15px; --float-y: 20px; }
          .cyber-card-particles span:nth-child(4) { --float-x: -15px; --float-y: 20px; }
          .cyber-card-particles span:nth-child(5) { --float-x: 25px; --float-y: 5px; }
          .cyber-card-particles span:nth-child(6) { --float-x: -25px; --float-y: 10px; }

          /* 3D Transform Effects for each tracker */
          .cyber-tr-1:hover ~ .cyber-card { transform: rotateX(20deg) rotateY(-10deg); }
          .cyber-tr-2:hover ~ .cyber-card { transform: rotateX(20deg) rotateY(-5deg); }
          .cyber-tr-3:hover ~ .cyber-card { transform: rotateX(20deg) rotateY(0deg); }
          .cyber-tr-4:hover ~ .cyber-card { transform: rotateX(20deg) rotateY(5deg); }
          .cyber-tr-5:hover ~ .cyber-card { transform: rotateX(20deg) rotateY(10deg); }
          .cyber-tr-6:hover ~ .cyber-card { transform: rotateX(10deg) rotateY(-10deg); }
          .cyber-tr-7:hover ~ .cyber-card { transform: rotateX(10deg) rotateY(-5deg); }
          .cyber-tr-8:hover ~ .cyber-card { transform: rotateX(10deg) rotateY(0deg); }
          .cyber-tr-9:hover ~ .cyber-card { transform: rotateX(10deg) rotateY(5deg); }
          .cyber-tr-10:hover ~ .cyber-card { transform: rotateX(10deg) rotateY(10deg); }
          .cyber-tr-11:hover ~ .cyber-card { transform: rotateX(0deg) rotateY(-10deg); }
          .cyber-tr-12:hover ~ .cyber-card { transform: rotateX(0deg) rotateY(-5deg); }
          .cyber-tr-13:hover ~ .cyber-card { transform: rotateX(0deg) rotateY(0deg); }
          .cyber-tr-14:hover ~ .cyber-card { transform: rotateX(0deg) rotateY(5deg); }
          .cyber-tr-15:hover ~ .cyber-card { transform: rotateX(0deg) rotateY(10deg); }
          .cyber-tr-16:hover ~ .cyber-card { transform: rotateX(-10deg) rotateY(-10deg); }
          .cyber-tr-17:hover ~ .cyber-card { transform: rotateX(-10deg) rotateY(-5deg); }
          .cyber-tr-18:hover ~ .cyber-card { transform: rotateX(-10deg) rotateY(0deg); }
          .cyber-tr-19:hover ~ .cyber-card { transform: rotateX(-10deg) rotateY(5deg); }
          .cyber-tr-20:hover ~ .cyber-card { transform: rotateX(-10deg) rotateY(10deg); }
          .cyber-tr-21:hover ~ .cyber-card { transform: rotateX(-20deg) rotateY(-10deg); }
          .cyber-tr-22:hover ~ .cyber-card { transform: rotateX(-20deg) rotateY(-5deg); }
          .cyber-tr-23:hover ~ .cyber-card { transform: rotateX(-20deg) rotateY(0deg); }
          .cyber-tr-24:hover ~ .cyber-card { transform: rotateX(-20deg) rotateY(5deg); }
          .cyber-tr-25:hover ~ .cyber-card { transform: rotateX(-20deg) rotateY(10deg); }

          /* Hover Effects */
          .cyber-tracker:hover ~ .cyber-card {
            transition: 125ms ease-in-out;
            filter: brightness(1.2);
          }

          .cyber-tracker:hover ~ .cyber-card .cyber-title {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
          }

          .cyber-tracker:hover ~ .cyber-card .cyber-subtitle {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px);
          }

          .cyber-tracker:hover ~ .cyber-card .cyber-glowing-elements div {
            opacity: 1;
          }

          .cyber-tracker:hover ~ .cyber-card .cyber-card-particles span {
            opacity: 1;
            animation: cyber-particleFloat 2s ease-in-out infinite;
          }

          .cyber-tracker:hover ~ .cyber-card .cyber-corner-elements span {
            border-color: rgba(var(--accent-color), 0.9);
            box-shadow: 0 0 15px rgba(var(--accent-color), 0.6);
          }

          .cyber-tracker:hover ~ .cyber-card .cyber-card-glare {
            opacity: 1;
          }

          .cyber-tracker:hover ~ .cyber-card::before {
            opacity: 1;
          }

          .noselect {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}</style>
      </div>
    )
  }
)
CyberCard.displayName = "CyberCard"

export { CyberCard } 