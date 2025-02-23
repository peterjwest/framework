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

export interface Props<Target extends EventTarget> {
  children?: ComponentChildren;
  events?: EventProp<Target>;
}

/** Attributes common to all HTML elements */
type GenericAttributes<T extends EventTarget> = Props<T> & WrapAttributes<AriaAttributes & {
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


type AnchorAttributes = GenericAttributes<HTMLAnchorElement> & WrapAttributes<{
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

type AreaAttributes = GenericAttributes<HTMLAreaElement> & WrapAttributes<{
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

type BaseAttributes = GenericAttributes<HTMLBaseElement> & WrapAttributes<{
  href?: string;
  target?: string;
}>;

type BlockquoteAttributes = GenericAttributes<HTMLQuoteElement> & WrapAttributes<{
  cite?: string;
}>;

type ButtonAttributes = GenericAttributes<HTMLButtonElement> & WrapAttributes<{
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

type CanvasAttributes = GenericAttributes<HTMLCanvasElement> & WrapAttributes<{
  height?: number | string;
  width?: number | string;
}>;

type ColumnAttributes = GenericAttributes<HTMLTableColElement> & WrapAttributes<{
  span?: number;
  width?: number | string;
}>;

type ColumnGroupAttributes = GenericAttributes<HTMLTableColElement> & WrapAttributes<{
  span?: number;
}>;

type DataAttributes = GenericAttributes<HTMLDataElement> & WrapAttributes<{
  value?: string | number;
}>;

type DeletedTextAttributes = GenericAttributes<HTMLModElement> & WrapAttributes<{
  cite?: string;
  datetime?: string;
}>;

type DetailsAttributes = GenericAttributes<HTMLDetailsElement> & WrapAttributes<{
  open?: boolean;
}>;

type DialogAttributes = GenericAttributes<HTMLDialogElement> & WrapAttributes<{
  open?: boolean;
}>;

type EmbedAttributes = GenericAttributes<HTMLEmbedElement> & WrapAttributes<{
  height?: number | string;
  src?: string;
  type?: string;
  width?: number | string;
}>;

type FieldsetAttributes = GenericAttributes<HTMLFieldSetElement> & WrapAttributes<{
  disabled?: boolean;
  form?: string;
  name?: string;
}>;

type FormAttributes = GenericAttributes<HTMLFormElement> & WrapAttributes<{
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

type IframeAttributes = GenericAttributes<HTMLIFrameElement> & WrapAttributes<{
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

type ImageAttributes = GenericAttributes<HTMLImageElement> & WrapAttributes<{
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

type InputAttributes = GenericAttributes<HTMLInputElement> & WrapAttributes<{
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
  type?: InputType;
  value?: string | number;
  width?: number | string;
}>;

type InsertedTextAttributes = GenericAttributes<HTMLModElement> & WrapAttributes<{
  cite?: string;
  datetime?: string;
}>;

type KeygenAttributes = GenericAttributes<HTMLUnknownElement> & WrapAttributes<{
  challenge?: string;
  disabled?: boolean;
  form?: string;
  keyType?: string;
  keyParams?: string;
  name?: string;
}>;

type LabelAttributes = GenericAttributes<HTMLLabelElement> & WrapAttributes<{
  for?: string;
  form?: string;
  htmlFor?: string;
}>;

type ListItemAttributes = GenericAttributes<HTMLLIElement> & WrapAttributes<{
  value?: string | number;
}>;

type LinkAttributes = GenericAttributes<HTMLLinkElement> & WrapAttributes<{
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

type MapAttributes = GenericAttributes<HTMLMapElement> & WrapAttributes<{
  name?: string;
}>;

type MarqueeAttributes = GenericAttributes<HTMLMarqueeElement> & WrapAttributes<{
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

type MediaHTMLAttributes<T extends EventTarget> = GenericAttributes<T> & WrapAttributes<{
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

type MenuAttributes = GenericAttributes<HTMLMenuElement> & WrapAttributes<{
  type?: string;
}>;

type MetaAttributes = GenericAttributes<HTMLMetaElement> & WrapAttributes<{
  charset?: string;
  content?: string;
  'http-equiv'?: string;
  name?: string;
  media?: string;
}>;

type MeterAttributes = GenericAttributes<HTMLMeterElement> & WrapAttributes<{
  form?: string;
  high?: number;
  low?: number;
  max?: number | string;
  min?: number | string;
  optimum?: number;
  value?: string | number;
}>;

type ObjectAttributes = GenericAttributes<HTMLObjectElement> & WrapAttributes<{
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

type OrderedListAttributes = GenericAttributes<HTMLOListElement> & WrapAttributes<{
  reversed?: boolean;
  start?: number;
  type?: '1' | 'a' | 'A' | 'i' | 'I';
}>;

type OptionGroupAttributes = GenericAttributes<HTMLOptGroupElement> & WrapAttributes<{
  disabled?: boolean;
  label?: string;
}>;

type OptionAttributes = GenericAttributes<HTMLOptionElement> & WrapAttributes<{
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string | number;
}>;

type OutputAttributes = GenericAttributes<HTMLOutputElement> & WrapAttributes<{
  for?: string;
  form?: string;
  htmlFor?: string;
  name?: string;
}>;

type ParamAttributes = GenericAttributes<HTMLParamElement> & WrapAttributes<{
  name?: string;
  value?: string | number;
}>;

type ProgressAttributes = GenericAttributes<HTMLProgressElement> & WrapAttributes<{
  max?: number | string;
  value?: string | number;
}>;

type QuoteAttributes = GenericAttributes<HTMLQuoteElement> & WrapAttributes<{
  cite?: string;
}>;

type ScriptAttributes = GenericAttributes<HTMLScriptElement> & WrapAttributes<{
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

type SelectAttributes = GenericAttributes<HTMLSelectElement> & WrapAttributes<{
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

type SlotAttributes = GenericAttributes<HTMLSlotElement> & WrapAttributes<{
  name?: string;
}>;

type SourceAttributes = GenericAttributes<HTMLSourceElement> & WrapAttributes<{
  height?: number | string;
  media?: string;
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
  width?: number | string;
}>;

type StyleAttributes = GenericAttributes<HTMLStyleElement> & WrapAttributes<{
  media?: string;
  scoped?: boolean;
  type?: string;
}>;

type TableAttributes = GenericAttributes<HTMLTableElement> & WrapAttributes<{
  cellPadding?: string;
  cellSpacing?: string;
  summary?: string;
  width?: number | string;
}>;

type TableDataAttributes = GenericAttributes<HTMLTableCellElement> & WrapAttributes<{
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

type TextareaAttributes = GenericAttributes<HTMLTextAreaElement> & WrapAttributes<{
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

type TableHeaderAttributes = GenericAttributes<HTMLTableCellElement> & WrapAttributes<{
  align?: Align;
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: string;
  abbr?: string;
}>;

type TimeAttributes = GenericAttributes<HTMLTimeElement> & WrapAttributes<{
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
  abbr: GenericAttributes<HTMLElement>;
  address: GenericAttributes<HTMLElement>;
  area: AreaAttributes;
  article: GenericAttributes<HTMLElement>;
  aside: GenericAttributes<HTMLElement>;
  audio: MediaHTMLAttributes<HTMLAudioElement>;
  b: GenericAttributes<HTMLElement>;
  base: BaseAttributes;
  bdi: GenericAttributes<HTMLElement>;
  bdo: GenericAttributes<HTMLElement>;
  big: GenericAttributes<HTMLElement>;
  blockquote: BlockquoteAttributes;
  body: GenericAttributes<HTMLBodyElement>;
  br: GenericAttributes<HTMLBRElement>;
  button: ButtonAttributes;
  canvas: CanvasAttributes;
  caption: GenericAttributes<HTMLTableCaptionElement>;
  cite: GenericAttributes<HTMLElement>;
  code: GenericAttributes<HTMLElement>;
  col: ColumnAttributes;
  colgroup: ColumnGroupAttributes;
  data: DataAttributes;
  datalist: GenericAttributes<HTMLDataListElement>;
  dd: GenericAttributes<HTMLElement>;
  del: DeletedTextAttributes;
  details: DetailsAttributes;
  dfn: GenericAttributes<HTMLElement>;
  dialog: DialogAttributes;
  div: GenericAttributes<HTMLDivElement>;
  dl: GenericAttributes<HTMLDListElement>;
  dt: GenericAttributes<HTMLElement>;
  em: GenericAttributes<HTMLElement>;
  embed: EmbedAttributes;
  fieldset: FieldsetAttributes;
  figcaption: GenericAttributes<HTMLElement>;
  figure: GenericAttributes<HTMLElement>;
  footer: GenericAttributes<HTMLElement>;
  form: FormAttributes;
  h1: GenericAttributes<HTMLHeadingElement>;
  h2: GenericAttributes<HTMLHeadingElement>;
  h3: GenericAttributes<HTMLHeadingElement>;
  h4: GenericAttributes<HTMLHeadingElement>;
  h5: GenericAttributes<HTMLHeadingElement>;
  h6: GenericAttributes<HTMLHeadingElement>;
  head: GenericAttributes<HTMLHeadElement>;
  header: GenericAttributes<HTMLElement>;
  hgroup: GenericAttributes<HTMLElement>;
  hr: GenericAttributes<HTMLHRElement>;
  html: GenericAttributes<HTMLHtmlElement>;
  i: GenericAttributes<HTMLElement>;
  iframe: IframeAttributes;
  img: ImageAttributes;
  input: InputAttributes;
  ins: InsertedTextAttributes;
  kbd: GenericAttributes<HTMLElement>;
  keygen: KeygenAttributes;
  label: LabelAttributes;
  legend: GenericAttributes<HTMLLegendElement>;
  li: ListItemAttributes;
  link: LinkAttributes;
  main: GenericAttributes<HTMLElement>;
  map: MapAttributes;
  mark: GenericAttributes<HTMLElement>;
  /** @deprecated See: https://developer.mozilla.org/docs/Web/API/HTMLMarqueeElement */
  marquee: MarqueeAttributes;
  menu: MenuAttributes;
  menuitem: GenericAttributes<HTMLUnknownElement>;
  meta: MetaAttributes;
  meter: MeterAttributes;
  nav: GenericAttributes<HTMLElement>;
  noscript: GenericAttributes<HTMLElement>;
  object: ObjectAttributes;
  ol: OrderedListAttributes;
  optgroup: OptionGroupAttributes;
  option: OptionAttributes;
  output: OutputAttributes;
  p: GenericAttributes<HTMLParagraphElement>;
  /** @deprecated See: https://developer.mozilla.org/docs/Web/API/HTMLParamElement */
  param: ParamAttributes;
  picture: GenericAttributes<HTMLPictureElement>;
  pre: GenericAttributes<HTMLPreElement>;
  progress: ProgressAttributes;
  q: QuoteAttributes;
  rp: GenericAttributes<HTMLElement>;
  rt: GenericAttributes<HTMLElement>;
  ruby: GenericAttributes<HTMLElement>;
  s: GenericAttributes<HTMLElement>;
  samp: GenericAttributes<HTMLElement>;
  script: ScriptAttributes;
  search: GenericAttributes<HTMLElement>;
  section: GenericAttributes<HTMLElement>;
  select: SelectAttributes;
  slot: SlotAttributes;
  small: GenericAttributes<HTMLElement>;
  source: SourceAttributes;
  span: GenericAttributes<HTMLSpanElement>;
  strong: GenericAttributes<HTMLElement>;
  style: StyleAttributes;
  sub: GenericAttributes<HTMLElement>;
  summary: GenericAttributes<HTMLElement>;
  sup: GenericAttributes<HTMLElement>;
  table: TableAttributes;
  tbody: GenericAttributes<HTMLTableSectionElement>;
  td: TableDataAttributes;
  template: GenericAttributes<HTMLTemplateElement>;
  textarea: TextareaAttributes;
  tfoot: GenericAttributes<HTMLTableSectionElement>;
  th: TableHeaderAttributes;
  thead: GenericAttributes<HTMLTableSectionElement>;
  time: TimeAttributes;
  title: GenericAttributes<HTMLTitleElement>;
  tr: GenericAttributes<HTMLTableRowElement>;
  track: TrackAttributes;
  u: GenericAttributes<HTMLElement>;
  ul: GenericAttributes<HTMLUListElement>;
  var: GenericAttributes<HTMLElement>;
  video: VideoAttributes;
  wbr: GenericAttributes<HTMLElement>;
}
