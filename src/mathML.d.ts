import { WrapAttributes } from './util';
import { GenericAttributes } from './html';

type VerticalAlign = 'axis' | 'baseline' | 'bottom' | 'center' | 'top';
type ColumnAlign = 'center' | 'left' | 'right';
type Border = 'dashed' | 'none' | 'solid';

type MathVariant = (
  'normal' |
  'bold' |
  'italic' |
  'bold-italic' |
  'double-struck' |
  'bold-fraktur' |
  'script' |
  'bold-script' |
  'fraktur' |
  'sans-serif' |
  'bold-sans-serif' |
  'sans-serif-italic' |
  'sans-serif-bold-italic' |
  'monospace' |
  'initial' |
  'tailed' |
  'looped' |
  'stretched'
);

export type MathMLAttributes<Target extends EventTarget = MathMLElement> = GenericAttributes & WrapAttributes<{
  dir?: 'ltr' | 'rtl';
  displaystyle?: boolean;
  /** @deprecated This feature is non-standard. See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/href  */
  href?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/mathbackground */
  mathbackground?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/mathcolor */
  mathcolor?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/mathsize */
  mathsize?: string;
  nonce?: string;
  scriptlevel?: string;
}>;

export type AnnotationMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  encoding?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/semantics#src */
  src?: string;
}>;

export type AnnotationXmlMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  encoding?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/semantics#src */
  src?: string;
}>;

export type MActionMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/maction#actiontype */
  actiontype?: 'statusline' | 'toggle';
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/maction#selection */
  selection?: string;
}>;

export type MathMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  display?: 'block' | 'inline';
}>;

export type MEncloseMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  notation?: string;
}>;

export type MFencedMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  close?: string;
  open?: string;
  separators?: string;
}>;

export type MFracMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfrac#denomalign */
  denomalign?: ColumnAlign;
  linethickness?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfrac#numalign */
  numalign?: ColumnAlign;
}>;

export type MiMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** The only value allowed in the current specification is normal (case insensitive)
   * See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mi#mathvariant */
  mathvariant?: MathVariant;
}>;

export type MmultiScriptsMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mmultiscripts#subscriptshift */
  subscriptshift?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mmultiscripts#superscriptshift */
  superscriptshift?: string;
}>;

export type MOMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mo#accent */
  accent?: boolean;
  fence?: boolean;
  largeop?: boolean;
  lspace?: string;
  maxsize?: string;
  minsize?: string;
  movablelimits?: boolean;
  rspace?: string;
  separator?: boolean;
  stretchy?: boolean;
  symmetric?: boolean;
}>;

export type MOverMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  accent?: boolean;
}>;

export type MPaddedMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  depth?: string;
  height?: string;
  lspace?: string;
  voffset?: string;
  width?: string;
}>;

export type MSMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/ms#browser_compatibility */
  lquote?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/ms#browser_compatibility */
  rquote?: string;
}>;

export type MSpaceMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  depth?: string;
  height?: string;
  width?: string;
}>;

export type MStyleMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#background */
  background?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#color */
  color?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#fontsize */
  fontsize?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#fontstyle */
  fontstyle?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#fontweight */
  fontweight?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#scriptminsize */
  scriptminsize?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#scriptsizemultiplier */
  scriptsizemultiplier?: string;
}>;

export type MSubMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msub#subscriptshift */
  subscriptshift?: string;
}>;

export type MSubsupMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msubsup#subscriptshift */
  subscriptshift?: string;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msubsup#superscriptshift */
  superscriptshift?: string;
}>;

export type MSupMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msup#superscriptshift */
  superscriptshift?: string;
}>;

export type MTableMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#align */
  align?: VerticalAlign;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#columnalign */
  columnalign?: ColumnAlign;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#columnlines */
  columnlines?: Border;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#columnspacing */
  columnspacing?: string;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#frame */
  frame?: Border;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#framespacing */
  framespacing?: string;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#rowalign */
  rowalign?: VerticalAlign;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#rowlines */
  rowlines?: Border;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#rowspacing */
  rowspacing?: string;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#width */
  width?: string;
}>;

export type MTdMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  columnspan?: number;
  rowspan?: number;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtd#columnalign */
  columnalign?: ColumnAlign;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtd#rowalign */
  rowalign?: VerticalAlign;
}>;

export type MTrMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtr#columnalign */
  columnalign?: ColumnAlign;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtr#rowalign */
  rowalign?: VerticalAlign;
}>;

export type MUnderMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  accentunder?: boolean;
}>;

export type MUnderoverMathMLAttributes<T extends EventTarget> = MathMLAttributes<T> & WrapAttributes<{
  accent?: boolean;
  accentunder?: boolean;
}>;

export interface IntrinsicMathMLElements {
  annotation: AnnotationMathMLAttributes<MathMLElement>;
  'annotation-xml': AnnotationXmlMathMLAttributes<MathMLElement>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/maction */
  maction: MActionMathMLAttributes<MathMLElement>;
  math: MathMathMLAttributes<MathMLElement>;
  /** This feature is non-standard. See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/menclose  */
  menclose: MEncloseMathMLAttributes<MathMLElement>;
  merror: MathMLAttributes<MathMLElement>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfenced */
  mfenced: MFencedMathMLAttributes<MathMLElement>;
  mfrac: MFracMathMLAttributes<MathMLElement>;
  mi: MiMathMLAttributes<MathMLElement>;
  mmultiscripts: MmultiScriptsMathMLAttributes<MathMLElement>;
  mn: MathMLAttributes<MathMLElement>;
  mo: MOMathMLAttributes<MathMLElement>;
  mover: MOverMathMLAttributes<MathMLElement>;
  mpadded: MPaddedMathMLAttributes<MathMLElement>;
  mphantom: MathMLAttributes<MathMLElement>;
  mprescripts: MathMLAttributes<MathMLElement>;
  mroot: MathMLAttributes<MathMLElement>;
  mrow: MathMLAttributes<MathMLElement>;
  ms: MSMathMLAttributes<MathMLElement>;
  mspace: MSpaceMathMLAttributes<MathMLElement>;
  msqrt: MathMLAttributes<MathMLElement>;
  mstyle: MStyleMathMLAttributes<MathMLElement>;
  msub: MSubMathMLAttributes<MathMLElement>;
  msubsup: MSubsupMathMLAttributes<MathMLElement>;
  msup: MSupMathMLAttributes<MathMLElement>;
  mtable: MTableMathMLAttributes<MathMLElement>;
  mtd: MTdMathMLAttributes<MathMLElement>;
  mtext: MathMLAttributes<MathMLElement>;
  mtr: MTrMathMLAttributes<MathMLElement>;
  munder: MUnderMathMLAttributes<MathMLElement>;
  munderover: MUnderMathMLAttributes<MathMLElement>;
  semantics: MathMLAttributes<MathMLElement>;
}
