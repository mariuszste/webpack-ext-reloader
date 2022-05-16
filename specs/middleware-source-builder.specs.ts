import { assert } from "chai";
import { RawSource } from "webpack-sources";
import middlewareSourceBuilder from "../src/middleware/middleware-source-builder";

describe("middlewareSourceBuilder", () => {
  it("Build the middleware from the post-compiled source code in background script", () => {
    assert(middlewareSourceBuilder({ port: 1234, reloadPage: true, page: "background" }) instanceof RawSource);
  });

  it("Build the middleware from the post-compiled source code in content script", () => {
    assert(middlewareSourceBuilder({ port: 1234, reloadPage: true, page: "content" }) instanceof RawSource);
  });

  it("Build the middleware from the post-compiled source code in extension script", () => {
    assert(middlewareSourceBuilder({ port: 1234, reloadPage: true, page: "extension" }) instanceof RawSource);
  });
});
