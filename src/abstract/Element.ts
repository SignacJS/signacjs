import {
  BaseStyle,
  DisplayBlock,
  size,
  unit,
  unitNoAdapt,
  unitScope,
  WoHPartial,
} from "../styles/types";
import { merge, pad3d } from "../utils";
import { colorProcessStr, bgColorProcessStr } from "../sequences/colors";
import TextNode from "./TextNode";
import PTAL from "../ptal";
import Cell, { CellLine, CellPlane, CellUnit } from "./Cell";
import { Not } from "../types";

type ElementStyle = BaseStyle & DisplayBlock;

interface RenderOptions {
  replacePercentWithContentW: boolean;
  replacePercentWithContentH: boolean;
  forceContentW: boolean;
  forceContentH: boolean;
  forceContentChildW: boolean;
  forceContentChildH: boolean;
}

type ElementRenderer = (
  previousRender: CellPlane,
  element: Element,
  renderOptions: Partial<RenderOptions>
) => CellPlane;

export interface ElementProps {
  style: Partial<ElementStyle>;
}

class Element {
  private styling: Partial<ElementStyle>;
  content: (Element | TextNode)[];
  props: ElementProps;
  parent?: Element;
  rootElement?: PTAL;
  context = {};
  constructor(
    content: (Element | TextNode)[],
    props: Partial<ElementProps> = {},
    rootElement?: PTAL
  ) {
    let currentElement = this;
    const fullProps: ElementProps = {
      style: {},
      ...props,
    };
    this.props = fullProps;
    this.styling = fullProps.style;
    this.content = content;
    this.rootElement = rootElement;
    this.style = new Proxy(Element.defaultStyling, {
      get(obj, prop: keyof ElementStyle) {
        const style = currentElement.styling[prop];
        if (style === "unset") {
          if (
            currentElement.parent &&
            Element.inheritedStyling.includes(prop)
          ) {
            return currentElement.parent.style[prop]; // wee down the proxy hole
          }
          return obj[prop];
        }
        if (style === "inherit") {
          if (currentElement.parent) {
            return currentElement.parent.style[prop]; // wee down the proxy hole
          }
          return obj[prop];
        }
        if (style === "initial") return obj[prop];
        return style || obj[prop];
      },
      set(obj, prop: keyof ElementStyle, value) {
        fullProps.style[prop] = value === "initial" ? null : value;
        return true;
      },
    });
  }

  static renderers: ElementRenderer[] = [
    (previousRender, el) => {
      // Render the content + add text color
      const cellPlaneArray: CellPlane[] = [];
      const content = el.content;
      for (let i = 0; i < content.length; i++) {
        const prevNode = content[i - 1];
        let currNode = content[i];

        if (!prevNode) {
          cellPlaneArray.push(currNode.toCellPlane());
          continue;
        }

        const nodeIsInline = (Node: Element | TextNode) =>
          Node instanceof TextNode || Node.style.display.startsWith("inline");
        if (nodeIsInline(prevNode) && nodeIsInline(currNode)) {
          cellPlaneArray[cellPlaneArray.length - 1] = merge(
            "X",
            cellPlaneArray[cellPlaneArray.length - 1],
            content[i].toCellPlane()
          );
          continue;
        }

        cellPlaneArray.push(currNode.toCellPlane());
      }
      return merge("Y", ...cellPlaneArray);
    },
    (previousRender, el, renderOptions) => {
      let width: number;
      let height: number;
      let undeterminable =
        el.style.width === "auto" && el.style.height === "auto";
      if (
        el.style.width === "content" ||
        undeterminable ||
        renderOptions.forceContentW
      ) {
        width = previousRender[0]?.length || 0;
      } else {
        width = el.width;
      }
      if (
        el.style.height === "content" ||
        undeterminable ||
        renderOptions.forceContentH
      ) {
        height = previousRender.length;
      } else {
        height = el.height;
      }
      return merge("Z", previousRender, new CellPlane(height, width, 1));
    },
    (previousRender, el) => {
      // Render the backgroundColor
      const bgColor = el.style.backgroundColor;
      if (bgColor === "transparent") return previousRender;
      return CellPlane.from(
        previousRender.map((cellLine: CellLine) => {
          return cellLine.map((cellUnit: CellUnit) => {
            const [firstCell, ...otherCells] = cellUnit;
            firstCell.attributes.backgroundColor = bgColor as Not<
              any,
              "inherit" | "unset"
            >;
            return [firstCell, ...otherCells];
          });
        })
      );
    },
  ];
  static defaultStyling: ElementStyle &
    Record<string, Not<any, "inherit" | "unset" | "initial">> = {
    display: "block",
    color: "initial", // TODO get default foreground
    backgroundColor: "transparent", // TODO get default background
    width: "content",
    height: "content",
    margin: 0,
    padding: 0,
    border: "none",
    resize: "none",
    position: "static",
  };
  static inheritedStyling = ["color"];

