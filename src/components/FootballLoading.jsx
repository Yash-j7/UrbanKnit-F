import React, { useState, useEffect } from 'react';
import MessiRonaldoImage from '../assets/messi-ronaldo.png';

const quotes = [
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do. - Pelé",
  "Every champion was once a contender that refused to give up. - Rocky Balboa",
  "The more difficult the victory, the greater the happiness in winning. - Pelé",
  "Talent without hard work is nothing. - Cristiano Ronaldo",
  "I learn all the time from my mistakes. - Lionel Messi",
  "Football is a simple game: 22 men chase a ball for 90 minutes and at the end, the Germans always win. - Gary Lineker",
  "You have to fight to reach your dream. You have to sacrifice and work hard for it. - Lionel Messi"
];

const FootballLoading = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [searchProgress, setSearchProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setFadeClass('fade-out');
      
      setTimeout(() => {
        const nextIndex = (quoteIndex + 1) % quotes.length;
        setQuoteIndex(nextIndex);
        setCurrentQuote(quotes[nextIndex]);
        setFadeClass('fade-in');
      }, 300);
    }, 4000);

    const progressInterval = setInterval(() => {
      setSearchProgress(prevProgress => {
        const newProgress = prevProgress + 8;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 600);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [quoteIndex]);

  return (
    <div className="football-loading-container">
      <style jsx>{`
        .football-loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #333;
          padding: 1rem;
          box-sizing: border-box;
          position: relative;
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 800px;
          width: 100%;
          padding: 1rem;
        }

        .football-animation-area {
          position: relative;
          width: 100%;
          max-width: 300px;
          aspect-ratio: 1;
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .football-legends-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .loading-text {
          font-size: clamp(1.1rem, 4vw, 1.5rem);
          font-weight: 600;
          margin: 1rem 0;
          text-align: center;
          color: #2193b0;
          padding: 0 1rem;
        }

        .progress-section {
          width: 100%;
          max-width: 500px;
          margin: 1.5rem 0;
          padding: 0 1rem;
        }

        .progress-bar-container {
          width: 100%;
          background: #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-bar {
          height: clamp(16px, 4vw, 24px);
          background: linear-gradient(90deg, #2193b0, #6dd5ed);
          width: 0%;
          border-radius: 12px;
          transition: width 0.5s ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .quote-section {
          margin-top: 2rem;
          width: 100%;
          max-width: 700px;
          padding: 0 1rem;
        }

        .quote-text {
          font-size: clamp(0.9rem, 3vw, 1.2rem);
          font-style: italic;
          text-align: center;
          line-height: 1.6;
          color: #444;
          background: #f8f9fa;
          border-radius: 16px;
          padding: clamp(1rem, 4vw, 1.5rem);
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .quote-text.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .quote-text.fade-out {
          opacity: 0;
          transform: translateY(10px);
        }

        .loading-dots {
          display: inline-flex;
          margin-left: 0.5rem;
        }

        .dot {
          width: clamp(6px, 2vw, 8px);
          height: clamp(6px, 2vw, 8px);
          border-radius: 50%;
          background: #2193b0;
          margin: 0 2px;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        @media (max-width: 640px) {
          .football-loading-container {
            padding: 0.5rem;
          }

          .content-wrapper {
            padding: 0.5rem;
          }

          .football-animation-area {
            margin-bottom: 1.5rem;
          }

          .progress-section {
            margin: 1rem 0;
          }

          .quote-section {
            margin-top: 1.5rem;
          }
        }
      `}</style>

      <div className="content-wrapper">
        <div className="football-animation-area">
          <img 
            src={MessiRonaldoImage}
            alt="Messi and Ronaldo" 
            className="football-legends-image" 
          />
        </div>

        <p className="loading-text">
          Loading amazing football products
          <span className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </p>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${searchProgress}%` }}></div>
          </div>
        </div>

        <div className="quote-section">
          <p className={`quote-text ${fadeClass}`}>
            "{currentQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default FootballLoading;