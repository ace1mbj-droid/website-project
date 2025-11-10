export const isNav10 = (base) => {
  const themeId = base.theme.constructor.config.id;

  return (
    [
      "layout9",
      "layout10",
      "layout13",
      "layout17",
      "layout18",
      "layout28",
    ].indexOf(themeId) >= 0
  );
};