  toCellPlane = this.render;
  render(renderOptions?: Partial<RenderOptions>): CellPlane {
    const fullRenderOptions = {
      replacePercentWithContentW: false,
      replacePercentWithContentH: false,
      forceContentW: false,
      forceContentH: false,
      forceContentChildW: false,
      forceContentChildH: false,
      ...renderOptions,
    };
    return Element.renderers.reduce(
      (p, f: ElementRenderer) => f(p, this, fullRenderOptions),
      [] as CellPlane
    );
  }

  forceUpdate = this.renderUp;
  renderUp(): CellPlane {
    if (!this.parent)
      throw new Error("Cannot render upwards if I have no parent");
    return this.parent.renderUp();
  }

  dataUp(arg: keyof PTAL, isParent = false): PTAL[typeof arg] {
    if (isParent && arg in this) return this[arg as keyof this];
    if (!this.parent)
      throw new Error("Cannot request data upwards if I have no parent");
    return this.parent.dataUp(arg);
  }

  append(element: Element | TextNode) {
    this.content.push(element);
    element.parent = this;
  }

  insertBefore(node: Element | TextNode, beforeNode: Element | TextNode) {
    this.content.splice(this.content.indexOf(beforeNode), 0, node);
    node.parent = this;
  }

  remove(node: Element | TextNode) {
    this.content.splice(this.content.indexOf(node), 1);
    node.parent = undefined;
  }

  convert(
    size: size,
    to: "ch" | "em" | "w" | "h",
    dependsOnParent: boolean = false
  ): number {
    if (typeof size === "number") return size;
    const [amount, from] = size;
    if (from === to) return amount;
    const D = WoHPartial[to];
    const WoH: Record<unit, "W" | "H"> = {
      ...WoHPartial,
      v: D,
      "%": D,
      c: D,
    };
    let result: number;
    if (unitScope[from] === "viewport") {
      const viewportProperties: Record<"W" | "H", keyof PTAL> = {
        W: "viewportWidth",
        H: "viewportHeight",
      };
      result =
        ((this.dataUp(viewportProperties[WoH[from]]) as number) / 100) * amount; // man is this function giving me trouble
    } else if (unitScope[from] === "percent") {
      const viewportProperties: Record<"W" | "H", keyof Element> = {
        W: "width",
        H: "height",
      };
      result =
        ((this.dataUp(
          viewportProperties[WoH[from]],
          dependsOnParent
        ) as number) /
          100) *
        amount; // man is this function giving me trouble
    } else if (unitScope[from] === "character") {
      result = amount;
    } else {
      throw new Error(`${from} is not a valid unit`);
    }
    return result; // TODO Convert widths and heights
  }

  get width() {
    let width: number;
    let undeterminable =
      this.style.width === "auto" && this.style.height === "auto";
    let baseRender;

    if (this.style.width === "content" || undeterminable) {
      baseRender = Element.renderers[0]([], this, {});
      width = baseRender[0]?.length || 0;
    } else if (this.style.width === "auto" && this.style.height !== "auto") {
      width = this.convert(this.style.height as Not<any, "content">, "h", true);
    } else {
      width = this.convert(
        this.style.width as Not<any, "content" | "auto">,
        "w",
        true
      );
    }
    return width;
  }

  get height() {
    let height: number;
    let undeterminable =
      this.style.width === "auto" && this.style.height === "auto";
    let baseRender;

    if (this.style.height === "content" || undeterminable) {
      baseRender = Element.renderers[0]([], this, {});
      height = baseRender?.length || 0;
    } else if (this.style.width !== "auto" && this.style.height === "auto") {
      height = this.convert(this.style.width as Not<any, "content">, "w", true);
    } else {
      height = this.convert(
        this.style.height as Not<any, "content" | "auto">,
        "h",
        true
      );
    }
    return height;
  }

  style: ElementStyle;
}

export { Element };
