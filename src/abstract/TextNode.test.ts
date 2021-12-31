import TextNode from "./TextNode";

describe("the world's simplest text node", function () {
  it("stores text", function () {
    expect(new TextNode("woah, a text node").str).toBe("woah, a text node");
  });
  it("is passed by reference", function () {
    const endMyPain = new TextNode("the");
    const fakeContents = [
      new TextNode("the"),
      new TextNode("quick"),
      new TextNode("brown"),
      new TextNode("fox"),
      new TextNode("jumps"),
      new TextNode("over"),
      endMyPain,
      new TextNode("lazy"),
      new TextNode("dog"),
    ];
    const fakeContentsButEveryoneIsHappy = [
      new TextNode("the"),
      new TextNode("quick"),
      new TextNode("brown"),
      new TextNode("fox"),
      new TextNode("jumps"),
      new TextNode("over"),
      new TextNode("lazy"),
      new TextNode("dog"),
    ];
    fakeContents.splice(fakeContents.indexOf(endMyPain), 1);
    expect(fakeContents).toEqual(fakeContentsButEveryoneIsHappy);
  });
});
