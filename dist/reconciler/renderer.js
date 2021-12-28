"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_reconciler_1 = __importDefault(require("react-reconciler"));
var TextNode_1 = __importDefault(require("../abstract/TextNode"));
var all_1 = __importDefault(require("../tags/all"));
// TODO check the JS docs and write code accordingly
var Reconciler = (0, react_reconciler_1.default)({
    // Elements creation
    createInstance: function (type, props) {
        return new all_1.default[type]([], props);
    },
    createTextInstance: function (text) {
        return new TextNode_1.default(text);
    },
    // Elements birth
    appendInitialChild: function (parentInstance, child) {
        parentInstance.append(child);
    },
    appendChild: function (parentInstance, child) {
        parentInstance.append(child);
    },
    appendChildToContainer: function (parentInstance, child) {
        parentInstance.append(child);
    },
    preparePortalMount: function () { },
    insertBefore: function (parentInstance, child, beforeChild) {
        parentInstance.insertBefore(child, beforeChild);
    },
    // Element updates
    finalizeInitialChildren: function () {
        return false;
    },
    prepareForCommit: function () {
        return null;
    },
    resetAfterCommit: function () { },
    prepareUpdate: function () { },
    commitTextUpdate: function (textnode, oldText, newText) {
        textnode.overwrite(newText);
    },
    commitUpdate: function (instance) {
        instance.renderUp();
    },
    // Elements death
    removeChild: function (parentInstance, child) {
        parentInstance.remove(child);
    },
    clearContainer: function (element) { return element.content = []; },
    // Data gather
    getRootHostContext: function () {
        return {};
    },
    getChildHostContext: function () {
        return {}; // Don't forget when making an SVG!
    },
    getPublicInstance: function (instance) { return instance; },
    // Config
    shouldSetTextContent: function () {
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
var CustomRenderer = {
    render: function (element, renderDom) {
        // element: This is the react element for App component
        // renderDom: This is the host root element to which the rendered app will be attached.
        // callback: if specified will be called after render is done.
        var container = Reconciler.createContainer(renderDom, 0, false, null); // Creates root fiber node.
        var parentComponent = null; // Since there is no parent (since this is the root fiber). We set parentComponent to null.
        Reconciler.updateContainer(element, container, parentComponent, function () { return renderDom.render(); }); // Start reconcilation and render the result
    }
};
exports.default = CustomRenderer;
