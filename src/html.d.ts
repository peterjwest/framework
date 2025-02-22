import { ComponentChildren } from './jsx';
import { MaybeValue } from './value';
import { TargetedEvent, MapValue, OmitMethods } from './util';
import { AriaRole, AriaAttributes } from './aria';

type Attributes = {};

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

type AnchorTarget = '_self' | '_blank' | '_parent' | '_top';

type Autocapitalize = (
  'off' |
  'none' |
  'on' |
  'sentences' |
  'words' |
  'characters'
);

type EnterKeyHint = (
  'enter' |
  'done' |
  'go' |
  'next' |
  'previous' |
  'search' |
  'send'
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

type CrossOrigin = 'anonymous' | 'use-credentials';
type Align = 'left' | 'center' | 'right' | 'justify' | 'char';
type VerticalAlign = 'top' | 'middle' | 'bottom' | 'baseline';

type DOMCSSProperties = MapValue<Partial<OmitMethods<CSSStyleDeclaration>>, string | number | null>;
type AllCSSProperties = { [key: string]: string | number | null | undefined };
type CSSProperties = AllCSSProperties & DOMCSSProperties & { cssText?: string | null };

export interface DOMAttributes<Target extends EventTarget> {
  children?: ComponentChildren;
  events?: EventProp<Target>;
}

// export interface AllHTMLAttributes<RefType extends EventTarget = EventTarget>
// extends Attributes, DOMAttributes<RefType>, AriaAttributes {
//   // Standard HTML Attributes
//   accept?: MaybeValue<string | undefined>;
//   acceptCharset?: MaybeValue<string | undefined>;
//   'accept-charset'?: MaybeValue<string | undefined>;
//   accessKey?: MaybeValue<string | undefined>;
//   accesskey?: MaybeValue<string | undefined>;
//   action?: MaybeValue<string | undefined>;
//   allow?: MaybeValue<string | undefined>;
//   allowFullScreen?: MaybeValue<boolean | undefined>;
//   allowTransparency?: MaybeValue<boolean | undefined>;
//   alt?: MaybeValue<string | undefined>;
//   as?: MaybeValue<string | undefined>;
//   async?: MaybeValue<boolean | undefined>;
//   autocomplete?: MaybeValue<string | undefined>;
//   autoComplete?: MaybeValue<string | undefined>;
//   autocorrect?: MaybeValue<string | undefined>;
//   autoCorrect?: MaybeValue<string | undefined>;
//   autofocus?: MaybeValue<boolean | undefined>;
//   autoFocus?: MaybeValue<boolean | undefined>;
//   autoPlay?: MaybeValue<boolean | undefined>;
//   autoplay?: MaybeValue<boolean | undefined>;
//   capture?: MaybeValue<boolean | string | undefined>;
//   cellPadding?: MaybeValue<number | string | undefined>;
//   cellSpacing?: MaybeValue<number | string | undefined>;
//   charset?: MaybeValue<string | undefined>;
//   challenge?: MaybeValue<string | undefined>;
//   checked?: MaybeValue<boolean | undefined>;
//   cite?: MaybeValue<string | undefined>;
//   class?: MaybeValue<string | undefined>;
//   cols?: MaybeValue<number | undefined>;
//   colspan?: MaybeValue<number | undefined>;
//   content?: MaybeValue<string | undefined>;
//   contenteditable?: MaybeValue<boolean | '' | 'plaintext-only' | 'inherit' | undefined>;
//   /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contextmenu */
//   contextMenu?: MaybeValue<string | undefined>;
//   /** @deprecated See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contextmenu */
//   contextmenu?: MaybeValue<string | undefined>;
//   controls?: MaybeValue<boolean | undefined>;
//   controlsList?: MaybeValue<string | undefined>;
//   coords?: MaybeValue<string | undefined>;
//   crossorigin?: MaybeValue<string | undefined>;
//   data?: MaybeValue<string | undefined>;
//   dateTime?: MaybeValue<string | undefined>;
//   datetime?: MaybeValue<string | undefined>;
//   default?: MaybeValue<boolean | undefined>;
//   defaultChecked?: MaybeValue<boolean | undefined>;
//   defaultValue?: MaybeValue<string | undefined>;
//   defer?: MaybeValue<boolean | undefined>;
//   dir?: MaybeValue<'auto' | 'rtl' | 'ltr' | undefined>;
//   disabled?: MaybeValue<boolean | undefined>;
//   disableRemotePlayback?: MaybeValue<boolean | undefined>;
//   download?: MaybeValue<any | undefined>;
//   decoding?: MaybeValue<'sync' | 'async' | 'auto' | undefined>;
//   draggable?: MaybeValue<boolean | undefined>;
//   encType?: MaybeValue<string | undefined>;
//   enctype?: MaybeValue<string | undefined>;
//   enterkeyhint?: MaybeValue<EnterKeyHint | undefined>;
//   elementtiming?: MaybeValue<string | undefined>;
//   exportparts?: MaybeValue<string | undefined>;
//   for?: MaybeValue<string | undefined>;
//   form?: MaybeValue<string | undefined>;
//   formaction?: MaybeValue<string | undefined>;
//   formenctype?: MaybeValue<string | undefined>;
//   formmethod?: MaybeValue<string | undefined>;
//   formnovalidate?: MaybeValue<boolean | undefined>;
//   formtarget?: MaybeValue<string | undefined>;
//   frameborder?: MaybeValue<number | string | undefined>;
//   headers?: MaybeValue<string | undefined>;
//   height?: MaybeValue<number | string | undefined>;
//   hidden?: MaybeValue<boolean | 'hidden' | 'until-found' | undefined>;
//   high?: MaybeValue<number | undefined>;
//   href?: MaybeValue<string | undefined>;
//   hrefLang?: MaybeValue<string | undefined>;
//   hreflang?: MaybeValue<string | undefined>;
//   htmlFor?: MaybeValue<string | undefined>;
//   'http-equiv'?: MaybeValue<string | undefined>;
//   icon?: MaybeValue<string | undefined>;
//   id?: MaybeValue<string | undefined>;
//   indeterminate?: MaybeValue<boolean | undefined>;
//   inert?: MaybeValue<boolean | undefined>;
//   inputMode?: MaybeValue<string | undefined>;
//   inputmode?: MaybeValue<string | undefined>;
//   integrity?: MaybeValue<string | undefined>;
//   is?: MaybeValue<string | undefined>;
//   keyParams?: MaybeValue<string | undefined>;
//   keyType?: MaybeValue<string | undefined>;
//   kind?: MaybeValue<string | undefined>;
//   label?: MaybeValue<string | undefined>;
//   lang?: MaybeValue<string | undefined>;
//   list?: MaybeValue<string | undefined>;
//   loading?: MaybeValue<'eager' | 'lazy' | undefined>;
//   loop?: MaybeValue<boolean | undefined>;
//   low?: MaybeValue<number | undefined>;
//   manifest?: MaybeValue<string | undefined>;
//   marginHeight?: MaybeValue<number | undefined>;
//   marginWidth?: MaybeValue<number | undefined>;
//   max?: MaybeValue<number | string | undefined>;
//   maxlength?: MaybeValue<number | undefined>;
//   media?: MaybeValue<string | undefined>;
//   mediaGroup?: MaybeValue<string | undefined>;
//   method?: MaybeValue<string | undefined>;
//   min?: MaybeValue<number | string | undefined>;
//   minlength?: MaybeValue<number | undefined>;
//   multiple?: MaybeValue<boolean | undefined>;
//   muted?: MaybeValue<boolean | undefined>;
//   name?: MaybeValue<string | undefined>;
//   nomodule?: MaybeValue<boolean | undefined>;
//   nonce?: MaybeValue<string | undefined>;
//   noValidate?: MaybeValue<boolean | undefined>;
//   novalidate?: MaybeValue<boolean | undefined>;
//   open?: MaybeValue<boolean | undefined>;
//   optimum?: MaybeValue<number | undefined>;
//   part?: MaybeValue<string | undefined>;
//   pattern?: MaybeValue<string | undefined>;
//   ping?: MaybeValue<string | undefined>;
//   placeholder?: MaybeValue<string | undefined>;
//   playsinline?: MaybeValue<boolean | undefined>;
//   popover?: MaybeValue<'auto' | 'hint' | 'manual' | boolean | undefined>;
//   popovertarget?: MaybeValue<string | undefined>;
//   popoverTarget?: MaybeValue<string | undefined>;
//   popovertargetaction?: MaybeValue<'hide' | 'show' | 'toggle' | undefined>;
//   popoverTargetAction?: MaybeValue<'hide' | 'show' | 'toggle' | undefined>;
//   poster?: MaybeValue<string | undefined>;
//   preload?: MaybeValue<string | undefined>;
//   radioGroup?: MaybeValue<string | undefined>;
//   readonly?: MaybeValue<boolean | undefined>;
//   readOnly?: MaybeValue<boolean | undefined>;
//   referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
//   rel?: MaybeValue<string | undefined>;
//   required?: MaybeValue<boolean | undefined>;
//   reversed?: MaybeValue<boolean | undefined>;
//   role?: MaybeValue<AriaRole | undefined>;
//   rows?: MaybeValue<number | undefined>;
//   rowspan?: MaybeValue<number | undefined>;
//   sandbox?: MaybeValue<string | undefined>;
//   scope?: MaybeValue<string | undefined>;
//   scoped?: MaybeValue<boolean | undefined>;
//   scrolling?: MaybeValue<string | undefined>;
//   seamless?: MaybeValue<boolean | undefined>;
//   selected?: MaybeValue<boolean | undefined>;
//   shape?: MaybeValue<string | undefined>;
//   size?: MaybeValue<number | undefined>;
//   sizes?: MaybeValue<string | undefined>;
//   slot?: MaybeValue<string | undefined>;
//   span?: MaybeValue<number | undefined>;
//   spellcheck?: MaybeValue<boolean | undefined>;
//   src?: MaybeValue<string | undefined>;
//   srcSet?: MaybeValue<string | undefined>;
//   srcset?: MaybeValue<string | undefined>;
//   srcDoc?: MaybeValue<string | undefined>;
//   srcdoc?: MaybeValue<string | undefined>;
//   srcLang?: MaybeValue<string | undefined>;
//   srclang?: MaybeValue<string | undefined>;
//   start?: MaybeValue<number | undefined>;
//   step?: MaybeValue<number | string | undefined>;
//   style?: MaybeValue<string | CSSProperties | undefined>;
//   summary?: MaybeValue<string | undefined>;
//   tabIndex?: MaybeValue<number | undefined>;
//   tabindex?: MaybeValue<number | undefined>;
//   target?: MaybeValue<string | undefined>;
//   title?: MaybeValue<string | undefined>;
//   type?: MaybeValue<string | undefined>;
//   usemap?: MaybeValue<string | undefined>;
//   value?: MaybeValue<string | string[] | number | undefined>;
//   volume?: MaybeValue<string | number | undefined>;
//   width?: MaybeValue<number | string | undefined>;
//   wmode?: MaybeValue<string | undefined>;
//   wrap?: MaybeValue<string | undefined>;

//   // Non-standard Attributes
//   autocapitalize?: MaybeValue<Autocapitalize | undefined>;
//   disablePictureInPicture?: MaybeValue<boolean | undefined>;
//   results?: MaybeValue<number | undefined>;
//   translate?: MaybeValue<boolean | undefined>;

//   // RDFa Attributes
//   about?: MaybeValue<string | undefined>;
//   datatype?: MaybeValue<string | undefined>;
//   inlist?: MaybeValue<any>;
//   prefix?: MaybeValue<string | undefined>;
//   property?: MaybeValue<string | undefined>;
//   resource?: MaybeValue<string | undefined>;
//   typeof?: MaybeValue<string | undefined>;
//   vocab?: MaybeValue<string | undefined>;

//   // Microdata Attributes
//   itemProp?: MaybeValue<string | undefined>;
//   itemprop?: MaybeValue<string | undefined>;
//   itemScope?: MaybeValue<boolean | undefined>;
//   itemscope?: MaybeValue<boolean | undefined>;
//   itemType?: MaybeValue<string | undefined>;
//   itemtype?: MaybeValue<string | undefined>;
//   itemID?: MaybeValue<string | undefined>;
//   itemid?: MaybeValue<string | undefined>;
//   itemRef?: MaybeValue<string | undefined>;
//   itemref?: MaybeValue<string | undefined>;
// }

export interface HTMLAttributes<RefType extends EventTarget = EventTarget>
extends Attributes, DOMAttributes<RefType>, AriaAttributes {
  // Standard HTML Attributes
  accesskey?: MaybeValue<string | undefined>;
  autocapitalize?: MaybeValue<MaybeValue<Autocapitalize | undefined>>;
  autocorrect?: MaybeValue<string | undefined>;
  autofocus?: MaybeValue<boolean | undefined>;
  class?: MaybeValue<string | undefined>;
  contenteditable?: MaybeValue<boolean | '' | 'plaintext-only' | 'inherit' | undefined>;
  dir?: MaybeValue<'auto' | 'rtl' | 'ltr' | undefined>;
  draggable?: MaybeValue<boolean | undefined>;
  enterkeyhint?: MaybeValue<EnterKeyHint | undefined>;
  exportparts?: MaybeValue<string | undefined>;
  hidden?: MaybeValue<boolean | 'hidden' | 'until-found' | undefined>;
  id?: MaybeValue<string | undefined>;
  inert?: MaybeValue<boolean | undefined>;
  inputmode?: MaybeValue<string | undefined>;
  inputMode?: MaybeValue<string | undefined>;
  is?: MaybeValue<string | undefined>;
  lang?: MaybeValue<string | undefined>;
  nonce?: MaybeValue<string | undefined>;
  part?: MaybeValue<string | undefined>;
  popover?: MaybeValue<'auto' | 'hint' | 'manual' | boolean | undefined>;
  slot?: MaybeValue<string | undefined>;
  spellcheck?: MaybeValue<boolean | undefined>;
  style?: MaybeValue<string | CSSProperties | undefined>;
  tabindex?: MaybeValue<number | undefined>;
  tabIndex?: MaybeValue<number | undefined>;
  title?: MaybeValue<string | undefined>;
  translate?: MaybeValue<boolean | undefined>;

  // WAI-ARIA Attributes
  role?: MaybeValue<AriaRole | undefined>;

  // Non-standard Attributes
  disablePictureInPicture?: MaybeValue<boolean | undefined>;
  elementtiming?: MaybeValue<string | undefined>;
  elementTiming?: MaybeValue<string | undefined>;
  results?: MaybeValue<number | undefined>;

  // RDFa Attributes
  about?: MaybeValue<string | undefined>;
  datatype?: MaybeValue<string | undefined>;
  inlist?: MaybeValue<any>;
  prefix?: MaybeValue<string | undefined>;
  property?: MaybeValue<string | undefined>;
  resource?: MaybeValue<string | undefined>;
  typeof?: MaybeValue<string | undefined>;
  vocab?: MaybeValue<string | undefined>;

  // Microdata Attributes
  itemid?: MaybeValue<string | undefined>;
  itemID?: MaybeValue<string | undefined>;
  itemprop?: MaybeValue<string | undefined>;
  itemProp?: MaybeValue<string | undefined>;
  itemref?: MaybeValue<string | undefined>;
  itemRef?: MaybeValue<string | undefined>;
  itemscope?: MaybeValue<boolean | undefined>;
  itemScope?: MaybeValue<boolean | undefined>;
  itemtype?: MaybeValue<string | undefined>;
  itemType?: MaybeValue<string | undefined>;
}

interface AnchorHTMLAttributes<T extends EventTarget = HTMLAnchorElement> extends HTMLAttributes<T> {
  download?: MaybeValue<any>;
  href?: MaybeValue<string | undefined>;
  hreflang?: MaybeValue<string | undefined>;
  media?: MaybeValue<string | undefined>;
  ping?: MaybeValue<string | undefined>;
  rel?: MaybeValue<string | undefined>;
  target?: MaybeValue<AnchorTarget | undefined>;
  type?: MaybeValue<string | undefined>;
  referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
}

interface AreaHTMLAttributes<T extends EventTarget = HTMLAreaElement> extends HTMLAttributes<T> {
  alt?: MaybeValue<string | undefined>;
  coords?: MaybeValue<string | undefined>;
  download?: MaybeValue<any>;
  href?: MaybeValue<string | undefined>;
  hreflang?: MaybeValue<string | undefined>;
  media?: MaybeValue<string | undefined>;
  referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
  rel?: MaybeValue<string | undefined>;
  shape?: MaybeValue<string | undefined>;
  target?: MaybeValue<string | undefined>;
}

interface AudioHTMLAttributes<T extends EventTarget = HTMLAudioElement> extends MediaHTMLAttributes<T> {}

interface BaseHTMLAttributes<T extends EventTarget = HTMLBaseElement> extends HTMLAttributes<T> {
  href?: MaybeValue<string | undefined>;
  target?: MaybeValue<string | undefined>;
}

interface BlockquoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
  cite?: MaybeValue<string | undefined>;
}

