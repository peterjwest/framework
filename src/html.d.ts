import { ComponentChildren } from './jsx';
import { TargetedEvent, WrapAttributes, ReplaceValues, OmitMethods } from './util';
import { AriaRole, AriaAttributes } from './aria';

/** Prop for registering any event listener */
export type EventProp<Target extends EventTarget> = {
  [Key in keyof HTMLElementEventMap]?: (
    this: HTMLAnchorElement,
    event: TargetedEvent<Target, HTMLElementEventMap[Key]>
  ) => any
};

type ReferrerPolicy = (
  'no-referrer' |
  'no-referrer-when-downgrade' |
  'origin' |
  'origin-when-cross-origin' |
  'same-origin' |
  'strict-origin' |
  'strict-origin-when-cross-origin' |
  'unsafe-url'
);

type InputType = (
  'button' |
  'checkbox' |
  'color' |
  'date' |
  'datetime-local' |
  'email' |
  'file' |
  'hidden' |
  'image' |
  'month' |
  'number' |
  'password' |
  'radio' |
  'range' |
  'reset' |
  'search' |
  'submit' |
  'tel' |
  'text' |
  'time' |
  'url' |
  'week'
);

type AnchorTarget = '_self' | '_blank' | '_parent' | '_top';
type AutoCapitalize = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
type EnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
type CrossOrigin = 'anonymous' | 'use-credentials';
type Align = 'left' | 'center' | 'right' | 'justify' | 'char';
type VerticalAlign = 'top' | 'middle' | 'bottom' | 'baseline';

type DOMCSSProperties = ReplaceValues<Partial<OmitMethods<CSSStyleDeclaration>>, string | number | null>;
type AllCSSProperties = { [key: string]: string | number | null };
type CSSProperties = AllCSSProperties & DOMCSSProperties & { cssText?: string | null };

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

/** Attributes common to all HTML elements */
type GenericAttributes = WrapAttributes<AriaAttributes & {
  // Standard HTML Attributes
  accesskey?: string;
  autocapitalize?: AutoCapitalize;
  autocorrect?: string;
  autofocus?: boolean;
  class?: string;
  contenteditable?: boolean | 'plaintext-only';
  dir?: 'auto' | 'rtl' | 'ltr';
  draggable?: boolean;
  enterkeyhint?: EnterKeyHint;
  exportparts?: string;
  hidden?: boolean | 'until-found';
  id?: string;
  inert?: boolean;
  inputmode?: string;
  is?: string;
  lang?: string;
  nonce?: string;
  part?: string;
  popover?: 'auto' | 'hint' | 'manual';
  slot?: string;
  spellcheck?: boolean;
  style?: string | CSSProperties;
  tabindex?: number;
  title?: string;
  translate?: boolean;

  // WAI-ARIA Attributes
  role?: AriaRole;

  // Non-standard Attributes
  disablePictureInPicture?: boolean;
  elementtiming?: string;
  results?: number;

  // RDFa Attributes
  about?: string;
  datatype?: string;
  inlist?: any;
  prefix?: string;
  property?: string;
  resource?: string;
  typeof?: string;
  vocab?: string;

  // Microdata Attributes
  itemid?: string;
  itemprop?: string;
  itemref?: string;
  itemscope?: boolean;
  itemtype?: string;
}>;

/** Attributes and props common to all HTML elements */
type GenericProps<Target extends EventTarget> = GenericAttributes & {
  children?: ComponentChildren;
  events?: EventProp<Target>;
};

type AnchorAttributes = GenericProps<HTMLAnchorElement> & WrapAttributes<{
  download?: any;
  href?: string;
  hreflang?: string;
  media?: string;
  ping?: string;
  rel?: string;
  target?: AnchorTarget;
  type?: string;
  referrerpolicy?: ReferrerPolicy;
}>;

type AreaAttributes = GenericProps<HTMLAreaElement> & WrapAttributes<{
  alt?: string;
  coords?: string;
  download?: any;
  href?: string;
  hreflang?: string;
  media?: string;
  referrerpolicy?: ReferrerPolicy;
  rel?: string;
  shape?: string;
  target?: string;
}>;

