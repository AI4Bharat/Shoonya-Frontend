export const canOpenCharacterTagging = ({
  isCharacterTaggingProject,
  isL1,
  hasL2,
}) => isCharacterTaggingProject && (!isL1 || !hasL2);