interface ButtonHTMLAttributes<T extends EventTarget = HTMLButtonElement> extends HTMLAttributes<T> {
  disabled?: MaybeValue<boolean | undefined>;
  form?: MaybeValue<string | undefined>;
  formaction?: MaybeValue<string | undefined>;
  formenctype?: MaybeValue<string | undefined>;
  formmethod?: MaybeValue<string | undefined>;
  formnovalidate?: MaybeValue<boolean | undefined>;
  formtarget?: MaybeValue<string | undefined>;
  name?: MaybeValue<string | undefined>;
  popovertarget?: MaybeValue<string | undefined>;
  popovertargetaction?: MaybeValue<'hide' | 'show' | 'toggle' | undefined>;
  type?: MaybeValue<'submit' | 'reset' | 'button' | undefined>;
  value?: MaybeValue<string | number | undefined>;
}

interface CanvasHTMLAttributes<T extends EventTarget = HTMLCanvasElement> extends HTMLAttributes<T> {
  height?: MaybeValue<number | string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface ColHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
  span?: MaybeValue<number | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface ColgroupHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
  span?: MaybeValue<number | undefined>;
}

interface DataHTMLAttributes<T extends EventTarget = HTMLDataElement> extends HTMLAttributes<T> {
  value?: MaybeValue<string | number | undefined>;
}