type BaseAttributes = GenericProps<HTMLBaseElement> & WrapAttributes<{
  href?: string;
  target?: string;
}>;

type BlockquoteAttributes = GenericProps<HTMLQuoteElement> & WrapAttributes<{
  cite?: string;
}>;

type ButtonAttributes = GenericProps<HTMLButtonElement> & WrapAttributes<{
  disabled?: boolean;
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  name?: string;
  popovertarget?: string;
  popovertargetaction?: 'hide' | 'show' | 'toggle';
  type?: 'submit' | 'reset' | 'button';
  value?: string | number;
}>;

type CanvasAttributes = GenericProps<HTMLCanvasElement> & WrapAttributes<{
  height?: number | string;
  width?: number | string;
}>;

type ColumnAttributes = GenericProps<HTMLTableColElement> & WrapAttributes<{
  span?: number;
  width?: number | string;
}>;

type ColumnGroupAttributes = GenericProps<HTMLTableColElement> & WrapAttributes<{
  span?: number;
}>;

type DataAttributes = GenericProps<HTMLDataElement> & WrapAttributes<{
  value?: string | number;
}>;

type DeletedTextAttributes = GenericProps<HTMLModElement> & WrapAttributes<{
  cite?: string;
  datetime?: string;
}>;

type DetailsAttributes = GenericProps<HTMLDetailsElement> & WrapAttributes<{
  open?: boolean;
}>;

type DialogAttributes = GenericProps<HTMLDialogElement> & WrapAttributes<{
  open?: boolean;
}>;

type EmbedAttributes = GenericProps<HTMLEmbedElement> & WrapAttributes<{
  height?: number | string;
  src?: string;
  type?: string;
  width?: number | string;
}>;

type FieldsetAttributes = GenericProps<HTMLFieldSetElement> & WrapAttributes<{
  disabled?: boolean;
  form?: string;
  name?: string;
}>;

type FormAttributes = GenericProps<HTMLFormElement> & WrapAttributes<{
  'accept-charset'?: string;
  action?: string;
  autocomplete?: string;
  enctype?: string;
  method?: string;
  name?: string;
  novalidate?: boolean;
  rel?: string;
  target?: string;
}>;

type IframeAttributes = GenericProps<HTMLIFrameElement> & WrapAttributes<{
  allow?: string;
  allowFullScreen?: boolean;
  allowTransparency?: boolean;
  /** @deprecated */
  frameborder?: number | string;
  height?: number | string;
  loading?: 'eager' | 'lazy';
  /** @deprecated */
  marginHeight?: number;
  /** @deprecated */
  marginWidth?: number;
  name?: string;
  referrerpolicy?: ReferrerPolicy;
  sandbox?: string;
  /** @deprecated */
  scrolling?: string;
  seamless?: boolean;
  src?: string;
  srcdoc?: string;
  width?: number | string;
}>;

type ImageAttributes = GenericProps<HTMLImageElement> & WrapAttributes<{
  alt?: string;
  crossorigin?: CrossOrigin;
  decoding?: 'async' | 'auto' | 'sync';
  height?: number | string;
  loading?: 'eager' | 'lazy';
  referrerpolicy?: ReferrerPolicy;
  sizes?: string;
  src?: string;
  srcset?: string;
  usemap?: string;
  width?: number | string;
}>;

type InputAttributes = GenericProps<HTMLInputElement> & WrapAttributes<{
  accept?: string;
  alt?: string;
  autocomplete?: string;
  capture?: 'user' | 'environment';
  checked?: boolean;
  defaultChecked?: boolean;
  defaultValue?: string | number;
  disabled?: boolean;
  enterkeyhint?: EnterKeyHint;
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  height?: number | string;
  indeterminate?: boolean;
  list?: string;
  max?: number | string;
  maxlength?: number;
  min?: number | string;
  minlength?: number;
  multiple?: boolean;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  size?: number;
  src?: string;
  step?: number | string;
  type: InputType;
  value?: string | number;
  width?: number | string;
}>;

