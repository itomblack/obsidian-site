import React from "react";
import "./BackgroundFX.scss";

/**
 * Fixed, pointer-events:none layer that renders 3 blurred "blobs".
 * They slowly drift to mimic film light leaks / moving spotlights.
 * Place <BackgroundFX/> once near the top of your App so it sits
 * behind all content.
 */
export default function BackgroundFX() {
  return (
    <div className="bgfx" aria-hidden="true">
      <div className="bgfx__blob bgfx__blob--left" />
      <div className="bgfx__blob bgfx__blob--right" />
      <div className="bgfx__vignette" />
    </div>
  );
}