export default function RotatingCards() {
  const cards = [
    { index: 0, color: "142, 249, 252" }, // Bright cyan
    { index: 1, color: "142, 252, 204" }, // Mint green
    { index: 2, color: "142, 252, 157" }, // Light green
    { index: 3, color: "215, 252, 142" }, // Lime yellow
    { index: 4, color: "252, 252, 142" }, // Bright yellow
    { index: 5, color: "252, 208, 142" }, // Orange yellow
    { index: 6, color: "252, 142, 142" }, // Coral red
    { index: 7, color: "252, 142, 239" }, // Hot pink
    { index: 8, color: "204, 142, 252" }, // Light purple
    { index: 9, color: "142, 202, 252" }, // Sky blue
  ]

  return (
    <>
      <style>{`
        @keyframes rotating-cards {
          from {
            transform: perspective(1000px) rotateX(-15deg) rotateY(0);
          }
          to {
            transform: perspective(1000px) rotateX(-15deg) rotateY(360deg);
          }
        }

        @keyframes card-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(var(--card-color), 0.3); }
          50% { box-shadow: 0 0 20px rgba(var(--card-color), 0.6), 0 0 30px rgba(var(--card-color), 0.4); }
        }

        .rotating-cards-wrapper {
          width: 100%;
          height: 300px;
          position: relative;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .rotating-cards-inner {
          position: absolute;
          width: 100px;
          height: 150px;
          top: 25%;
          left: calc(50% - 52.5px);
          z-index: 2;
          transform-style: preserve-3d;
          animation: rotating-cards 20s linear infinite;
        }

        .rotating-cards-wrapper:hover .rotating-cards-inner {
          animation-play-state: paused;
        }

                  .rotating-card {
            position: absolute;
            border-radius: 12px;
            overflow: hidden;
            inset: 0;
            backdrop-filter: blur(8px);
            animation: card-glow 3s ease-in-out infinite;
          }

          .rotating-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: relative;
          }

          .rotating-card::before {
            content: '';
            position: absolute;
            top: 5%;
            left: 5%;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            animation: card-sparkle 2s ease-in-out infinite;
            z-index: 10;
          }

          .rotating-card::after {
            content: '';
            position: absolute;
            top: 15%;
            right: 15%;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            animation: card-sparkle 2.5s ease-in-out infinite reverse;
            z-index: 10;
          }
      `}</style>
      
      <div className="rotating-cards-wrapper">
        <div className="rotating-cards-inner">
          {cards.map((card) => (
                          <div
                key={card.index}
                className="rotating-card"
                style={{
                  border: `2px solid rgba(${card.color}, 0.8)`,
                  transform: `rotateY(${(360 / 10) * card.index}deg) translateZ(250px)`,
                  '--card-color': card.color,
                } as React.CSSProperties}
              >
                               <div 
                   className="rotating-card-img"
                   style={{
                     background: `transparent radial-gradient(circle, rgba(${card.color}, 0.1) 0%, rgba(${card.color}, 0.3) 30%, rgba(${card.color}, 0.5) 60%, rgba(${card.color}, 0.7) 80%, rgba(${card.color}, 0.9) 100%)`
                   }}
                 ></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
} 