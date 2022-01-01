import ReactReconciler from "react-reconciler";
import { Element, ElementProps } from "../abstract/Element";
import TextNode from "../abstract/TextNode";
import PTAL from "../ptal";
import all from "../tags/all";

// TODO check the JS docs and write code accordingly

const Reconciler = ReactReconciler({
  // Elements creation
  createInstance: (type: keyof typeof all, props: ElementProps) => {
    return new all[type]([], props);
  },
  createTextInstance: (text) => {
    return new TextNode(text);
  },

  // Elements birth
  appendInitialChild: (parentInstance: Element, child: Element | TextNode) => {
    parentInstance.append(child);
  },
  appendChild: (parentInstance: Element, child: Element | TextNode) => {
    parentInstance.append(child);
  },
  appendChildToContainer: (
    parentInstance: Element,
    child: Element | TextNode
  ) => {
    parentInstance.append(child);
  },
  preparePortalMount: () => {},
  insertBefore: (
    parentInstance: Element,
    child: Element | TextNode,
    beforeChild: Element | TextNode
  ) => {
    parentInstance.insertBefore(child, beforeChild);
  },

  // Element updates
  finalizeInitialChildren: () => {
    return false;
  },
  prepareForCommit: () => {
    return null;
  },
  resetAfterCommit: () => {},
  prepareUpdate: () => {},
  commitTextUpdate: (textnode: TextNode, oldText: string, newText: string) => {
    textnode.overwrite(newText);
  },
  commitUpdate: (instance) => {
    instance.renderUp();
  },

  // Elements death
  removeChild: (parentInstance: Element, child: Element | TextNode) => {
    parentInstance.remove(child);
  },
  clearContainer: (element: Element) => (element.content = []),

  // Data gather
  getRootHostContext: () => {
    return {};
  },
  getChildHostContext: () => {
    return {}; // Don't forget when making an SVG!
  },
  getPublicInstance: (instance) => instance,

  // Config
  shouldSetTextContent: () => {
    return false; // TODO handle text only nodes
  },
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: true,

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  now: Date.now,
});

const CustomRenderer = {
  render(element: Element | TextNode | JSX.Element, renderDom: PTAL) {
    // element: This is the react element for App component
    // renderDom: This is the host root element to which the rendered app will be attached.
    // callback: if specified will be called after render is done.

    const container = Reconciler.createContainer(renderDom, 0, false, null); // Creates root fiber node.

    const parentComponent = null; // Since there is no parent (since this is the root fiber). We set parentComponent to null.
    Reconciler.updateContainer(element, container, parentComponent, () =>
      renderDom.render()
    ); // Start reconcilation and render the result
  },
};

export default CustomRenderer;
