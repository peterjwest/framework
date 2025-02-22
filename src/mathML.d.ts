import { MaybeValue } from './value';
import { HTMLAttributes } from './html';

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

export interface MathMLAttributes<Target extends EventTarget = MathMLElement> extends HTMLAttributes<Target> {
  dir?: MaybeValue<'ltr' | 'rtl' | undefined>;
  displaystyle?: MaybeValue<boolean | undefined>;
  /** @deprecated This feature is non-standard. See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/href  */
  href?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/mathbackground */
  mathbackground?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/mathcolor */
  mathcolor?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes/mathsize */
  mathsize?: MaybeValue<string | undefined>;
  nonce?: MaybeValue<string | undefined>;
  scriptlevel?: MaybeValue<string | undefined>;
}

export interface AnnotationMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  encoding?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/semantics#src */
  src?: MaybeValue<string | undefined>;
}

export interface AnnotationXmlMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  encoding?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/semantics#src */
  src?: MaybeValue<string | undefined>;
}

export interface MActionMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/maction#actiontype */
  actiontype?: MaybeValue<'statusline' | 'toggle' | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/maction#selection */
  selection?: MaybeValue<string | undefined>;
}

export interface MathMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  display?: MaybeValue<'block' | 'inline' | undefined>;
}

export interface MEncloseMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  notation?: MaybeValue<string | undefined>;
}

export interface MErrorMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MFencedMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  close?: MaybeValue<string | undefined>;
  open?: MaybeValue<string | undefined>;
  separators?: MaybeValue<string | undefined>;
}

export interface MFracMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfrac#denomalign */
  denomalign?: MaybeValue<ColumnAlign | undefined>;
  linethickness?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfrac#numalign */
  numalign?: MaybeValue<ColumnAlign | undefined>;
}

export interface MiMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** The only value allowed in the current specification is normal (case insensitive)
   * See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mi#mathvariant */
  mathvariant?: MaybeValue<MathVariant | undefined>;
}

export interface MmultiScriptsMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mmultiscripts#subscriptshift */
  subscriptshift?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mmultiscripts#superscriptshift */
  superscriptshift?: MaybeValue<string | undefined>;
}

export interface MNMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MOMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mo#accent */
  accent?: MaybeValue<boolean | undefined>;
  fence?: MaybeValue<boolean | undefined>;
  largeop?: MaybeValue<boolean | undefined>;
  lspace?: MaybeValue<string | undefined>;
  maxsize?: MaybeValue<string | undefined>;
  minsize?: MaybeValue<string | undefined>;
  movablelimits?: MaybeValue<boolean | undefined>;
  rspace?: MaybeValue<string | undefined>;
  separator?: MaybeValue<boolean | undefined>;
  stretchy?: MaybeValue<boolean | undefined>;
  symmetric?: MaybeValue<boolean | undefined>;
}

export interface MOverMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  accent?: MaybeValue<boolean | undefined>;
}

export interface MPaddedMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  depth?: MaybeValue<string | undefined>;
  height?: MaybeValue<string | undefined>;
  lspace?: MaybeValue<string | undefined>;
  voffset?: MaybeValue<string | undefined>;
  width?: MaybeValue<string | undefined>;
}

export interface MPhantomMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MPrescriptsMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MRootMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MRowMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MSMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/ms#browser_compatibility */
  lquote?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/ms#browser_compatibility */
  rquote?: MaybeValue<string | undefined>;
}

export interface MSpaceMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  depth?: MaybeValue<string | undefined>;
  height?: MaybeValue<string | undefined>;
  width?: MaybeValue<string | undefined>;
}

export interface MSqrtMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MStyleMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#background */
  background?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#color */
  color?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#fontsize */
  fontsize?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#fontstyle */
  fontstyle?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#fontweight */
  fontweight?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#scriptminsize */
  scriptminsize?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mstyle#scriptsizemultiplier */
  scriptsizemultiplier?: MaybeValue<string | undefined>;
}

export interface MSubMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msub#subscriptshift */
  subscriptshift?: MaybeValue<string | undefined>;
}

