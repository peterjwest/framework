var F = Object.defineProperty;
var k = (t, e, n) => e in t ? F(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var a = (t, e, n) => k(t, typeof e != "symbol" ? e + "" : e, n);
class H {
  constructor(e) {
    a(this, "tagName");
    a(this, "children", []);
    this.tagName = e;
  }
  appendChild(e) {
    this.children.push(e);
  }
  insertBefore(e, n) {
    const r = this.children.findIndex((u) => u === n);
    if (r === -1) throw new Error("Child not found");
    this.children.splice(r, 0, e);
  }
}
const w = {
  createElement: (t) => new H(t),
  createTextNode: (t) => ({ textContent: t })
}, I = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "null",
  "undefined"
]);
function E(t) {
  return I.has(typeof t);
}
function y(t) {
  return t.children;
}
function M(t) {
  return t === void 0 ? [] : Array.isArray(t) ? t : [t];
}
function s(t, e) {
  if (typeof t == "string") {
    const r = e || {};
    return { type: t, props: { ...r, children: M(r.children) } };
  }
  const n = e || {};
  return { type: t, props: { ...n, children: M(n.children) } };
}
class i {
  constructor(e) {
    a(this, "value");
    a(this, "dependents", /* @__PURE__ */ new Set());
    a(this, "deriveListeners", []);
    a(this, "updateListeners", []);
    this.value = e;
  }
  static extract(e) {
    return e.value;
  }
  static computed(e, n) {
    const r = new R(() => n(...e.map((u) => u.value)));
    for (const u of e)
      u.dependents.add(r);
    return r;
  }
  computed(e) {
    const n = i.computed([this], e);
    for (const r of this.deriveListeners)
      r(this, n);
    return n;
  }
  addUpdateListener(e) {
    this.updateListeners.push(e), e(this.value);
  }
  addDeriveListener(e) {
    this.deriveListeners.push(e);
  }
  get(e) {
    return this.computed((n) => n[e]);
  }
  update(e) {
    this.value = e;
    for (const n of this.dependents)
      n.recompute();
    for (const n of this.updateListeners)
      n(this.value);
  }
  debounce(e) {
    return this;
  }
}
class R extends i {
  constructor(n) {
    super(n());
    a(this, "compute");
    this.compute = n;
  }
  recompute() {
    this.value = this.compute(), this.update(this.value);
  }
}
class j extends i {
}
function N(t) {
  return {
    type: N,
    props: { ...t, children: [] }
  };
}
function A(t) {
  return {
    type: A,
    props: { ...t, children: [] }
  };
}
function T(t, e = []) {
  e = e.concat(t);
  for (const n of t)
    e = T(Array.from(n.dependents), e);
  return e;
}
class q {
  constructor(e, n) {
    a(this, "children", /* @__PURE__ */ new Set());
    a(this, "derived", /* @__PURE__ */ new Map());
    a(this, "addValue", (e, n) => {
      this.derived.set(e, n);
      for (const r of this.children)
        r.derived.set(e, n);
    });
    for (const r of e)
      r.addDeriveListener(this.addValue);
    n && n.children.add(this);
  }
  extract() {
    const e = this.derived;
    return this.derived = /* @__PURE__ */ new Map(), e;
  }
}
function L(t, e, n) {
  const r = i.extract(e);
  r >= t.children.length ? t.appendChild(n) : t.insertBefore(n, t.children[r]);
}
function v(t, e, n = new i(0), r) {
  if (E(t)) {
    console.log("primitive", i.extract(n), e.children.length);
    const c = w.createTextNode(t ? String(t) : "");
    return L(e, n, c), [void 0, n.computed((o) => o + 1)];
  }
  if (t instanceof i) {
    const c = w.createTextNode("");
    return t.addUpdateListener((o) => {
      c.textContent = o;
    }), console.log("Value", i.extract(n), e.children.length), L(e, n, c), [void 0, n.computed((o) => o + 1)];
  }
  if (t.type === A) return [void 0, n];
  if (t.type === y) {
    const c = [];
    let o = n;
    for (const d of t.props.children) {
      const [p, f] = v(d, e, o, r);
      p && c.push(p), o = f;
    }
    return [() => {
      for (const d of c) d();
    }, o];
  }
  if (typeof t.type == "string") {
    const c = w.createElement(t.type);
    console.log("html", t.type, i.extract(n), e.children.length), L(e, n, c);
    const o = [];
    let d = new i(0);
    for (const p of t.props.children) {
      const [f, m] = v(p, c, d, r);
      d = m, f && o.push(f);
    }
    return [() => {
      for (const p of o) p();
    }, n.computed((p) => p + 1)];
  }
  if (t.type === N) {
    const c = t, o = new i(0);
    let d, p;
    return c.props.if.addUpdateListener((f) => {
      if (p !== !!f) {
        const m = f ? c.props.then : c.props.else;
        d && (d(), d = void 0);
        const S = new i(0);
        if (m) {
          const D = { type: m, props: { children: [] } };
          let V;
          [d, V] = v(D, e, n, r), S.update(i.extract(V));
        } else
          S.update(i.extract(n));
        p = !!f;
      }
    }), [() => {
      d && d();
    }, o];
  }
  let u = [];
  const l = (c) => {
    const o = new j(c);
    return u.push(o), o;
  }, x = t.type(t.props, l), h = r ? r.extract() : /* @__PURE__ */ new Map(), g = T(Array.from(h.values()).concat(u)), C = new q(g, r), [B, U] = v(x, e, n, C);
  return [B, U];
}
const z = {};
function G({ children: t }) {
  return /* @__PURE__ */ s("section", { children: t });
}
function J({ query: t }, e) {
  const n = e("x"), u = t.computed((l) => l.toUpperCase()).computed((l) => l + l);
  return /* @__PURE__ */ s(y, { children: [
    /* @__PURE__ */ s("h1", { children: n }),
    /* @__PURE__ */ s("p", { children: u })
  ] });
}
function K({ fullName: t }, e) {
  const n = e("hi"), r = n.debounce(100).computed((h) => ({ success: !0, data: Array(h.length).fill({ name: h }) })), u = t.computed((h) => h.split(" ")[0]), l = i.computed([n, r], (h, g) => g.data.length / h.length), x = r.get("data").get("length");
  return /* @__PURE__ */ s("article", { children: [
    /* @__PURE__ */ s(G, { children: /* @__PURE__ */ s("h1", { children: [
      "Hello ",
      u,
      " how are you?"
    ] }) }),
    /* @__PURE__ */ s(y, { children: /* @__PURE__ */ s("input", { class: "search-box", onChange: () => n }) }),
    /* @__PURE__ */ s(J, { query: n }),
    /* @__PURE__ */ s(
      N,
      {
        if: x,
        then: () => (
          // <Condition
          //   if={results.get('success')}
          //   then={() => (
          /* @__PURE__ */ s(y, { children: [
            /* @__PURE__ */ s("div", { children: [
              "Found ",
              x,
              " results for ",
              n,
              "Efficiency: ",
              l
            ] }),
            /* @__PURE__ */ s(A, { data: r.get("data"), element: (h) => {
              const g = t.computed((C) => C.toLowerCase());
              return /* @__PURE__ */ s("div", { class: "item", children: [
                h.get("name"),
                " owned by ",
                g
              ] });
            } })
          ] })
        ),
        else: () => /* @__PURE__ */ s("div", { children: "Loading!" })
      }
    )
  ] });
}
const b = w.createElement("div");
v(/* @__PURE__ */ s(K, { fullName: new i("x") }), b);
console.log(z.inspect(b, { depth: 1 / 0 }));
export {
  K as Component
};
