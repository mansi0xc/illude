export default function RotatingCards() {
  const cards = [
    { index: 0, color: "52, 211, 153" }, // emerald-400
    { index: 1, color: "16, 185, 129" }, // emerald-500  
    { index: 2, color: "5, 150, 105" },  // emerald-600
    { index: 3, color: "4, 120, 87" },   // emerald-700
    { index: 4, color: "6, 95, 70" },    // emerald-800
    { index: 5, color: "6, 78, 59" },    // emerald-900
    { index: 6, color: "34, 197, 94" },  // green-500
    { index: 7, color: "21, 128, 61" },  // green-700
    { index: 8, color: "22, 163, 74" },  // green-600
    { index: 9, color: "74, 222, 128" }, // green-400
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
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
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
          backdrop-filter: blur(4px);
        }

        .rotating-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rotating-card::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: card-sparkle 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="rotating-cards-wrapper">
        <div className="rotating-cards-inner">
          {cards.map((card) => (
            <div
              key={card.index}
              className="rotating-card"
              style={{
                border: `2px solid rgba(${card.color}, 0.6)`,
                transform: `rotateY(${(360 / 10) * card.index}deg) translateZ(250px)`,
              }}
            >
              <div 
                className="rotating-card-img"
                style={{
                  background: `transparent radial-gradient(circle, rgba(${card.color}, 0.2) 0%, rgba(${card.color}, 0.4) 50%, rgba(${card.color}, 0.6) 80%, rgba(${card.color}, 0.8) 100%)`
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
} 