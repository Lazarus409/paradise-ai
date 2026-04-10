function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getContrastRatio(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
) {
  const l1 = luminance(...rgb1);
  const l2 = luminance(...rgb2);

  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}