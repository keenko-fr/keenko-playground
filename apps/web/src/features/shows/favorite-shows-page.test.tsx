import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UnavailableFavorite } from "./favorite-shows-page";

describe("UnavailableFavorite", () => {
  it("lets the user unset the stored preference", () => {
    const onRemove = vi.fn();

    render(
      <UnavailableFavorite
        error={false}
        onRemove={(tvMazeId) => {
          onRemove(tvMazeId);
        }}
        pending={false}
        tvMazeId={42}
      />
    );
    fireEvent.click(screen.getByRole("button"));

    expect(onRemove).toHaveBeenCalledExactlyOnceWith(42);
  });
});
