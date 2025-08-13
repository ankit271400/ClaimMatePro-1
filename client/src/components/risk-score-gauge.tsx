import { useEffect, useRef } from "react";

interface RiskScoreGaugeProps {
  score: number; // 0-100
  level: string; // low, medium, high
}

export default function RiskScoreGauge({ score, level }: RiskScoreGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;
    const lineWidth = 12;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.25 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Get color based on score
    const getColor = (score: number) => {
      if (score < 30) return '#10b981'; // green
      if (score < 70) return '#f59e0b'; // orange/yellow
      return '#ef4444'; // red
    };

    // Progress circle
    const angle = (score / 100) * 1.5 * Math.PI; // 1.5π is 270 degrees (3/4 circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.75 * Math.PI + angle);
    ctx.strokeStyle = getColor(score);
    ctx.stroke();

    // Score text
    ctx.font = 'bold 32px Inter';
    ctx.fillStyle = getColor(score);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((score / 10).toFixed(1), centerX, centerY);

  }, [score]);

  return (
    <div className="flex justify-center" data-testid="risk-score-gauge">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200} 
        className="max-w-full h-auto"
      />
    </div>
  );
}
