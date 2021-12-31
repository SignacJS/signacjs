import Seq from "./sequences";
import supportsColor from "supports-color";
import { color } from "../styles/types";

// TODO add multiple levels of color

function stringLiterals<T extends string>(...args: T[]): T[] {
  return args;
}
type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

const colors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
];

const mkColorSeq =
  (offset: number) =>
  (color: color = "initial") => {
    if (color === "initial") return { csi: true, str: `${offset + 9}m` };
    if (Array.isArray(color))
      return { csi: true, str: `${offset + 8};2;${color.join(";")}m` };
    const colorIndex = colors.indexOf(color);
    return { csi: true, str: `${offset + colorIndex}m` };
  };

const colorSeq = mkColorSeq(30);
const bgColorSeq = mkColorSeq(40);

// https://stackoverflow.com/a/6969486
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const mkProcessStr =
  (fn: (color?: color) => string) => (text: string, color?: color) => {
    return text
      .split("\n")
      .map((line) => {
        const wantedColorSeq = fn(color);
        const end = fn();
        return `${wantedColorSeq}${line.replaceAll(
          end,
          wantedColorSeq
        )}${end}`.replace(
          RegExp(`${escapeRegExp(end)}(.*)${escapeRegExp(end)}`, "g"),
          "$1"
        );
      })
      .join("\n");
  };

const colorProcessStr = mkProcessStr((color?: color) =>
  Seq.escape(colorSeq(color))
);
const bgColorProcessStr = mkProcessStr((color?: color) =>
  Seq.escape(bgColorSeq(color))
);

export { colorSeq, bgColorSeq, colorProcessStr, bgColorProcessStr };
