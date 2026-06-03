import type { Colour, Size } from '@/types';

export const URL_PARAMS = {
  COLOUR: 'colour',
  SIZE: 'size',
} as const;

export interface VariantParams {
  colourId: string | null;
  sizeId: string | null;
}

export function getVariantFromURL(): VariantParams {
  const params = new URLSearchParams(window.location.search);
  return {
    colourId: params.get(URL_PARAMS.COLOUR),
    sizeId: params.get(URL_PARAMS.SIZE),
  };
}

export function setVariantInURL(colourId: string, sizeId: string | null): void {
  const params = new URLSearchParams(window.location.search);
  params.set(URL_PARAMS.COLOUR, colourId);
  if (sizeId) {
    params.set(URL_PARAMS.SIZE, sizeId);
  } else {
    params.delete(URL_PARAMS.SIZE);
  }
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newURL);
}

export function getInitialColour(colours: Colour[]): string {
  const { colourId } = getVariantFromURL();
  const fromURL = colours.find((c) => c.id === colourId);
  return fromURL?.id ?? colours[0]?.id ?? '';
}

export function getInitialSize(sizes: Size[]): string | null {
  const { sizeId } = getVariantFromURL();
  const fromURL = sizes.find((s) => s.id === sizeId && s.status !== 'sold_out');
  if (fromURL) return fromURL.id;
  return sizes.find((s) => s.status !== 'sold_out')?.id ?? null;
}
