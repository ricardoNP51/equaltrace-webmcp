import { Composition } from "remotion";

import { EqualTraceB3, EqualTraceEvidenceCut } from "./EqualTraceEvidenceCut";
import { EqualTraceLaunch } from "./EqualTraceLaunch";
import {
  EqualTraceLiveFinal,
  LIVE_FINAL_DURATION,
  LIVE_FINAL_FPS,
} from "./EqualTraceLiveFinal";

export const RemotionRoot = () => (
  <>
    <Composition
      id="EqualTraceLaunch"
      component={EqualTraceLaunch}
      durationInFrames={4500}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EqualTraceEvidenceCut"
      component={EqualTraceEvidenceCut}
      durationInFrames={3420}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EqualTraceB3"
      component={EqualTraceB3}
      durationInFrames={2910}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EqualTraceLiveFinal"
      component={EqualTraceLiveFinal}
      durationInFrames={LIVE_FINAL_DURATION}
      fps={LIVE_FINAL_FPS}
      width={1920}
      height={1080}
    />
  </>
);
