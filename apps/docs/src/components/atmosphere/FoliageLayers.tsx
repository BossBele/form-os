import React from 'react';

export interface FoliageLayersProps {
  depth?: 3 | 4;
}

/**
 * Rolling crown silhouettes, hand-authored so the tree-line reads as a forest
 * rather than a mountain range. Ordered back to front: each successive layer is
 * darker, sharper and further forward, and drifts faster under parallax.
 */
const CANOPY_PATHS = [
  'M0,300 C70,232 130,268 196,214 C258,164 320,228 384,186 C446,146 508,220 570,178 C632,138 694,208 756,172 C818,138 880,204 942,168 C1004,134 1066,200 1128,164 C1190,130 1252,196 1314,168 C1376,142 1432,198 1440,178 L1440,320 L0,320 Z',
  'M0,320 C60,258 122,292 186,246 C250,200 312,258 376,222 C440,186 502,252 566,216 C630,180 692,246 756,212 C820,178 882,244 946,210 C1010,176 1072,240 1136,206 C1200,172 1262,236 1326,208 C1388,182 1434,232 1440,216 L1440,320 L0,320 Z',
  'M0,320 C48,282 104,306 162,272 C220,238 278,282 336,254 C394,226 452,276 510,248 C568,220 626,270 684,244 C742,218 800,266 858,242 C916,218 974,264 1032,240 C1090,216 1148,262 1206,240 C1264,218 1322,260 1380,242 L1440,320 Z',
  'M0,320 C40,300 88,314 138,292 C188,270 236,306 288,288 C340,270 388,302 440,286 C492,270 540,300 592,286 C644,272 692,300 744,288 C796,276 844,302 896,290 C948,278 996,302 1048,292 C1100,282 1148,304 1200,294 C1252,284 1300,304 1352,296 C1404,288 1432,302 1440,300 L1440,320 L0,320 Z',
];

const LAYER_STYLE = [
  { fill: 'rgb(var(--amethyst) / 0.55)', blur: 6, drift: 0.06, opacity: 0.7 },
  { fill: 'rgb(var(--fern) / 0.62)', blur: 3, drift: 0.12, opacity: 0.82 },
  { fill: 'rgb(var(--moss) / 0.9)', blur: 1, drift: 0.2, opacity: 0.95 },
  { fill: 'rgb(var(--bark) / 0.96)', blur: 0, drift: 0.3, opacity: 1 },
];

export function FoliageLayers({ depth = 3 }: FoliageLayersProps) {
  const layers = CANOPY_PATHS.slice(0, depth);

  return (
    <div className="absolute inset-x-0 bottom-0 h-[62vh] min-h-[320px]">
      {layers.map((path, index) => {
        const style = LAYER_STYLE[index] ?? LAYER_STYLE[LAYER_STYLE.length - 1];
        return (
          <div
            key={index}
            data-foliage-layer
            className="absolute inset-x-0 bottom-0 h-full will-change-transform"
            style={{
              transform: `translate3d(0, calc(var(--forest-scroll, 0px) * ${style.drift}), 0)`,
              opacity: style.opacity,
            }}
          >
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              className="h-full w-full"
              style={{ filter: style.blur ? `blur(${style.blur}px)` : undefined }}
              aria-hidden="true"
            >
              <path d={path} fill={style.fill} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
