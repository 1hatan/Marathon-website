import React from "react";
import "./RunningMan.css";

export default function RunningMan() {
  const runnerGifUrl = "https://cdn.dribbble.com/userupload/31065878/file/original-1e2e07e72337c89c353eb7667071a32a.gif";

  return (
    <div className="runner-gif-container">
      <div className="runner-gif-crop">
        <img
          src={runnerGifUrl}
          alt="Animated Running Man"
          className="runner-gif-img"
        />
      </div>
      {/* Ground Glow Shadow */}
      <div className="runner-gif-shadow" />
    </div>
  );
}