interface DelHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
  cite?: MaybeValue<string | undefined>;
  datetime?: MaybeValue<string | undefined>;
}

interface DetailsHTMLAttributes<T extends EventTarget = HTMLDetailsElement> extends HTMLAttributes<T> {
  open?: MaybeValue<boolean | undefined>;
}

interface DialogHTMLAttributes<T extends EventTarget = HTMLDialogElement> extends HTMLAttributes<T> {
  open?: MaybeValue<boolean | undefined>;
}

interface EmbedHTMLAttributes<T extends EventTarget = HTMLEmbedElement> extends HTMLAttributes<T> {
  height?: MaybeValue<number | string | undefined>;
  src?: MaybeValue<string | undefined>;
  type?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface FieldsetHTMLAttributes<T extends EventTarget = HTMLFieldSetElement> extends HTMLAttributes<T> {
  disabled?: MaybeValue<boolean | undefined>;
  form?: MaybeValue<string | undefined>;
  name?: MaybeValue<string | undefined>;
}

interface FormHTMLAttributes<T extends EventTarget = HTMLFormElement> extends HTMLAttributes<T> {
  'accept-charset'?: MaybeValue<string | undefined>;
  action?: MaybeValue<string | undefined>;
  autocomplete?: MaybeValue<string | undefined>;
  enctype?: MaybeValue<string | undefined>;
  method?: MaybeValue<string | undefined>;
  name?: MaybeValue<string | undefined>;
  novalidate?: MaybeValue<boolean | undefined>;
  rel?: MaybeValue<string | undefined>;
  target?: MaybeValue<string | undefined>;
}

interface IframeHTMLAttributes<T extends EventTarget = HTMLIFrameElement> extends HTMLAttributes<T> {
  allow?: MaybeValue<string | undefined>;
  allowFullScreen?: MaybeValue<boolean | undefined>;
  allowTransparency?: MaybeValue<boolean | undefined>;
  /** @deprecated */
  frameborder?: MaybeValue<number | string | undefined>;
  height?: MaybeValue<number | string | undefined>;
  loading?: 'eager' | 'lazy';
  /** @deprecated */
  marginHeight?: MaybeValue<number | undefined>;
  /** @deprecated */
  marginWidth?: MaybeValue<number | undefined>;
  name?: MaybeValue<string | undefined>;
  referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
  sandbox?: MaybeValue<string | undefined>;
  /** @deprecated */
  scrolling?: MaybeValue<string | undefined>;
  seamless?: MaybeValue<boolean | undefined>;
  src?: MaybeValue<string | undefined>;
  srcdoc?: MaybeValue<string | undefined>;
  srcDoc?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface ImgHTMLAttributes<T extends EventTarget = HTMLImageElement> extends HTMLAttributes<T> {
  alt?: MaybeValue<string | undefined>;
  crossorigin?: MaybeValue<CrossOrigin>;
  decoding?: MaybeValue<'async' | 'auto' | 'sync' | undefined>;
  height?: MaybeValue<number | string | undefined>;
  loading?: MaybeValue<'eager' | 'lazy' | undefined>;
  referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
  sizes?: MaybeValue<string | undefined>;
  src?: MaybeValue<string | undefined>;
  srcset?: MaybeValue<string | undefined>;
  srcSet?: MaybeValue<string | undefined>;
  usemap?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface InputHTMLAttributes<T extends EventTarget = HTMLInputElement> extends HTMLAttributes<T> {
  accept?: MaybeValue<string | undefined>;
  alt?: MaybeValue<string | undefined>;
  autocomplete?: MaybeValue<string | undefined>;
  capture?: MaybeValue<'user' | 'environment' | undefined>;
  checked?: MaybeValue<boolean | undefined>;
  defaultChecked?: MaybeValue<boolean | undefined>;
  defaultValue?: MaybeValue<string | number | undefined>;
  disabled?: MaybeValue<boolean | undefined>;
  enterkeyhint?: MaybeValue<EnterKeyHint | undefined>;
  form?: MaybeValue<string | undefined>;
  formaction?: MaybeValue<string | undefined>;
  formenctype?: MaybeValue<string | undefined>;
  formmethod?: MaybeValue<string | undefined>;
  formnovalidate?: MaybeValue<boolean | undefined>;
  formtarget?: MaybeValue<string | undefined>;
  height?: MaybeValue<number | string | undefined>;
  indeterminate?: MaybeValue<boolean | undefined>;
  list?: MaybeValue<string | undefined>;
  max?: MaybeValue<number | string | undefined>;
  maxlength?: MaybeValue<number | undefined>;
  min?: MaybeValue<number | string | undefined>;
  minlength?: MaybeValue<number | undefined>;
  multiple?: MaybeValue<boolean | undefined>;
  name?: MaybeValue<string | undefined>;
  pattern?: MaybeValue<string | undefined>;
  placeholder?: MaybeValue<string | undefined>;
  readonly?: MaybeValue<boolean | undefined>;
  required?: MaybeValue<boolean | undefined>;
  size?: MaybeValue<number | undefined>;
  src?: MaybeValue<string | undefined>;
  step?: MaybeValue<number | string | undefined>;
  type?: MaybeValue<InputType | undefined>;
  value?: MaybeValue<string | number | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface InsHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
  cite?: MaybeValue<string | undefined>;
  datetime?: MaybeValue<string | undefined>;
}

interface KeygenHTMLAttributes<T extends EventTarget = HTMLUnknownElement> extends HTMLAttributes<T> {
  challenge?: MaybeValue<string | undefined>;
  disabled?: MaybeValue<boolean | undefined>;
  form?: MaybeValue<string | undefined>;
  keyType?: MaybeValue<string | undefined>;
  keyParams?: MaybeValue<string | undefined>;
  name?: MaybeValue<string | undefined>;
}

interface LabelHTMLAttributes<T extends EventTarget = HTMLLabelElement> extends HTMLAttributes<T> {
  for?: MaybeValue<string | undefined>;
  form?: MaybeValue<string | undefined>;
  htmlFor?: MaybeValue<string | undefined>;
}

interface LiHTMLAttributes<T extends EventTarget = HTMLLIElement> extends HTMLAttributes<T> {
  value?: MaybeValue<string | number | undefined>;
}

interface LinkHTMLAttributes<T extends EventTarget = HTMLLinkElement> extends HTMLAttributes<T> {
  as?: MaybeValue<string | undefined>;
  crossorigin?: MaybeValue<CrossOrigin>;
  fetchPriority?: MaybeValue<'high' | 'low' | 'auto' | undefined>;
  href?: MaybeValue<string | undefined>;
  hreflang?: MaybeValue<string | undefined>;
  integrity?: MaybeValue<string | undefined>;
  media?: MaybeValue<string | undefined>;
  imageSrcSet?: MaybeValue<string | undefined>;
  referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
  rel?: MaybeValue<string | undefined>;
  sizes?: MaybeValue<string | undefined>;
  type?: MaybeValue<string | undefined>;
  charset?: MaybeValue<string | undefined>;
}

interface MapHTMLAttributes<T extends EventTarget = HTMLMapElement> extends HTMLAttributes<T> {
  name?: MaybeValue<string | undefined>;
}

interface MarqueeHTMLAttributes<T extends EventTarget = HTMLMarqueeElement> extends HTMLAttributes<T> {
  behavior?: MaybeValue<'scroll' | 'slide' | 'alternate' | undefined>;
  bgColor?: MaybeValue<string | undefined>;
  direction?: MaybeValue<'left' | 'right' | 'up' | 'down' | undefined>;
  height?: MaybeValue<number | string | undefined>;
  hspace?: MaybeValue<number | string | undefined>;
  loop?: MaybeValue<number | string | undefined>;
  scrollAmount?: MaybeValue<number | string | undefined>;
  scrollDelay?: MaybeValue<number | string | undefined>;
  trueSpeed?: MaybeValue<boolean | undefined>;
  vspace?: MaybeValue<number | string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface MediaHTMLAttributes<T extends EventTarget = HTMLMediaElement> extends HTMLAttributes<T> {
  autoplay?: MaybeValue<boolean | undefined>;
  autoPlay?: MaybeValue<boolean | undefined>;
  controls?: MaybeValue<boolean | undefined>;
  controlsList?: MaybeValue<string | undefined>;
  crossorigin?: MaybeValue<CrossOrigin>;
  loop?: MaybeValue<boolean | undefined>;
  mediaGroup?: MaybeValue<string | undefined>;
  muted?: MaybeValue<boolean | undefined>;
  playsinline?: MaybeValue<boolean | undefined>;
  preload?: MaybeValue<string | undefined>;
  src?: MaybeValue<string | undefined>;
  volume?: MaybeValue<string | number | undefined>;
}

interface MenuHTMLAttributes<T extends EventTarget = HTMLMenuElement> extends HTMLAttributes<T> {
  type?: MaybeValue<string | undefined>;
}

interface MetaHTMLAttributes<T extends EventTarget = HTMLMetaElement> extends HTMLAttributes<T> {
  charset?: MaybeValue<string | undefined>;
  content?: MaybeValue<string | undefined>;
  'http-equiv'?: MaybeValue<string | undefined>;
  name?: MaybeValue<string | undefined>;
  media?: MaybeValue<string | undefined>;
}

interface MeterHTMLAttributes<T extends EventTarget = HTMLMeterElement> extends HTMLAttributes<T> {
  form?: MaybeValue<string | undefined>;
  high?: MaybeValue<number | undefined>;
  low?: MaybeValue<number | undefined>;
  max?: MaybeValue<number | string | undefined>;
  min?: MaybeValue<number | string | undefined>;
  optimum?: MaybeValue<number | undefined>;
  value?: MaybeValue<string | number | undefined>;
}

interface ObjectHTMLAttributes<T extends EventTarget = HTMLObjectElement> extends HTMLAttributes<T> {
  classID?: MaybeValue<string | undefined>;
  data?: MaybeValue<string | undefined>;
  form?: MaybeValue<string | undefined>;
  height?: MaybeValue<number | string | undefined>;
  name?: MaybeValue<string | undefined>;
  type?: MaybeValue<string | undefined>;
  usemap?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
  wmode?: MaybeValue<string | undefined>;
}

interface OlHTMLAttributes<T extends EventTarget = HTMLOListElement> extends HTMLAttributes<T> {
  reversed?: MaybeValue<boolean | undefined>;
  start?: MaybeValue<number | undefined>;
  type?: MaybeValue<'1' | 'a' | 'A' | 'i' | 'I' | undefined>;
}

interface OptgroupHTMLAttributes<T extends EventTarget = HTMLOptGroupElement> extends HTMLAttributes<T> {
  disabled?: MaybeValue<boolean | undefined>;
  label?: MaybeValue<string | undefined>;
}

interface OptionHTMLAttributes<T extends EventTarget = HTMLOptionElement> extends HTMLAttributes<T> {
  disabled?: MaybeValue<boolean | undefined>;
  label?: MaybeValue<string | undefined>;
  selected?: MaybeValue<boolean | undefined>;
  value?: MaybeValue<string | number | undefined>;
}

interface OutputHTMLAttributes<T extends EventTarget = HTMLOutputElement> extends HTMLAttributes<T> {
  for?: MaybeValue<string | undefined>;
  form?: MaybeValue<string | undefined>;
  htmlFor?: MaybeValue<string | undefined>;
  name?: MaybeValue<string | undefined>;
}

interface ParamHTMLAttributes<T extends EventTarget = HTMLParamElement> extends HTMLAttributes<T> {
  name?: MaybeValue<string | undefined>;
  value?: MaybeValue<string | number | undefined>;
}

interface ProgressHTMLAttributes<T extends EventTarget = HTMLProgressElement> extends HTMLAttributes<T> {
  max?: MaybeValue<number | string | undefined>;
  value?: MaybeValue<string | number | undefined>;
}

interface QuoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
  cite?: MaybeValue<string | undefined>;
}

interface ScriptHTMLAttributes<T extends EventTarget = HTMLScriptElement> extends HTMLAttributes<T> {
  async?: MaybeValue<boolean | undefined>;
  /** @deprecated */
  charset?: MaybeValue<string | undefined>;
  /** @deprecated */
  crossorigin?: MaybeValue<CrossOrigin>;
  defer?: MaybeValue<boolean | undefined>;
  integrity?: MaybeValue<string | undefined>;
  nomodule?: MaybeValue<boolean | undefined>;
  noModule?: MaybeValue<boolean | undefined>;
  referrerpolicy?: MaybeValue<ReferrerPolicy | undefined>;
  src?: MaybeValue<string | undefined>;
  type?: MaybeValue<string | undefined>;
}

interface SelectHTMLAttributes<T extends EventTarget = HTMLSelectElement> extends HTMLAttributes<T> {
  autocomplete?: MaybeValue<string | undefined>;
  autoComplete?: MaybeValue<string | undefined>;
  defaultValue?: MaybeValue<string | number | undefined>;
  disabled?: MaybeValue<boolean | undefined>;
  form?: MaybeValue<string | undefined>;
  multiple?: MaybeValue<boolean | undefined>;
  name?: MaybeValue<string | undefined>;
  required?: MaybeValue<boolean | undefined>;
  size?: MaybeValue<number | undefined>;
  value?: MaybeValue<string | number | undefined>;
}

interface SlotHTMLAttributes<T extends EventTarget = HTMLSlotElement> extends HTMLAttributes<T> {
  name?: MaybeValue<string | undefined>;
}

interface SourceHTMLAttributes<T extends EventTarget = HTMLSourceElement> extends HTMLAttributes<T> {
  height?: MaybeValue<number | string | undefined>;
  media?: MaybeValue<string | undefined>;
  sizes?: MaybeValue<string | undefined>;
  src?: MaybeValue<string | undefined>;
  srcset?: MaybeValue<string | undefined>;
  srcSet?: MaybeValue<string | undefined>;
  type?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface StyleHTMLAttributes<T extends EventTarget = HTMLStyleElement> extends HTMLAttributes<T> {
  media?: MaybeValue<string | undefined>;
  scoped?: MaybeValue<boolean | undefined>;
  type?: MaybeValue<string | undefined>;
}

interface TableHTMLAttributes<T extends EventTarget = HTMLTableElement> extends HTMLAttributes<T> {
  cellPadding?: MaybeValue<string | undefined>;
  cellSpacing?: MaybeValue<string | undefined>;
  summary?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
}

interface TdHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
  align?: MaybeValue<Align | undefined>;
  colspan?: MaybeValue<number | undefined>;
  headers?: MaybeValue<string | undefined>;
  rowspan?: MaybeValue<number | undefined>;
  scope?: MaybeValue<string | undefined>;
  abbr?: MaybeValue<string | undefined>;
  height?: MaybeValue<number | string | undefined>;
  width?: MaybeValue<number | string | undefined>;
  valign?: MaybeValue<VerticalAlign | undefined>;
}

interface TextareaHTMLAttributes<T extends EventTarget = HTMLTextAreaElement> extends HTMLAttributes<T> {
  autocomplete?: MaybeValue<string | undefined>;
  autoComplete?: MaybeValue<string | undefined>;
  cols?: MaybeValue<number | undefined>;
  defaultValue?: MaybeValue<string | undefined>;
  dirName?: MaybeValue<string | undefined>;
  disabled?: MaybeValue<boolean | undefined>;
  form?: MaybeValue<string | undefined>;
  maxlength?: MaybeValue<number | undefined>;
  minlength?: MaybeValue<number | undefined>;
  name?: MaybeValue<string | undefined>;
  placeholder?: MaybeValue<string | undefined>;
  readOnly?: MaybeValue<boolean | undefined>;
  required?: MaybeValue<boolean | undefined>;
  rows?: MaybeValue<number | undefined>;
  value?: MaybeValue<string | number | undefined>;
  wrap?: MaybeValue<string | undefined>;
}

interface ThHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
  align?: MaybeValue<Align | undefined>;
  colspan?: MaybeValue<number | undefined>;
  headers?: MaybeValue<string | undefined>;
  rowspan?: MaybeValue<number | undefined>;
  scope?: MaybeValue<string | undefined>;
  abbr?: MaybeValue<string | undefined>;
}

interface TimeHTMLAttributes<T extends EventTarget = HTMLTimeElement> extends HTMLAttributes<T> {
  datetime?: MaybeValue<string | undefined>;
  dateTime?: MaybeValue<string | undefined>;
}

interface TrackHTMLAttributes<T extends EventTarget = HTMLTrackElement> extends MediaHTMLAttributes<T> {
  default?: MaybeValue<boolean | undefined>;
  kind?: MaybeValue<string | undefined>;
  label?: MaybeValue<string | undefined>;
  srclang?: MaybeValue<string | undefined>;
  srcLang?: MaybeValue<string | undefined>;
}

interface VideoHTMLAttributes<T extends EventTarget = HTMLVideoElement> extends MediaHTMLAttributes<T> {
  height?: MaybeValue<number | string | undefined>;
  poster?: MaybeValue<string | undefined>;
  width?: MaybeValue<number | string | undefined>;
  disablePictureInPicture?: MaybeValue<boolean | undefined>;
  disableRemotePlayback?: MaybeValue<boolean | undefined>;
}

export interface IntrinsicHTMLElements {
  a: AnchorHTMLAttributes<HTMLAnchorElement>;
  abbr: HTMLAttributes<HTMLElement>;
  address: HTMLAttributes<HTMLElement>;
  area: AreaHTMLAttributes<HTMLAreaElement>;
  article: HTMLAttributes<HTMLElement>;
  aside: HTMLAttributes<HTMLElement>;
  audio: AudioHTMLAttributes<HTMLAudioElement>;
  b: HTMLAttributes<HTMLElement>;
  base: BaseHTMLAttributes<HTMLBaseElement>;
  bdi: HTMLAttributes<HTMLElement>;
  bdo: HTMLAttributes<HTMLElement>;
  big: HTMLAttributes<HTMLElement>;
  blockquote: BlockquoteHTMLAttributes<HTMLQuoteElement>;
  body: HTMLAttributes<HTMLBodyElement>;
  br: HTMLAttributes<HTMLBRElement>;
  button: ButtonHTMLAttributes<HTMLButtonElement>;
  canvas: CanvasHTMLAttributes<HTMLCanvasElement>;
  caption: HTMLAttributes<HTMLTableCaptionElement>;
  cite: HTMLAttributes<HTMLElement>;
  code: HTMLAttributes<HTMLElement>;
  col: ColHTMLAttributes<HTMLTableColElement>;
  colgroup: ColgroupHTMLAttributes<HTMLTableColElement>;
  data: DataHTMLAttributes<HTMLDataElement>;
  datalist: HTMLAttributes<HTMLDataListElement>;
  dd: HTMLAttributes<HTMLElement>;
  del: DelHTMLAttributes<HTMLModElement>;
  details: DetailsHTMLAttributes<HTMLDetailsElement>;
  dfn: HTMLAttributes<HTMLElement>;
  dialog: DialogHTMLAttributes<HTMLDialogElement>;
  div: HTMLAttributes<HTMLDivElement>;
  dl: HTMLAttributes<HTMLDListElement>;
  dt: HTMLAttributes<HTMLElement>;
  em: HTMLAttributes<HTMLElement>;
  embed: EmbedHTMLAttributes<HTMLEmbedElement>;
  fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;
  figcaption: HTMLAttributes<HTMLElement>;
  figure: HTMLAttributes<HTMLElement>;
  footer: HTMLAttributes<HTMLElement>;
  form: FormHTMLAttributes<HTMLFormElement>;
  h1: HTMLAttributes<HTMLHeadingElement>;
  h2: HTMLAttributes<HTMLHeadingElement>;
  h3: HTMLAttributes<HTMLHeadingElement>;
  h4: HTMLAttributes<HTMLHeadingElement>;
  h5: HTMLAttributes<HTMLHeadingElement>;
  h6: HTMLAttributes<HTMLHeadingElement>;
  head: HTMLAttributes<HTMLHeadElement>;
  header: HTMLAttributes<HTMLElement>;
  hgroup: HTMLAttributes<HTMLElement>;
  hr: HTMLAttributes<HTMLHRElement>;
  html: HTMLAttributes<HTMLHtmlElement>;
  i: HTMLAttributes<HTMLElement>;
  iframe: IframeHTMLAttributes<HTMLIFrameElement>;
  img: ImgHTMLAttributes<HTMLImageElement>;
  input: InputHTMLAttributes<HTMLInputElement>;
  ins: InsHTMLAttributes<HTMLModElement>;
  kbd: HTMLAttributes<HTMLElement>;
  keygen: KeygenHTMLAttributes<HTMLUnknownElement>;
  label: LabelHTMLAttributes<HTMLLabelElement>;
  legend: HTMLAttributes<HTMLLegendElement>;
  li: LiHTMLAttributes<HTMLLIElement>;
  link: LinkHTMLAttributes<HTMLLinkElement>;
  main: HTMLAttributes<HTMLElement>;
  map: MapHTMLAttributes<HTMLMapElement>;
  mark: HTMLAttributes<HTMLElement>;
  marquee: MarqueeHTMLAttributes<HTMLMarqueeElement>;
  menu: MenuHTMLAttributes<HTMLMenuElement>;
  menuitem: HTMLAttributes<HTMLUnknownElement>;
  meta: MetaHTMLAttributes<HTMLMetaElement>;
  meter: MeterHTMLAttributes<HTMLMeterElement>;
  nav: HTMLAttributes<HTMLElement>;
  noscript: HTMLAttributes<HTMLElement>;
  object: ObjectHTMLAttributes<HTMLObjectElement>;
  ol: OlHTMLAttributes<HTMLOListElement>;
  optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;
  option: OptionHTMLAttributes<HTMLOptionElement>;
  output: OutputHTMLAttributes<HTMLOutputElement>;
  p: HTMLAttributes<HTMLParagraphElement>;
  param: ParamHTMLAttributes<HTMLParamElement>;
  picture: HTMLAttributes<HTMLPictureElement>;
  pre: HTMLAttributes<HTMLPreElement>;
  progress: ProgressHTMLAttributes<HTMLProgressElement>;
  q: QuoteHTMLAttributes<HTMLQuoteElement>;
  rp: HTMLAttributes<HTMLElement>;
  rt: HTMLAttributes<HTMLElement>;
  ruby: HTMLAttributes<HTMLElement>;
  s: HTMLAttributes<HTMLElement>;
  samp: HTMLAttributes<HTMLElement>;
  script: ScriptHTMLAttributes<HTMLScriptElement>;
  search: HTMLAttributes<HTMLElement>;
  section: HTMLAttributes<HTMLElement>;
  select: SelectHTMLAttributes<HTMLSelectElement>;
  slot: SlotHTMLAttributes<HTMLSlotElement>;
  small: HTMLAttributes<HTMLElement>;
  source: SourceHTMLAttributes<HTMLSourceElement>;
  span: HTMLAttributes<HTMLSpanElement>;
  strong: HTMLAttributes<HTMLElement>;
  style: StyleHTMLAttributes<HTMLStyleElement>;
  sub: HTMLAttributes<HTMLElement>;
  summary: HTMLAttributes<HTMLElement>;
  sup: HTMLAttributes<HTMLElement>;
  table: TableHTMLAttributes<HTMLTableElement>;
  tbody: HTMLAttributes<HTMLTableSectionElement>;
  td: TdHTMLAttributes<HTMLTableCellElement>;
  template: HTMLAttributes<HTMLTemplateElement>;
  textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
  tfoot: HTMLAttributes<HTMLTableSectionElement>;
  th: ThHTMLAttributes<HTMLTableCellElement>;
  thead: HTMLAttributes<HTMLTableSectionElement>;
  time: TimeHTMLAttributes<HTMLTimeElement>;
  title: HTMLAttributes<HTMLTitleElement>;
  tr: HTMLAttributes<HTMLTableRowElement>;
  track: TrackHTMLAttributes<HTMLTrackElement>;
  u: HTMLAttributes<HTMLElement>;
  ul: HTMLAttributes<HTMLUListElement>;
  var: HTMLAttributes<HTMLElement>;
  video: VideoHTMLAttributes<HTMLVideoElement>;
  wbr: HTMLAttributes<HTMLElement>;
}
