import React from "react";
import { render } from "@testing-library/react";

describe("App renders", () => {
  it("First", () => {
    const { container } = render(<div />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div />
      </div>
    `);
  });
});