type InsertedTextAttributes = GenericProps<HTMLModElement> & WrapAttributes<{
  cite?: string;
  datetime?: string;
}>;

type KeygenAttributes = GenericProps<HTMLUnknownElement> & WrapAttributes<{
  challenge?: string;
  disabled?: boolean;
  form?: string;
  keyType?: string;
  keyParams?: string;
  name?: string;
}>;

type LabelAttributes = GenericProps<HTMLLabelElement> & WrapAttributes<{
  for?: string;
  form?: string;
  htmlFor?: string;
}>;

type ListItemAttributes = GenericProps<HTMLLIElement> & WrapAttributes<{
  value?: string | number;
}>;

type LinkAttributes = GenericProps<HTMLLinkElement> & WrapAttributes<{
  as?: string;
  crossorigin?: CrossOrigin;
  fetchPriority?: 'high' | 'low' | 'auto';
  href?: string;
  hreflang?: string;
  integrity?: string;
  media?: string;
  imageSrcSet?: string;
  referrerpolicy?: ReferrerPolicy;
  rel?: string;
  sizes?: string;
  type?: string;
  charset?: string;
}>;

type MapAttributes = GenericProps<HTMLMapElement> & WrapAttributes<{
  name?: string;
}>;

type MarqueeAttributes = GenericProps<HTMLMarqueeElement> & WrapAttributes<{
  behavior?: 'scroll' | 'slide' | 'alternate';
  bgColor?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  height?: number | string;
  hspace?: number | string;
  loop?: number | string;
  scrollAmount?: number | string;
  scrollDelay?: number | string;
  trueSpeed?: boolean;
  vspace?: number | string;
  width?: number | string;
}>;

type MediaHTMLAttributes<T extends EventTarget> = GenericProps<T> & WrapAttributes<{
  autoplay?: boolean;
  controls?: boolean;
  controlsList?: string;
  crossorigin?: CrossOrigin;
  loop?: boolean;
  mediaGroup?: string;
  muted?: boolean;
  playsinline?: boolean;
  preload?: string;
  src?: string;
  volume?: string | number;
}>;

type MenuAttributes = GenericProps<HTMLMenuElement> & WrapAttributes<{
  type?: string;
}>;

type MetaAttributes = GenericProps<HTMLMetaElement> & WrapAttributes<{
  charset?: string;
  content?: string;
  'http-equiv'?: string;
  name?: string;
  media?: string;
}>;

type MeterAttributes = GenericProps<HTMLMeterElement> & WrapAttributes<{
  form?: string;
  high?: number;
  low?: number;
  max?: number | string;
  min?: number | string;
  optimum?: number;
  value?: string | number;
}>;

type ObjectAttributes = GenericProps<HTMLObjectElement> & WrapAttributes<{
  classID?: string;
  data?: string;
  form?: string;
  height?: number | string;
  name?: string;
  type?: string;
  usemap?: string;
  width?: number | string;
  wmode?: string;
}>;

type OrderedListAttributes = GenericProps<HTMLOListElement> & WrapAttributes<{
  reversed?: boolean;
  start?: number;
  type?: '1' | 'a' | 'A' | 'i' | 'I';
}>;

type OptionGroupAttributes = GenericProps<HTMLOptGroupElement> & WrapAttributes<{
  disabled?: boolean;
  label?: string;
}>;

type OptionAttributes = GenericProps<HTMLOptionElement> & WrapAttributes<{
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string | number;
}>;

type OutputAttributes = GenericProps<HTMLOutputElement> & WrapAttributes<{
  for?: string;
  form?: string;
  htmlFor?: string;
  name?: string;
}>;

type ParamAttributes = GenericProps<HTMLParamElement> & WrapAttributes<{
  name?: string;
  value?: string | number;
}>;

type ProgressAttributes = GenericProps<HTMLProgressElement> & WrapAttributes<{
  max?: number | string;
  value?: string | number;
}>;

type QuoteAttributes = GenericProps<HTMLQuoteElement> & WrapAttributes<{
  cite?: string;
}>;

