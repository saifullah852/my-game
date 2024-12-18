import { useEffect, useRef, useState } from "react";


const Game = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Game constants
  const canvasWidth = 600;
  const canvasHeight = 600;
  const playerWidth = 50;
  const playerHeight = 50;
  const playerSpeed = 100;
  
  const obstacleWidth = 50;
  const obstacleHeight = 50;
  const obstacleSpeed = 10;

  let playerX = canvasWidth / 5 - playerWidth / 2;
  let playerY = canvasHeight - playerHeight - 20;

  let obstacles: { x: number; y: number; }[] = [];
  let gameInterval: string | number | NodeJS.Timeout | undefined;
  let obstacleInterval: string | number | NodeJS.Timeout | undefined;

  // Handle game over
  const endGame = () => {
    setGameOver(true);
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
  };

  // Handle player movement
  const movePlayer = (key: string) => {
    if (key === "ArrowLeft" && playerX > 0) {
      playerX -= playerSpeed;
    }
    if (key === "ArrowRight" && playerX < canvasWidth - playerWidth) {
      playerX += playerSpeed;
    }
  };

  // Handle game loop
  const gameLoop = () => {
    if (!gameOver) {
      setScore((prevScore) => prevScore + 1);

      // Clear canvas and draw player and obstacles
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "blue";
      ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

      // Draw obstacles
      obstacles.forEach((obstacle, index) => {
        ctx.fillStyle = "red";
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);

        obstacle.y += obstacleSpeed;

        // Check for collision
        if (
          playerX < obstacle.x + obstacleWidth &&
          playerX + playerWidth > obstacle.x &&
          playerY < obstacle.y + obstacleHeight &&
          playerY + playerHeight > obstacle.y
        ) {
          endGame();
        }

        // Remove obstacles that pass the bottom
        if (obstacle.y > canvasHeight) {
          obstacles.splice(index, 1);
        }
      });
    }
  };

  // Generate obstacles at random positions
  const generateObstacle = () => {
    const x = Math.random() * (canvasWidth - obstacleWidth);
    const y = -obstacleHeight;
    obstacles.push({ x, y });
  };

  // Start game intervals
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    obstacleInterval = setInterval(generateObstacle, 2000); // New obstacle every 2 seconds

    // Handle keyboard events for movement
    const handleKeyDown = (event: { key: string; }) => {
      if (!gameOver) {
        movePlayer(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
      clearInterval(obstacleInterval);
    };
  }, [gameOver]);

  return (
    <div className="items-center justify-center">
      <h1>Subway Surfer Clone</h1>
      <h2>Score: {score}</h2>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "2px solid black" }}
      />
      {gameOver && <h2>Game Over</h2>}
    </div>
  );
};

export default Game;
