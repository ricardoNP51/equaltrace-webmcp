import { Composition } from "remotion";

import { EqualTraceLaunch } from "./EqualTraceLaunch";

export const RemotionRoot = () => (
  <Composition
    id="EqualTraceLaunch"
    component={EqualTraceLaunch}
    durationInFrames={4500}
    fps={30}
    width={1920}
    height={1080}
  />
);
