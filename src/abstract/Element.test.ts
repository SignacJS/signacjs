import { Element } from "./Element";
import chalk from "chalk";
import TextNode from "./TextNode";

describe("element", function () {
  describe("content", function () {
    it("should render plain text correctly", function () {
      expect(new Element([new TextNode("Hello!")]).render()).toBe("Hello!");

      expect(
        new Element([new TextNode("Hello"), new TextNode("World!")]).render()
      ).toBe("HelloWorld!");

      expect(
        new Element([
          new TextNode("Hello"),
          new Element([new TextNode("World!")]),
        ]).render()
      ).toBe("Hello \nWorld!");
    });
  });
  describe("backgroundColor", function () {
    it("should handle the background color correclty", function () {
      expect(
        new Element([new TextNode(" ")], {
          style: { backgroundColor: "white" },
        }).render()
      ).toBe(chalk.bgWhite(" "));

      expect(
        new Element([new TextNode("O hey!")], {
          style: { color: "#cccccc" },
        }).render()
      ).toBe(chalk.hex("#cccccc")("O hey!")); // TODO add 16/256 color support
    });
  });
});
