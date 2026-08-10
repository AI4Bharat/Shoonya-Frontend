import { canOpenCharacterTagging } from "./characterTaggingVisibility";

describe("character tagging visibility", () => {
  it("enables tagging only in L2 when both L1 and L2 are visible", () => {
    expect(
      canOpenCharacterTagging({
        isCharacterTaggingProject: true,
        isL1: true,
        hasL2: true,
      }),
    ).toBe(false);

    expect(
      canOpenCharacterTagging({
        isCharacterTaggingProject: true,
        isL1: false,
        hasL2: true,
      }),
    ).toBe(true);
  });

  it("keeps L1 tagging available when the project has no visible L2", () => {
    expect(
      canOpenCharacterTagging({
        isCharacterTaggingProject: true,
        isL1: true,
        hasL2: false,
      }),
    ).toBe(true);
  });

  it("disables tagging for non-character-tagging projects", () => {
    expect(
      canOpenCharacterTagging({
        isCharacterTaggingProject: false,
        isL1: false,
        hasL2: true,
      }),
    ).toBe(false);
  });
});