type ScriptAttributes = GenericProps<HTMLScriptElement> & WrapAttributes<{
  async?: boolean;
  /** @deprecated See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#charset */
  charset?: string;
  crossorigin?: CrossOrigin;
  defer?: boolean;
  integrity?: string;
  /** @deprecated See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#language */
  language?: string;
  nomodule?: boolean;
  referrerpolicy?: ReferrerPolicy;
  src?: string;
  type?: string;
}>;

type SelectAttributes = GenericProps<HTMLSelectElement> & WrapAttributes<{
  autocomplete?: string;
  defaultValue?: string | number;
  disabled?: boolean;
  form?: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
  size?: number;
  value?: string | number;
}>;

type SlotAttributes = GenericProps<HTMLSlotElement> & WrapAttributes<{
  name?: string;
}>;

type SourceAttributes = GenericProps<HTMLSourceElement> & WrapAttributes<{
  height?: number | string;
  media?: string;
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
  width?: number | string;
}>;

type StyleAttributes = GenericProps<HTMLStyleElement> & WrapAttributes<{
  media?: string;
  scoped?: boolean;
  type?: string;
}>;

type TableAttributes = GenericProps<HTMLTableElement> & WrapAttributes<{
  cellPadding?: string;
  cellSpacing?: string;
  summary?: string;
  width?: number | string;
}>;

type TableDataAttributes = GenericProps<HTMLTableCellElement> & WrapAttributes<{
  align?: Align;
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: string;
  abbr?: string;
  height?: number | string;
  width?: number | string;
  valign?: VerticalAlign;
}>;

type TextareaAttributes = GenericProps<HTMLTextAreaElement> & WrapAttributes<{
  autocomplete?: string;
  cols?: number;
  defaultValue?: string;
  dirName?: string;
  disabled?: boolean;
  form?: string;
  maxlength?: number;
  minlength?: number;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  value?: string | number;
  wrap?: string;
}>;

type TableHeaderAttributes = GenericProps<HTMLTableCellElement> & WrapAttributes<{
  align?: Align;
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: string;
  abbr?: string;
}>;

type TimeAttributes = GenericProps<HTMLTimeElement> & WrapAttributes<{
  datetime?: string;
}>;

type TrackAttributes = MediaHTMLAttributes<HTMLTrackElement> & WrapAttributes<{
  default?: boolean;
  kind?: string;
  label?: string;
  srclang?: string;
}>;

type VideoAttributes = MediaHTMLAttributes<HTMLVideoElement> & WrapAttributes<{
  height?: number | string;
  poster?: string;
  width?: number | string;
  disablePictureInPicture?: boolean;
  disableRemotePlayback?: boolean;
}>;