export interface MSubsupMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msubsup#subscriptshift */
  subscriptshift?: MaybeValue<string | undefined>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msubsup#superscriptshift */
  superscriptshift?: MaybeValue<string | undefined>;
}

export interface MSupMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/msup#superscriptshift */
  superscriptshift?: MaybeValue<string | undefined>;
}

export interface MTableMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#align */
  align?: MaybeValue<VerticalAlign | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#columnalign */
  columnalign?: MaybeValue<ColumnAlign | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#columnlines */
  columnlines?: MaybeValue<Border | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#columnspacing */
  columnspacing?: MaybeValue<string | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#frame */
  frame?: MaybeValue<Border | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#framespacing */
  framespacing?: MaybeValue<string | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#rowalign */
  rowalign?: MaybeValue<VerticalAlign | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#rowlines */
  rowlines?: MaybeValue<Border | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#rowspacing */
  rowspacing?: MaybeValue<string | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtable#width */
  width?: MaybeValue<string | undefined>;
}

export interface MTdMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  columnspan?: MaybeValue<number | undefined>;
  rowspan?: MaybeValue<number | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtd#columnalign */
  columnalign?: MaybeValue<ColumnAlign | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtd#rowalign */
  rowalign?: MaybeValue<VerticalAlign | undefined>;
}

export interface MTextMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface MTrMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtr#columnalign */
  columnalign?: MaybeValue<ColumnAlign | undefined>;
  /** Non-standard attribute See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mtr#rowalign */
  rowalign?: MaybeValue<VerticalAlign | undefined>;
}

export interface MUnderMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  accentunder?: MaybeValue<boolean | undefined>;
}

export interface MUnderoverMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {
  accent?: MaybeValue<boolean | undefined>;
  accentunder?: MaybeValue<boolean | undefined>;
}

export interface SemanticsMathMLAttributes<T extends EventTarget> extends MathMLAttributes<T> {}

export interface IntrinsicMathMLElements {
  annotation: AnnotationMathMLAttributes<MathMLElement>;
  'annotation-xml': AnnotationXmlMathMLAttributes<MathMLElement>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/maction */
  maction: MActionMathMLAttributes<MathMLElement>;
  math: MathMathMLAttributes<MathMLElement>;
  /** This feature is non-standard. See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/menclose  */
  menclose: MEncloseMathMLAttributes<MathMLElement>;
  merror: MErrorMathMLAttributes<MathMLElement>;
  /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mfenced */
  mfenced: MFencedMathMLAttributes<MathMLElement>;
  mfrac: MFracMathMLAttributes<MathMLElement>;
  mi: MiMathMLAttributes<MathMLElement>;
  mmultiscripts: MmultiScriptsMathMLAttributes<MathMLElement>;
  mn: MNMathMLAttributes<MathMLElement>;
  mo: MOMathMLAttributes<MathMLElement>;
  mover: MOverMathMLAttributes<MathMLElement>;
  mpadded: MPaddedMathMLAttributes<MathMLElement>;
  mphantom: MPhantomMathMLAttributes<MathMLElement>;
  mprescripts: MPrescriptsMathMLAttributes<MathMLElement>;
  mroot: MRootMathMLAttributes<MathMLElement>;
  mrow: MRowMathMLAttributes<MathMLElement>;
  ms: MSMathMLAttributes<MathMLElement>;
  mspace: MSpaceMathMLAttributes<MathMLElement>;
  msqrt: MSqrtMathMLAttributes<MathMLElement>;
  mstyle: MStyleMathMLAttributes<MathMLElement>;
  msub: MSubMathMLAttributes<MathMLElement>;
  msubsup: MSubsupMathMLAttributes<MathMLElement>;
  msup: MSupMathMLAttributes<MathMLElement>;
  mtable: MTableMathMLAttributes<MathMLElement>;
  mtd: MTdMathMLAttributes<MathMLElement>;
  mtext: MTextMathMLAttributes<MathMLElement>;
  mtr: MTrMathMLAttributes<MathMLElement>;
  munder: MUnderMathMLAttributes<MathMLElement>;
  munderover: MUnderMathMLAttributes<MathMLElement>;
  semantics: SemanticsMathMLAttributes<MathMLElement>;
}
