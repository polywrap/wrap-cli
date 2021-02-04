import React from "react";
import { TestComponent } from "../core";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("App renders", () => {
  it("First", () => {
    const { container } = render(<TestComponent />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
           si 
        </div>
      </div>
    `);
  });
});
