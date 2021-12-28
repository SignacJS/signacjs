import { BaseStyle, DisplayBlock, size, unit } from '../styles/types';
import { merge, pad2d, parseColor } from '../utils';
import { colorProcessStr, bgColorProcessStr } from '../sequences/colors';
import TextNode from './TextNode';
import PTAL from '../ptal';

type ElementStyle = BaseStyle & DisplayBlock;

type ElementRenderer = ((previousRender: string, element: Element) => string);

export interface ElementProps {
  style: Partial<ElementStyle>;
}

export interface Data {

}

class Element {
  private styling: Partial<ElementStyle>;
  content: (Element | TextNode)[];
  props: ElementProps;
  parent?: Element;
  rootElement?: PTAL;
  context = {};
  constructor (content: (Element | TextNode)[], props: Partial<ElementProps> = { style: {} }, rootElement?: PTAL) {
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
        if (style === 'unset') {
          if (currentElement.parent && Element.inheritedStyling.includes(prop)) {
            return currentElement.parent.style[prop]; // wee down the proxy hole
          }
          return obj[prop]
        }
        if (style === 'inherit') {
          if (currentElement.parent) {
            return currentElement.parent.style[prop]; // wee down the proxy hole
          }
          return obj[prop];
        }
        if (style === 'initial') return obj[prop];
        return style || obj[prop];
      },
      set(obj, prop: keyof ElementStyle, value) {
        fullProps.style[prop] = value === 'initial' ? null : value;
        return true;
      }
    });
  }

  static renderers: ElementRenderer[] = [
    (previousRender, el) => { // Render the content + add text color
      const str: string[] = [];
      const content = el.content;
      for (let i = 0; i < content.length; i ++) {
        const prevNode = content[i - 1];
        let currNode = content[i];
        if (currNode instanceof TextNode) currNode.str = colorProcessStr(currNode.str, parseColor(el.style.color));

        if (!prevNode) {
          str.push(currNode.toString());
          continue;
        }

        const nodeIsInline = (Node: Element | TextNode) => Node instanceof TextNode || Node.style.display.startsWith('inline');
        if (nodeIsInline(prevNode) && nodeIsInline(currNode)) {
          str[str.length - 1] = merge('X', str[str.length - 1], content[i].toString());
          continue;
        }

        str.push(currNode.toString());
      }
      return merge('Y', ...str);
    },
    (previousRender, el) => {
      let width: number;
      if (el.style.width === 'content') width = previousRender[0]?.length || 0;
      else if (el.style.width === 'auto' && el.style.height !== 'auto') width = el.style.height
      else width = el.style.width;
      let height = el.style.height;
      return pad2d(previousRender, width, el.style.height);
    },
    (previousRender, el) => { // Render the backgroundColor
      const bgColor = parseColor(el.style.backgroundColor);
      return bgColorProcessStr(previousRender, bgColor);
    },
  ];
  static defaultStyling: ElementStyle = {
    display: 'block',
    color: 'initial', // TODO get default foreground
    backgroundColor: 'initial', // TODO get default background
    width: 'content',
    height: 'content',
    margin: 0,
    padding: 0,
    border: 'none',
    resize: 'none',
    position: 'static',
  }
  static inheritedStyling = [
    'color',
  ]

  toString = this.render;
  render (): string {
    return Element.renderers.reduce((p, f: ElementRenderer) => f(p, this), '');
  }

  forceUpdate = this.renderUp;
  renderUp (): string {
    if (!this.parent) throw new Error('Cannot render upwards if I have no parent');
    return this.parent.renderUp();
  }

  dataUp (arg: keyof Element, isParent = false): PTAL[typeof arg] {
    if (isParent && this[arg]) return this[arg];
    if (!this.parent) throw new Error('Cannot request data upwards if I have no parent');
    return this.parent.dataUp(arg);
  }

  append (element: Element | TextNode) {
    this.content.push(element);
    element.parent = this;
  }

  insertBefore (node: Element | TextNode, beforeNode: Element | TextNode) {
    this.content.splice(this.content.indexOf(beforeNode), 0, node);
    node.parent = this;
  }

  remove (node: Element | TextNode) {
    this.content.splice(this.content.indexOf(node), 1);
    node.parent = undefined;
  }

  convert (size: size, to: unit): number {
    if (typeof size === 'number') return size;
    const [amount, from] = size;
    if (from === to) return amount;
  }

  style: ElementStyle;
}

export { Element };
