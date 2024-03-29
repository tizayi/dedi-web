import * as mathjs from "mathjs";
import detectorDataRecord from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import {
  BeamlineConfig,
  Beamstop,
  CircularDevice,
  Detector,
  SimpleVector2,
} from "../utils/types";

// todo consider migrating away from wildcard imports
// not too high priority,
// and makes sense to migrate only if not too difficult
// eslint-disable-next-line max-len
// https://stackoverflow.com/questions/42051588/wildcard-or-asterisk-vs-named-or-selective-import-es6-javascript

export interface AppDataFormat extends BeamlineConfig {
  detector: string;
  beamstop: Beamstop;
  cameraTube: CircularDevice;
  // todo use OOP composition over inheritance
  // https://en.wikipedia.org/wiki/Composition_over_inheritance
  // beamlineConfig: BeamlineConfig;
}

interface DetectorData {
  readonly resolution: { height: number; width: number };
  readonly pixelSize: { height: number; width: number };
}

interface CircularDeviceData {
  readonly centre: SimpleVector2;
  readonly diameter: number;
}

export interface BeamlineData {
  readonly angle: number | null;
  readonly cameraLength: number | null;
  readonly minWavelength: number;
  readonly maxWavelength: number;
  readonly minCameraLength: number;
  readonly maxCameraLength: number;
  readonly wavelength: number | null;
  readonly cameraLengthStep: number;
}

interface BeamstopData extends CircularDeviceData {
  readonly clearance: number | null;
}

export interface AppData extends BeamlineData {
  readonly detector: string;
  readonly beamstop: BeamstopData;
  readonly cameraTube: CircularDeviceData;
}

export const detectorList: Record<string, Detector> = Object.fromEntries(
  Object.entries(detectorDataRecord as Record<string, DetectorData>).map(
    ([key, value]) => [
      key,
      {
        ...value,
        pixelSize: {
          height: mathjs.unit(value.pixelSize.height, "mm"),
          width: mathjs.unit(value.pixelSize.height, "mm"),
        },
      },
    ],
  ),
);

export const presetList: Record<string, AppDataFormat> = Object.fromEntries(
  Object.entries(presetData as Record<string, AppData>).map(([key, value]) => [
    key,
    {
      ...value,
      beamstop: {
        ...value.beamstop,
        diameter: mathjs.unit(value.beamstop.diameter, "mm"),
      },
      cameraTube: {
        ...value.cameraTube,
        diameter: mathjs.unit(value.cameraTube.diameter, "mm"),
      },
      minWavelength: mathjs.unit(value.minWavelength, "nm"),
      maxWavelength: mathjs.unit(value.maxWavelength, "nm"),
      minCameraLength: mathjs.unit(value.minCameraLength, "m"),
      maxCameraLength: mathjs.unit(value.maxCameraLength, "m"),
      cameraLengthStep: mathjs.unit(value.cameraLengthStep, "m"),

      wavelength: mathjs.unit(value.wavelength ?? NaN, "nm"),
      angle: mathjs.unit(value.angle ?? NaN, "deg"),
    },
  ]),
);
export const defaultConfig = presetList[Object.keys(presetList)[0]];
