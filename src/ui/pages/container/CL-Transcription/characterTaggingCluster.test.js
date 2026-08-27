import { getSyllableClusterLength } from "./TranscriptionRightPanel";

const tamilMappings = {
  'க': ['k-kh', 'k-g', 'k-gh'],
  'ப': ['p-ph', 'p-b', 'p-bh'],
  'த': ['t-th', 't-d', 't-dh'],
  'ட': ['T-TH', 'T-D', 'T-DH'],
  'ச': ['s-ch', 's-cch'],
  'ஜ': ['j-jh', 'jh-j'],
};

describe("getSyllableClusterLength for Tamil character tagging", () => {
  it("does not include following characters when selecting a consonant with pulli at start of word (க்ராமம்)", () => {
    const text = "க்ராமம்";
    const length = getSyllableClusterLength(text, 0, tamilMappings);
    expect(length).toBe(2);
    expect(text.slice(0, 0 + length)).toBe("க்");
  });

  it("keeps middle pulli cluster correct (அக்ரம்)", () => {
    const text = "அக்ரம்";
    const length = getSyllableClusterLength(text, 1, tamilMappings);
    expect(length).toBe(2);
    expect(text.slice(1, 1 + length)).toBe("க்");
  });

  it("includes final pulli on word ending with pulli (சுரக்)", () => {
    const text = "சுரக்";
    const length = getSyllableClusterLength(text, 3, tamilMappings);
    expect(length).toBe(2);
    expect(text.slice(3, 3 + length)).toBe("க்");
  });

  it("keeps vowel sign ா attached to க (காலம்)", () => {
    const text = "காலம்";
    const length = getSyllableClusterLength(text, 0, tamilMappings);
    expect(length).toBe(2);
    expect(text.slice(0, 0 + length)).toBe("கா");
  });

  it("does not include following க when selecting first க் in geminate (க்கலம்)", () => {
    const text = "க்கலம்";
    const length = getSyllableClusterLength(text, 0, tamilMappings);
    expect(length).toBe(2);
    expect(text.slice(0, 0 + length)).toBe("க்");
  });

  it("correctly identifies initial cluster in loanwords like ப்ரெண்ட் and ப்ளீஸ்", () => {
    const friend = "ப்ரெண்ட்";
    const friendLen = getSyllableClusterLength(friend, 0, tamilMappings);
    expect(friendLen).toBe(2);
    expect(friend.slice(0, 0 + friendLen)).toBe("ப்");

    const please = "ப்ளீஸ்";
    const pleaseLen = getSyllableClusterLength(please, 0, tamilMappings);
    expect(pleaseLen).toBe(2);
    expect(please.slice(0, 0 + pleaseLen)).toBe("ப்");
  });
});
