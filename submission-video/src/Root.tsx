import { Composition } from "remotion";

import { EqualTraceEvidenceCut } from "./EqualTraceEvidenceCut";
import { EqualTraceLaunch } from "./EqualTraceLaunch";

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
  </>
);
