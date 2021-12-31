export type Orientation = "top" | "bottom" | "left" | "right";

export type orientationPossibilities = "bold";

export interface PipeConfigOrient {
  orientation: Partial<Record<Orientation, boolean | orientationPossibilities>>;
  rounded?: false;
  double?: false;
}

export interface PipeConfigDouble {
  orientation: Partial<Record<Orientation, boolean>>;
  double: "horizontal" | "vertical";
  rounded?: false;
}

export interface PipeConfigRounded {
  orientation: Partial<Record<Orientation, boolean>>;
  rounded: true;
  double?: false;
}

export type PipeConfig =
  | PipeConfigOrient
  | PipeConfigDouble
  | PipeConfigRounded;

// Shamelessly stolen from https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// https://stackoverflow.com/a/53229857
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type Not<T, U> = T extends U ? never : T;
