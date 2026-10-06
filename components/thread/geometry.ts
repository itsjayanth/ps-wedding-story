/** Pure geometry for the gold thread. All coordinates are in the ThreadLayer's own pixel space. */
export interface ThreadGeometry {
  width: number;
  height: number;
  mobile: boolean;
  /** Static branch paths (the two threads, or on mobile the single curving one). */
  branches: string[];
  /** Page-space y range over which the branches are drawn (scroll-linked). */
  branchSpan: { y0: number; y1: number };
  /** Straight scroll-drawn trunk. */
  trunk: { x: number; y0: number; y1: number };
  /** Top of a dark/positioned closing section that would cover the SVG; the trunk is redrawn above it from here. */
  overlayFrom: number | null;
}

const rel = (el: Element, layer: DOMRect) => {
  const r = el.getBoundingClientRect();
  return { x: r.left - layer.left + r.width / 2, y: r.top - layer.top + r.height / 2, bottom: r.bottom - layer.top };
};

export const MOBILE_EDGE_X = 11;

export function measure(layerEl: HTMLElement): ThreadGeometry | null {
  const layer = layerEl.getBoundingClientRect();
  if (layer.width < 10 || layer.height < 10) return null;
  const mobile = !window.matchMedia('(min-width: 768px)').matches;
  const bride = layerEl.querySelector('[data-thread-from="bride"]');
  const groom = layerEl.querySelector('[data-thread-from="groom"]');
  const join = layerEl.querySelector('[data-thread-join]');
  if (!bride || !groom) return null;
  const b = rel(bride, layer);
  const g = rel(groom, layer);

  const endEl = layerEl.querySelector('[data-thread-end]');
  const e = endEl ? rel(endEl, layer) : null;
  const yEnd = Math.min(layer.height - 8, e ? e.y : layer.height - 80);

  const cl = layerEl.querySelector('[data-section="closing"]');
  const overlayFrom = cl ? cl.getBoundingClientRect().top - layer.top : null;

  if (mobile) {
    const x = MOBILE_EDGE_X;
    const yj = g.y + 40;
    const h = 28;
    const branch = `M${g.x} ${g.y} C${g.x} ${g.y + h} ${x} ${yj - h} ${x} ${yj}`;
    if (yEnd <= b.y + 40) return null;
    return { width: layer.width, height: layer.height, mobile, branches: [branch], branchSpan: { y0: g.y, y1: yj }, trunk: { x, y0: b.y, y1: yEnd }, overlayFrom };
  }

  const j = join ? rel(join, layer) : { x: (b.x + g.x) / 2, y: Math.max(b.y, g.y) + 400, bottom: 0 };
  const yc = j.y - 110;
  const curve = (x: number, y: number) => `M${x} ${y} V${yc} C${x} ${yc + 60} ${j.x} ${j.y - 60} ${j.x} ${j.y}`;
  if (yEnd <= j.y + 40 || yc <= Math.max(b.y, g.y)) return null;
  return {
    width: layer.width,
    height: layer.height,
    mobile,
    branches: [curve(b.x, b.y), curve(g.x, g.y)],
    branchSpan: { y0: Math.min(b.y, g.y), y1: j.y },
    trunk: { x: j.x, y0: j.y, y1: yEnd },
    overlayFrom,
  };
}
