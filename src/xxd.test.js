import assert from "node:assert/strict";
import { describe, it } from "node:test";

import * as xxd from "./xxd.js";

/**
 * @typedef {import("./xxd.js").Config} Config
 */

describe("Sanity check", () => {
  it("should work", () => {
    assert.deepEqual(1, 1);
  });
});

describe("getConfig()", () => {
  it("should work on empty input", () => {
    const input = ["", ""];
    const result = xxd.getConfig(input);
    /**@type{Config}*/
    const expected = {
      reverse: false,
      inputStream: process.stdin,
      outputStream: process.stdout,
    };
    assert.deepEqual(result, expected);
  });
  it("should set reverse flag", () => {
    const input = ["", "", "-r"];
    const result = xxd.getConfig(input);
    /**@type{Config}*/
    const expected = {
      reverse: true,
      inputStream: process.stdin,
      outputStream: process.stdout,
    };
    assert.deepEqual(result, expected);
  });
});
