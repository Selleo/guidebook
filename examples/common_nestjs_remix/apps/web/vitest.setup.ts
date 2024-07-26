import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { installGlobals } from "@remix-run/node";

installGlobals();

afterEach(() => {
  cleanup();
});