export interface IntrinsicHTMLElements {
  a: AnchorAttributes;
  abbr: GenericProps<HTMLElement>;
  address: GenericProps<HTMLElement>;
  area: AreaAttributes;
  article: GenericProps<HTMLElement>;
  aside: GenericProps<HTMLElement>;
  audio: MediaHTMLAttributes<HTMLAudioElement>;
  b: GenericProps<HTMLElement>;
  base: BaseAttributes;
  bdi: GenericProps<HTMLElement>;
  bdo: GenericProps<HTMLElement>;
  big: GenericProps<HTMLElement>;
  blockquote: BlockquoteAttributes;
  body: GenericProps<HTMLBodyElement>;
  br: GenericProps<HTMLBRElement>;
  button: ButtonAttributes;
  canvas: CanvasAttributes;
  caption: GenericProps<HTMLTableCaptionElement>;
  cite: GenericProps<HTMLElement>;
  code: GenericProps<HTMLElement>;
  col: ColumnAttributes;
  colgroup: ColumnGroupAttributes;
  data: DataAttributes;
  datalist: GenericProps<HTMLDataListElement>;
  dd: GenericProps<HTMLElement>;
  del: DeletedTextAttributes;
  details: DetailsAttributes;
  dfn: GenericProps<HTMLElement>;
  dialog: DialogAttributes;
  div: GenericProps<HTMLDivElement>;
  dl: GenericProps<HTMLDListElement>;
  dt: GenericProps<HTMLElement>;
  em: GenericProps<HTMLElement>;
  embed: EmbedAttributes;
  fieldset: FieldsetAttributes;
  figcaption: GenericProps<HTMLElement>;
  figure: GenericProps<HTMLElement>;
  footer: GenericProps<HTMLElement>;
  form: FormAttributes;
  h1: GenericProps<HTMLHeadingElement>;
  h2: GenericProps<HTMLHeadingElement>;
  h3: GenericProps<HTMLHeadingElement>;
  h4: GenericProps<HTMLHeadingElement>;
  h5: GenericProps<HTMLHeadingElement>;
  h6: GenericProps<HTMLHeadingElement>;
  head: GenericProps<HTMLHeadElement>;
  header: GenericProps<HTMLElement>;
  hgroup: GenericProps<HTMLElement>;
  hr: GenericProps<HTMLHRElement>;
  html: GenericProps<HTMLHtmlElement>;
  i: GenericProps<HTMLElement>;
  iframe: IframeAttributes;
  img: ImageAttributes;
  input: InputAttributes;
  ins: InsertedTextAttributes;
  kbd: GenericProps<HTMLElement>;
  keygen: KeygenAttributes;
  label: LabelAttributes;
  legend: GenericProps<HTMLLegendElement>;
  li: ListItemAttributes;
  link: LinkAttributes;
  main: GenericProps<HTMLElement>;
  map: MapAttributes;
  mark: GenericProps<HTMLElement>;
  /** @deprecated See: https://developer.mozilla.org/docs/Web/API/HTMLMarqueeElement */
  marquee: MarqueeAttributes;
  menu: MenuAttributes;
  menuitem: GenericProps<HTMLUnknownElement>;
  meta: MetaAttributes;
  meter: MeterAttributes;
  nav: GenericProps<HTMLElement>;
  noscript: GenericProps<HTMLElement>;
  object: ObjectAttributes;
  ol: OrderedListAttributes;
  optgroup: OptionGroupAttributes;
  option: OptionAttributes;
  output: OutputAttributes;
  p: GenericProps<HTMLParagraphElement>;
  /** @deprecated See: https://developer.mozilla.org/docs/Web/API/HTMLParamElement */
  param: ParamAttributes;
  picture: GenericProps<HTMLPictureElement>;
  pre: GenericProps<HTMLPreElement>;
  progress: ProgressAttributes;
  q: QuoteAttributes;
  rp: GenericProps<HTMLElement>;
  rt: GenericProps<HTMLElement>;
  ruby: GenericProps<HTMLElement>;
  s: GenericProps<HTMLElement>;
  samp: GenericProps<HTMLElement>;
  script: ScriptAttributes;
  search: GenericProps<HTMLElement>;
  section: GenericProps<HTMLElement>;
  select: SelectAttributes;
  slot: SlotAttributes;
  small: GenericProps<HTMLElement>;
  source: SourceAttributes;
  span: GenericProps<HTMLSpanElement>;
  strong: GenericProps<HTMLElement>;
  style: StyleAttributes;
  sub: GenericProps<HTMLElement>;
  summary: GenericProps<HTMLElement>;
  sup: GenericProps<HTMLElement>;
  table: TableAttributes;
  tbody: GenericProps<HTMLTableSectionElement>;
  td: TableDataAttributes;
  template: GenericProps<HTMLTemplateElement>;
  textarea: TextareaAttributes;
  tfoot: GenericProps<HTMLTableSectionElement>;
  th: TableHeaderAttributes;
  thead: GenericProps<HTMLTableSectionElement>;
  time: TimeAttributes;
  title: GenericProps<HTMLTitleElement>;
  tr: GenericProps<HTMLTableRowElement>;
  track: TrackAttributes;
  u: GenericProps<HTMLElement>;
  ul: GenericProps<HTMLUListElement>;
  var: GenericProps<HTMLElement>;
  video: VideoAttributes;
  wbr: GenericProps<HTMLElement>;
}
