import {
  getSyllableClusters,
  resolveTaggableChar,
  getWordTagInfo,
  getCharIndexAtPoint,
} from "./characterTaggingCluster";

describe("characterTaggingCluster - Syllable Clustering", () => {
  const marathiMappings = {
    'ज': ['z-j', 'j-z'],
    'झ': ['zh-jh', 'jh-zh'],
    'च': ['ts-ch', 'ch-ts'],
    'फ': ['ph-f', 'f-ph'],
  };

  const tamilMappings = {
    'க': ['k-kh', 'k-g'],
    'ப': ['p-ph', 'p-b'],
    'த': ['t-th', 't-d'],
    'ட': ['T-TH', 'T-D'],
    'ச': ['s-ch', 's-cch'],
    'ஜ': ['j-jh', 'jh-j'],
  };

  describe("Marathi Syllable Clustering", () => {
    it("segments single compound letters as single clusters", () => {
      expect(getSyllableClusters("र्ची", "mr").map((c) => c.text)).toEqual(["र्ची"]);
      expect(getSyllableClusters("श्चि", "mr").map((c) => c.text)).toEqual(["श्चि"]);
      expect(getSyllableClusters("र्फ", "mr").map((c) => c.text)).toEqual(["र्फ"]);
    });

    it("correctly segments multi-syllable Marathi words containing conjuncts", () => {
      expect(getSyllableClusters("स्वच्छ", "mr").map((c) => c.text)).toEqual(["स्व", "च्छ"]);
      expect(getSyllableClusters("राज्य", "mr").map((c) => c.text)).toEqual(["रा", "ज्य"]);
      expect(getSyllableClusters("तर्फे", "mr").map((c) => c.text)).toEqual(["त", "र्फे"]);
      expect(getSyllableClusters("चर्चा", "mr").map((c) => c.text)).toEqual(["च", "र्चा"]);
      expect(getSyllableClusters("खर्चाची", "mr").map((c) => c.text)).toEqual(["ख", "र्चा", "ची"]);
      expect(getSyllableClusters("बर्फ", "mr").map((c) => c.text)).toEqual(["ब", "र्फ"]);
      expect(getSyllableClusters("उच्च", "mr").map((c) => c.text)).toEqual(["उ", "च्च"]);
      expect(getSyllableClusters("लज्जा", "mr").map((c) => c.text)).toEqual(["ल", "ज्जा"]);
    });

    it("preserves exact UTF-16 code unit offsets", () => {
      const text = "खर्चाची";
      const clusters = getSyllableClusters(text, "mr");
      expect(clusters[0]).toEqual({ start: 0, end: 1, text: "ख" });
      expect(clusters[1]).toEqual({ start: 1, end: 5, text: "र्चा" }); // र (1) + ् (2) + च (3) + ा (4)
      expect(clusters[2]).toEqual({ start: 5, end: 7, text: "ची" });   // च (5) + ी (6)
      expect(text.slice(clusters[1].start, clusters[1].end)).toBe("र्चा");
      expect(text.slice(clusters[2].start, clusters[2].end)).toBe("ची");
    });
  });

  describe("Tamil Syllable Clustering (Pulli Rule)", () => {
    it("attaches pulli to preceding consonant and stops before next consonant", () => {
      expect(getSyllableClusters("படம்", "ta").map((c) => c.text)).toEqual(["ப", "ட", "ம்"]);
      expect(getSyllableClusters("காலம்", "ta").map((c) => c.text)).toEqual(["கா", "ல", "ம்"]);
      expect(getSyllableClusters("பக்கம்", "ta").map((c) => c.text)).toEqual(["ப", "க்", "க", "ம்"]);
      expect(getSyllableClusters("தம்பி", "ta").map((c) => c.text)).toEqual(["த", "ம்", "பி"]);
      expect(getSyllableClusters("க்ராமம்", "ta").map((c) => c.text)).toEqual(["க்", "ரா", "ம", "ம்"]);
    });
  });

  describe("resolveTaggableChar - Marathi Compound Letters", () => {
    it("resolves to 'च' when clicking anywhere inside 'र्ची'", () => {
      const text = "र्ची"; // indices: 0: र, 1: ्, 2: च, 3: ी
      for (let i = 0; i < text.length; i++) {
        const resolved = resolveTaggableChar(text, i, marathiMappings, "mr");
        expect(resolved).not.toBeNull();
        expect(resolved.key).toBe("च");
        expect(resolved.baseIndex).toBe(2);
        expect(resolved.clusterStart).toBe(0);
        expect(resolved.clusterEnd).toBe(4);
        expect(resolved.clusterText).toBe("र्ची");
      }
    });

    it("resolves to 'च' when clicking anywhere inside 'श्चि'", () => {
      const text = "श्चि"; // indices: 0: श, 1: ्, 2: च, 3: ि
      for (let i = 0; i < text.length; i++) {
        const resolved = resolveTaggableChar(text, i, marathiMappings, "mr");
        expect(resolved).not.toBeNull();
        expect(resolved.key).toBe("च");
        expect(resolved.baseIndex).toBe(2);
        expect(resolved.clusterStart).toBe(0);
        expect(resolved.clusterEnd).toBe(4);
        expect(resolved.clusterText).toBe("श्चि");
      }
    });

    it("resolves to 'फ' when clicking anywhere inside 'र्फ'", () => {
      const text = "र्फ"; // indices: 0: र, 1: ्, 2: फ
      for (let i = 0; i < text.length; i++) {
        const resolved = resolveTaggableChar(text, i, marathiMappings, "mr");
        expect(resolved).not.toBeNull();
        expect(resolved.key).toBe("फ");
        expect(resolved.baseIndex).toBe(2);
        expect(resolved.clusterStart).toBe(0);
        expect(resolved.clusterEnd).toBe(3);
        expect(resolved.clusterText).toBe("र्फ");
      }
    });

    it("deterministically resolves multiple mapped consonants inside one cluster (च्च)", () => {
      const text = "उच्च"; // 0: उ, 1: च, 2: ्, 3: च
      // Click at index 1 or 2 -> resolves to first 'च' (baseIndex 1)
      const res1 = resolveTaggableChar(text, 1, marathiMappings, "mr");
      expect(res1.key).toBe("च");
      expect(res1.baseIndex).toBe(1);
      expect(res1.clusterStart).toBe(1);
      expect(res1.clusterEnd).toBe(4);

      // Click at index 3 -> resolves to second 'च' (baseIndex 3)
      const res2 = resolveTaggableChar(text, 3, marathiMappings, "mr");
      expect(res2.key).toBe("च");
      expect(res2.baseIndex).toBe(3);
      expect(res2.clusterStart).toBe(1);
      expect(res2.clusterEnd).toBe(4);
    });
  });

  describe("Nukta Handling & Fallback Prevention", () => {
    it("does NOT treat 'फ़' as plain 'फ' when 'फ़' has no mapping", () => {
      const text = "सफ़ेद"; // 0: स, 1: फ, 2: ़, 3: े, 4: द
      // Click on फ़ (index 1 or 2)
      const res = resolveTaggableChar(text, 1, marathiMappings, "mr");
      expect(res).toBeNull();

      const res2 = resolveTaggableChar(text, 2, marathiMappings, "mr");
      expect(res2).toBeNull();
    });

    it("resolves combined nukta when mapping exists for it", () => {
      const text = "सफ़ेद";
      const customMappings = {
        'फ़': ['f-ph', 'ph-f'],
      };
      const res = resolveTaggableChar(text, 1, customMappings, "mr");
      expect(res).not.toBeNull();
      expect(res.key).toBe("फ़");
      expect(res.baseIndex).toBe(1);
      expect(res.length).toBe(2);
      expect(res.clusterStart).toBe(1);
      expect(res.clusterEnd).toBe(4); // फ़ + े
      expect(res.clusterText).toBe("फ़े");
    });
  });

  describe("resolveTaggableChar - Tamil Pulli Cases", () => {
    it("resolves individual pulli and non-pulli consonants accurately in பக்கம்", () => {
      const text = "பக்கம்"; // 0: ப, 1: க, 2: ், 3: க, 4: ம, 5: ்
      // Click on ப
      const resPa = resolveTaggableChar(text, 0, tamilMappings, "ta");
      expect(resPa.key).toBe("ப");
      expect(resPa.clusterStart).toBe(0);
      expect(resPa.clusterEnd).toBe(1);

      // Click on க் (index 1 or 2)
      const resK1 = resolveTaggableChar(text, 1, tamilMappings, "ta");
      expect(resK1.key).toBe("க");
      expect(resK1.baseIndex).toBe(1);
      expect(resK1.clusterStart).toBe(1);
      expect(resK1.clusterEnd).toBe(3); // க + ்

      // Click on க (index 3)
      const resK2 = resolveTaggableChar(text, 3, tamilMappings, "ta");
      expect(resK2.key).toBe("க");
      expect(resK2.baseIndex).toBe(3);
      expect(resK2.clusterStart).toBe(3);
      expect(resK2.clusterEnd).toBe(4);
    });
  });

  describe("getWordTagInfo & Out-of-Order Tag Association", () => {
    it("associates tags with actual wrapped groups regardless of tagging order", () => {
      const text = "चम{चा} <ch-ts>";
      const info = getWordTagInfo(text, 0, 6, marathiMappings, "mr");
      expect(info.wrappedGroups).toHaveLength(1);
      expect(info.wrappedGroups[0].inner).toBe("चा");
      expect(info.tokens).toEqual(["<ch-ts>"]);
    });

    it("handles multiple wrapped groups in order", () => {
      const text = "{च}म{चा} <ts-ch> <ch-ts>";
      const info = getWordTagInfo(text, 0, 8, marathiMappings, "mr");
      expect(info.wrappedGroups).toHaveLength(2);
      expect(info.wrappedGroups[0].inner).toBe("च");
      expect(info.wrappedGroups[1].inner).toBe("चा");
      expect(info.tokens).toEqual(["<ts-ch>", "<ch-ts>"]);
    });
  });

  describe("getCharIndexAtPoint - Mirror Hit Testing", () => {
    it("returns -1 for invalid textarea or when click is outside all spans", () => {
      expect(getCharIndexAtPoint(null, 10, 10, "mr")).toBe(-1);
    });

    it("matches coordinate with the correct syllable cluster span", () => {
      const textarea = document.createElement("textarea");
      textarea.value = "खर्चाची";
      document.body.appendChild(textarea);

      // Mock getComputedStyle and getBoundingClientRect for spans created in mirror
      const origGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      jest.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function () {
        if (this.textContent === "ख") {
          return { left: 0, right: 20, top: 0, bottom: 20, width: 20, height: 20 };
        }
        if (this.textContent === "र्चा") {
          return { left: 20, right: 60, top: 0, bottom: 20, width: 40, height: 20 };
        }
        if (this.textContent === "ची") {
          return { left: 60, right: 90, top: 0, bottom: 20, width: 30, height: 20 };
        }
        return { left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100 };
      });

      // Click at x=35, y=10 (inside "र्चा" cluster span)
      const foundIdx = getCharIndexAtPoint(textarea, 35, 10, "mr");
      // "र्चा" starts at UTF-16 index 1 in "खर्चाची"
      expect(foundIdx).toBe(1);

      // Click at x=75, y=10 (inside "ची" cluster span)
      const foundIdxChi = getCharIndexAtPoint(textarea, 75, 10, "mr");
      expect(foundIdxChi).toBe(5);

      Element.prototype.getBoundingClientRect.mockRestore();
      document.body.removeChild(textarea);
    });
  });
});
