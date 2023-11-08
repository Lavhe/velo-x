import React from "react";
import { render } from "@testing-library/react-native";

import { Loader } from "ui";

test("renders correctly", () => {
  const { root, getByAccessibilityHint } = render(<Loader />);

  expect(getByAccessibilityHint("loading")).toBeTruthy();
});
