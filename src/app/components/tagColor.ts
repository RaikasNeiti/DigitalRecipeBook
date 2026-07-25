const tagStyles: Record<string, string> = {
  appetizers: "bg-violet-100 text-violet-700",
  dessert: "bg-orange-100 text-orange-700",
  dinner: "bg-amber-100 text-amber-800",
  lunch: "bg-[#417df6]/14 text-[#417df6]",
  seafood: "bg-cyan-100 text-cyan-700",
  vegan: "bg-emerald-100 text-emerald-700",
  vegetarian: "bg-lime-100 text-lime-700",
};

const fallbackTagStyles = [
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
];

export const getTagClassName = (tag: string) => {
  const normalizedTag = tag.trim().toLowerCase();
  if (tagStyles[normalizedTag]) {
    return tagStyles[normalizedTag];
  }

  const charTotal = normalizedTag
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return fallbackTagStyles[charTotal % fallbackTagStyles.length];
};
