var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function is_promise(value) {
  return !!value && (typeof value === "object" || typeof value === "function") && typeof /** @type {any} */
  value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target2, node) {
  target2.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  style_element.textContent = "/* empty */";
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target2, node, anchor) {
  target2.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
const always_set_through_set_attribute = ["width", "height"];
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked");
  return selected_option && selected_option.__value;
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function construct_svelte_component(component, props) {
  return new component(props);
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  const options = { direction: "in" };
  let config = fn(node, params, options);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config(options);
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  const options = { direction: "out" };
  let config = fn(node, params, options);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  let original_inert_value;
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    if ("inert" in node) {
      original_inert_value = /** @type {HTMLElement} */
      node.inert;
      node.inert = true;
    }
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config(options);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && "inert" in node) {
        node.inert = original_inert_value;
      }
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function handle_promise(promise2, info) {
  const token = info.token = {};
  function update2(type, index, key, value) {
    if (info.token !== token)
      return;
    info.resolved = value;
    let child_ctx = info.ctx;
    if (key !== void 0) {
      child_ctx = child_ctx.slice();
      child_ctx[key] = value;
    }
    const block = type && (info.current = type)(child_ctx);
    let needs_flush = false;
    if (info.block) {
      if (info.blocks) {
        info.blocks.forEach((block2, i) => {
          if (i !== index && block2) {
            group_outros();
            transition_out(block2, 1, 1, () => {
              if (info.blocks[i] === block2) {
                info.blocks[i] = null;
              }
            });
            check_outros();
          }
        });
      } else {
        info.block.d(1);
      }
      block.c();
      transition_in(block, 1);
      block.m(info.mount(), info.anchor);
      needs_flush = true;
    }
    info.block = block;
    if (info.blocks)
      info.blocks[index] = block;
    if (needs_flush) {
      flush();
    }
  }
  if (is_promise(promise2)) {
    const current_component2 = get_current_component();
    promise2.then(
      (value) => {
        set_current_component(current_component2);
        update2(info.then, 1, info.value, value);
        set_current_component(null);
      },
      (error) => {
        set_current_component(current_component2);
        update2(info.catch, 2, info.error, error);
        set_current_component(null);
        if (!info.hasCatch) {
          throw error;
        }
      }
    );
    if (info.current !== info.pending) {
      update2(info.pending, 0);
      return true;
    }
  } else {
    if (info.current !== info.then) {
      update2(info.then, 1, info.value, promise2);
      return true;
    }
    info.resolved = /** @type {T} */
    promise2;
  }
}
function update_await_block_branch(info, ctx, dirty) {
  const child_ctx = ctx.slice();
  const { resolved } = info;
  if (info.current === info.then) {
    child_ctx[info.value] = resolved;
  }
  if (info.current === info.catch) {
    child_ctx[info.error] = resolved;
  }
  info.block.p(child_ctx, dirty);
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target2, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target2, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
const LOCATION = {};
const ROUTER = {};
const HISTORY = {};
const PARAM = /^:(.+)/;
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;
const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
const rankRoute = (route, index) => {
  const score = route.default ? 0 : segmentize(route.path).reduce((score2, segment) => {
    score2 += SEGMENT_POINTS;
    if (segment === "") {
      score2 += ROOT_POINTS;
    } else if (PARAM.test(segment)) {
      score2 += DYNAMIC_POINTS;
    } else if (segment[0] === "*") {
      score2 -= SEGMENT_POINTS + SPLAT_PENALTY;
    } else {
      score2 += STATIC_POINTS;
    }
    return score2;
  }, 0);
  return { route, score, index };
};
const rankRoutes = (routes) => routes.map(rankRoute).sort(
  (a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
);
const pick = (routes, uri) => {
  let match;
  let default_;
  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);
  for (let i = 0, l = ranked.length; i < l; i++) {
    const route = ranked[i].route;
    let missed = false;
    if (route.default) {
      default_ = {
        route,
        params: {},
        uri
      };
      continue;
    }
    const routeSegments = segmentize(route.path);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];
      if (routeSegment && routeSegment[0] === "*") {
        const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);
        params[splatName] = uriSegments.slice(index).map(decodeURIComponent).join("/");
        break;
      }
      if (typeof uriSegment === "undefined") {
        missed = true;
        break;
      }
      const dynamicMatch = PARAM.exec(routeSegment);
      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }
    if (!missed) {
      match = {
        route,
        params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }
  return match || default_ || null;
};
const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");
const resolve = (to, base) => {
  if (to.startsWith("/"))
    return to;
  const [toPathname, toQuery] = to.split("?");
  const [basePathname] = base.split("?");
  const toSegments = segmentize(toPathname);
  const baseSegments = segmentize(basePathname);
  if (toSegments[0] === "")
    return addQuery(basePathname, toQuery);
  if (!toSegments[0].startsWith(".")) {
    const pathname = baseSegments.concat(toSegments).join("/");
    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];
  allSegments.forEach((segment) => {
    if (segment === "..")
      segments.pop();
    else if (segment !== ".")
      segments.push(segment);
  });
  return addQuery("/" + segments.join("/"), toQuery);
};
const combinePaths = (basepath, path) => `${stripSlashes(
  path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
)}/`;
const shouldNavigate = (event) => !event.defaultPrevented && event.button === 0 && !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
const canUseDOM = () => typeof window !== "undefined" && "document" in window && "location" in window;
const get_default_slot_changes$2 = (dirty) => ({ active: dirty & /*ariaCurrent*/
4 });
const get_default_slot_context$2 = (ctx) => ({ active: !!/*ariaCurrent*/
ctx[2] });
function create_fragment$8(ctx) {
  let a;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[17].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[16],
    get_default_slot_context$2
  );
  let a_levels = [
    { href: (
      /*href*/
      ctx[0]
    ) },
    { "aria-current": (
      /*ariaCurrent*/
      ctx[2]
    ) },
    /*props*/
    ctx[1],
    /*$$restProps*/
    ctx[6]
  ];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      a = element("a");
      if (default_slot)
        default_slot.c();
      set_attributes(a, a_data);
    },
    m(target2, anchor) {
      insert(target2, a, anchor);
      if (default_slot) {
        default_slot.m(a, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(
          a,
          "click",
          /*onClick*/
          ctx[5]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, ariaCurrent*/
        65540)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[16],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[16]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[16],
              dirty,
              get_default_slot_changes$2
            ),
            get_default_slot_context$2
          );
        }
      }
      set_attributes(a, a_data = get_spread_update(a_levels, [
        (!current || dirty & /*href*/
        1) && { href: (
          /*href*/
          ctx2[0]
        ) },
        (!current || dirty & /*ariaCurrent*/
        4) && { "aria-current": (
          /*ariaCurrent*/
          ctx2[2]
        ) },
        dirty & /*props*/
        2 && /*props*/
        ctx2[1],
        dirty & /*$$restProps*/
        64 && /*$$restProps*/
        ctx2[6]
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(a);
      }
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let ariaCurrent;
  const omit_props_names = ["to", "replace", "state", "getProps", "preserveScroll"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let $location;
  let $base;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { to = "#" } = $$props;
  let { replace = false } = $$props;
  let { state = {} } = $$props;
  let { getProps = () => ({}) } = $$props;
  let { preserveScroll = false } = $$props;
  const location = getContext(LOCATION);
  component_subscribe($$self, location, (value) => $$invalidate(14, $location = value));
  const { base } = getContext(ROUTER);
  component_subscribe($$self, base, (value) => $$invalidate(15, $base = value));
  const { navigate } = getContext(HISTORY);
  const dispatch2 = createEventDispatcher();
  let href, isPartiallyCurrent, isCurrent, props;
  const onClick = (event) => {
    dispatch2("click", event);
    if (shouldNavigate(event)) {
      event.preventDefault();
      const shouldReplace = $location.pathname === href || replace;
      navigate(href, {
        state,
        replace: shouldReplace,
        preserveScroll
      });
    }
  };
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("to" in $$new_props)
      $$invalidate(7, to = $$new_props.to);
    if ("replace" in $$new_props)
      $$invalidate(8, replace = $$new_props.replace);
    if ("state" in $$new_props)
      $$invalidate(9, state = $$new_props.state);
    if ("getProps" in $$new_props)
      $$invalidate(10, getProps = $$new_props.getProps);
    if ("preserveScroll" in $$new_props)
      $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
    if ("$$scope" in $$new_props)
      $$invalidate(16, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*to, $base*/
    32896) {
      $$invalidate(0, href = resolve(to, $base.uri));
    }
    if ($$self.$$.dirty & /*$location, href*/
    16385) {
      $$invalidate(12, isPartiallyCurrent = $location.pathname.startsWith(href));
    }
    if ($$self.$$.dirty & /*href, $location*/
    16385) {
      $$invalidate(13, isCurrent = href === $location.pathname);
    }
    if ($$self.$$.dirty & /*isCurrent*/
    8192) {
      $$invalidate(2, ariaCurrent = isCurrent ? "page" : void 0);
    }
    $$invalidate(1, props = getProps({
      location: $location,
      href,
      isPartiallyCurrent,
      isCurrent,
      existingProps: $$restProps
    }));
  };
  return [
    href,
    props,
    ariaCurrent,
    location,
    base,
    onClick,
    $$restProps,
    to,
    replace,
    state,
    getProps,
    preserveScroll,
    isPartiallyCurrent,
    isCurrent,
    $location,
    $base,
    $$scope,
    slots
  ];
}
class Link extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$8, safe_not_equal, {
      to: 7,
      replace: 8,
      state: 9,
      getProps: 10,
      preserveScroll: 11
    });
  }
}
const get_default_slot_changes$1 = (dirty) => ({ params: dirty & /*routeParams*/
4 });
const get_default_slot_context$1 = (ctx) => ({ params: (
  /*routeParams*/
  ctx[2]
) });
function create_if_block$2(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_1$1, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*component*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target2, anchor) {
      if_blocks[current_block_type_index].m(target2, anchor);
      insert(target2, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_else_block$1(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[8].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[7],
    get_default_slot_context$1
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target2, anchor) {
      if (default_slot) {
        default_slot.m(target2, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/
        132)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[7],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[7]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[7],
              dirty,
              get_default_slot_changes$1
            ),
            get_default_slot_context$1
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_1$1(ctx) {
  let await_block_anchor;
  let promise2;
  let current;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block,
    then: create_then_block,
    catch: create_catch_block,
    value: 12,
    blocks: [, , ,]
  };
  handle_promise(promise2 = /*component*/
  ctx[0], info);
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target2, anchor) {
      insert(target2, await_block_anchor, anchor);
      info.block.m(target2, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      info.ctx = ctx;
      if (dirty & /*component*/
      1 && promise2 !== (promise2 = /*component*/
      ctx[0]) && handle_promise(promise2, info))
        ;
      else {
        update_await_block_branch(info, ctx, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_catch_block(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block(ctx) {
  var _a;
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*routeParams*/
    ctx[2],
    /*routeProps*/
    ctx[3]
  ];
  var switch_value = (
    /*resolvedComponent*/
    ((_a = ctx[12]) == null ? void 0 : _a.default) || /*resolvedComponent*/
    ctx[12]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    if (dirty !== void 0 && dirty & /*routeParams, routeProps*/
    12) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [
        dirty & /*routeParams*/
        4 && get_spread_object(
          /*routeParams*/
          ctx2[2]
        ),
        dirty & /*routeProps*/
        8 && get_spread_object(
          /*routeProps*/
          ctx2[3]
        )
      ]);
    } else {
      for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
      }
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target2, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target2, anchor);
      insert(target2, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      var _a2;
      if (dirty & /*component*/
      1 && switch_value !== (switch_value = /*resolvedComponent*/
      ((_a2 = ctx2[12]) == null ? void 0 : _a2.default) || /*resolvedComponent*/
      ctx2[12])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*routeParams, routeProps*/
        12 ? get_spread_update(switch_instance_spread_levels, [
          dirty & /*routeParams*/
          4 && get_spread_object(
            /*routeParams*/
            ctx2[2]
          ),
          dirty & /*routeProps*/
          8 && get_spread_object(
            /*routeProps*/
            ctx2[3]
          )
        ]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_fragment$7(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$activeRoute*/
    ctx[1] && /*$activeRoute*/
    ctx[1].route === /*route*/
    ctx[5] && create_if_block$2(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target2, anchor) {
      if (if_block)
        if_block.m(target2, anchor);
      insert(target2, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*$activeRoute*/
        ctx2[1] && /*$activeRoute*/
        ctx2[1].route === /*route*/
        ctx2[5]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$activeRoute*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $activeRoute;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { path = "" } = $$props;
  let { component = null } = $$props;
  let routeParams = {};
  let routeProps = {};
  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
  component_subscribe($$self, activeRoute, (value) => $$invalidate(1, $activeRoute = value));
  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === ""
  };
  registerRoute(route);
  onDestroy(() => {
    unregisterRoute(route);
  });
  $$self.$$set = ($$new_props) => {
    $$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("path" in $$new_props)
      $$invalidate(6, path = $$new_props.path);
    if ("component" in $$new_props)
      $$invalidate(0, component = $$new_props.component);
    if ("$$scope" in $$new_props)
      $$invalidate(7, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($activeRoute && $activeRoute.route === route) {
      $$invalidate(2, routeParams = $activeRoute.params);
      const { component: c, path: path2, ...rest } = $$props;
      $$invalidate(3, routeProps = rest);
      if (c) {
        if (c.toString().startsWith("class "))
          $$invalidate(0, component = c);
        else
          $$invalidate(0, component = c());
      }
      canUseDOM() && !$activeRoute.preserveScroll && (window == null ? void 0 : window.scrollTo(0, 0));
    }
  };
  $$props = exclude_internal_props($$props);
  return [
    component,
    $activeRoute,
    routeParams,
    routeProps,
    activeRoute,
    route,
    path,
    $$scope,
    slots
  ];
}
class Route extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$7, safe_not_equal, { path: 6, component: 0 });
  }
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update2);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
const getLocation = (source) => {
  return {
    ...source.location,
    state: source.history.state,
    key: source.history.state && source.history.state.key || "initial"
  };
};
const createHistory = (source) => {
  const listeners = [];
  let location = getLocation(source);
  return {
    get location() {
      return location;
    },
    listen(listener) {
      listeners.push(listener);
      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };
      source.addEventListener("popstate", popstateListener);
      return () => {
        source.removeEventListener("popstate", popstateListener);
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },
    navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
      state = { ...state, key: Date.now() + "" };
      try {
        if (replace)
          source.history.replaceState(state, "", to);
        else
          source.history.pushState(state, "", to);
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }
      location = getLocation(source);
      listeners.forEach(
        (listener) => listener({ location, action: "PUSH", preserveScroll })
      );
      if (blurActiveElement)
        document.activeElement.blur();
    }
  };
};
const createMemorySource = (initialPathname = "/") => {
  let index = 0;
  const stack = [{ pathname: initialPathname, search: "" }];
  const states = [];
  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {
    },
    removeEventListener(name, fn) {
    },
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
};
const globalHistory = createHistory(
  canUseDOM() ? window : createMemorySource()
);
const get_default_slot_changes_1 = (dirty) => ({
  route: dirty & /*$activeRoute*/
  4,
  location: dirty & /*$location*/
  2
});
const get_default_slot_context_1 = (ctx) => ({
  route: (
    /*$activeRoute*/
    ctx[2] && /*$activeRoute*/
    ctx[2].uri
  ),
  location: (
    /*$location*/
    ctx[1]
  )
});
const get_default_slot_changes = (dirty) => ({
  route: dirty & /*$activeRoute*/
  4,
  location: dirty & /*$location*/
  2
});
const get_default_slot_context = (ctx) => ({
  route: (
    /*$activeRoute*/
    ctx[2] && /*$activeRoute*/
    ctx[2].uri
  ),
  location: (
    /*$location*/
    ctx[1]
  )
});
function create_else_block(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[15].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    get_default_slot_context_1
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target2, anchor) {
      if (default_slot) {
        default_slot.m(target2, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/
        16390)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[14]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[14],
              dirty,
              get_default_slot_changes_1
            ),
            get_default_slot_context_1
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block$1(ctx) {
  let previous_key = (
    /*$location*/
    ctx[1].pathname
  );
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  return {
    c() {
      key_block.c();
      key_block_anchor = empty();
    },
    m(target2, anchor) {
      key_block.m(target2, anchor);
      insert(target2, key_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*$location*/
      2 && safe_not_equal(previous_key, previous_key = /*$location*/
      ctx2[1].pathname)) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(key_block);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(key_block_anchor);
      }
      key_block.d(detaching);
    }
  };
}
function create_key_block(ctx) {
  let div;
  let div_intro;
  let div_outro;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[15].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    get_default_slot_context
  );
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/
        16390)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[14]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[14],
              dirty,
              get_default_slot_changes
            ),
            get_default_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      if (local) {
        add_render_callback(() => {
          if (!current)
            return;
          if (div_outro)
            div_outro.end(1);
          div_intro = create_in_transition(
            div,
            /*viewtransitionFn*/
            ctx[3],
            {}
          );
          div_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (div_intro)
        div_intro.invalidate();
      if (local) {
        div_outro = create_out_transition(
          div,
          /*viewtransitionFn*/
          ctx[3],
          {}
        );
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (default_slot)
        default_slot.d(detaching);
      if (detaching && div_outro)
        div_outro.end();
    }
  };
}
function create_fragment$6(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$1, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*viewtransition*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target2, anchor) {
      if_blocks[current_block_type_index].m(target2, anchor);
      insert(target2, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $location;
  let $routes;
  let $base;
  let $activeRoute;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { basepath = "/" } = $$props;
  let { url = null } = $$props;
  let { viewtransition = null } = $$props;
  let { history = globalHistory } = $$props;
  const viewtransitionFn = (node, _, direction) => {
    const vt = viewtransition(direction);
    if (typeof (vt == null ? void 0 : vt.fn) === "function")
      return vt.fn(node, vt);
    else
      return vt;
  };
  setContext(HISTORY, history);
  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);
  const routes = writable([]);
  component_subscribe($$self, routes, (value) => $$invalidate(12, $routes = value));
  const activeRoute = writable(null);
  component_subscribe($$self, activeRoute, (value) => $$invalidate(2, $activeRoute = value));
  let hasActiveRoute = false;
  const location = locationContext || writable(url ? { pathname: url } : history.location);
  component_subscribe($$self, location, (value) => $$invalidate(1, $location = value));
  const base = routerContext ? routerContext.routerBase : writable({ path: basepath, uri: basepath });
  component_subscribe($$self, base, (value) => $$invalidate(13, $base = value));
  const routerBase = derived([base, activeRoute], ([base2, activeRoute2]) => {
    if (!activeRoute2)
      return base2;
    const { path: basepath2 } = base2;
    const { route, uri } = activeRoute2;
    const path = route.default ? basepath2 : route.path.replace(/\*.*$/, "");
    return { path, uri };
  });
  const registerRoute = (route) => {
    const { path: basepath2 } = $base;
    let { path } = route;
    route._path = path;
    route.path = combinePaths(basepath2, path);
    if (typeof window === "undefined") {
      if (hasActiveRoute)
        return;
      const matchingRoute = pick([route], $location.pathname);
      if (matchingRoute) {
        activeRoute.set(matchingRoute);
        hasActiveRoute = true;
      }
    } else {
      routes.update((rs) => [...rs, route]);
    }
  };
  const unregisterRoute = (route) => {
    routes.update((rs) => rs.filter((r) => r !== route));
  };
  let preserveScroll = false;
  if (!locationContext) {
    onMount(() => {
      const unlisten = history.listen((event) => {
        $$invalidate(11, preserveScroll = event.preserveScroll || false);
        location.set(event.location);
      });
      return unlisten;
    });
    setContext(LOCATION, location);
  }
  setContext(ROUTER, {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute
  });
  $$self.$$set = ($$props2) => {
    if ("basepath" in $$props2)
      $$invalidate(8, basepath = $$props2.basepath);
    if ("url" in $$props2)
      $$invalidate(9, url = $$props2.url);
    if ("viewtransition" in $$props2)
      $$invalidate(0, viewtransition = $$props2.viewtransition);
    if ("history" in $$props2)
      $$invalidate(10, history = $$props2.history);
    if ("$$scope" in $$props2)
      $$invalidate(14, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$base*/
    8192) {
      {
        const { path: basepath2 } = $base;
        routes.update((rs) => rs.map((r) => Object.assign(r, { path: combinePaths(basepath2, r._path) })));
      }
    }
    if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/
    6146) {
      {
        const bestMatch = pick($routes, $location.pathname);
        activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
      }
    }
  };
  return [
    viewtransition,
    $location,
    $activeRoute,
    viewtransitionFn,
    routes,
    activeRoute,
    location,
    base,
    basepath,
    url,
    history,
    preserveScroll,
    $routes,
    $base,
    $$scope,
    slots
  ];
}
class Router extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$6, safe_not_equal, {
      basepath: 8,
      url: 9,
      viewtransition: 0,
      history: 10
    });
  }
}
class AlphabetUtils {
}
__publicField(AlphabetUtils, "alphabet", [
  "a",
  "ą",
  "b",
  "c",
  "ć",
  "d",
  "e",
  "ę",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "ł",
  "m",
  "n",
  "ń",
  "o",
  "ó",
  "p",
  "q",
  "r",
  "s",
  "ś",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "ź",
  "ż"
]);
class ArrayUtils {
  static countMap(length, mapper) {
    return Array.from({ length }, (_m, index) => mapper(index));
  }
}
class MathUtils {
  static isPrime(number) {
    if (number <= 1)
      return false;
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0)
        return false;
    }
    return true;
  }
}
__publicField(MathUtils, "mod", (n, m) => (n % m + m) % m);
class CaesarCipher {
  static encrypt(message, shift) {
    return this.rotate(message, shift);
  }
  static decrypt(message, shift) {
    return this.rotate(message, -shift);
  }
  static rotate(message, shift) {
    let result = "";
    for (const character of message.toLowerCase()) {
      const index = AlphabetUtils.alphabet.indexOf(character);
      if (index === -1)
        continue;
      const newIndex = MathUtils.mod(index + shift, AlphabetUtils.alphabet.length);
      result += AlphabetUtils.alphabet[newIndex];
    }
    return result;
  }
}
class PolybiusCipher {
  static encrypt(message, checkerboard) {
    let result = [];
    let position = 1;
    for (const character of message.toLowerCase()) {
      const index = checkerboard.characters.indexOf(character);
      if (index === -1)
        continue;
      const row = Math.floor(index / checkerboard.width) + 1;
      const column = index % checkerboard.width + 1;
      if (MathUtils.isPrime(position)) {
        result.push(`${column}${row}`);
      } else {
        result.push(`${row}${column}`);
      }
      position++;
    }
    return result.join(" ");
  }
  static decrypt(message, checkerboard) {
    message = this.removeSpaces(message);
    if (message.length % 2 !== 0)
      throw new Error("Invalid input length");
    let result = "";
    let position = 1;
    for (let i = 0; i < message.length; i += 2) {
      const first = parseInt(message[i], 10);
      const second = parseInt(message[i + 1], 10);
      if (isNaN(first))
        throw new Error(`Invalid input character: ${message[i]}`);
      if (isNaN(second))
        throw new Error(`Invalid input character: ${message[i + 1]}`);
      const isPositionPrime = MathUtils.isPrime(position);
      const column = (isPositionPrime ? first : second) - 1;
      const row = (isPositionPrime ? second : first) - 1;
      const index = row * checkerboard.width + column;
      result += checkerboard.characters[index];
      position++;
    }
    return result;
  }
  static removeSpaces(message) {
    return message.replace(/\s/g, "");
  }
}
class PolybiusCheckerboard {
  constructor(width, height) {
    __publicField(this, "characters", []);
    this.width = width;
    this.height = height;
    this.characters = new Array(width * height).map((_element) => "");
  }
}
class TrithemiusCipher {
  static encrypt(message, key) {
    return this.rotate(message, key, 1);
  }
  static decrypt(message, key) {
    return this.rotate(message, key, -1);
  }
  static rotate(message, key, direction) {
    key = key.toLowerCase();
    let shift = AlphabetUtils.alphabet.findIndex((character) => character === key);
    if (shift === -1)
      throw new Error(`Invalid key: ${key}`);
    shift *= direction;
    let result = "";
    for (const character of message.toLowerCase()) {
      const index = AlphabetUtils.alphabet.indexOf(character);
      if (index === -1)
        continue;
      const newIndex = MathUtils.mod(index + shift, AlphabetUtils.alphabet.length);
      result += AlphabetUtils.alphabet[newIndex];
      shift += direction;
    }
    return result;
  }
}
function get_each_context$5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  return child_ctx;
}
function get_each_context_1$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  return child_ctx;
}
function create_each_block_1$2(ctx) {
  let option;
  let t_value = (
    /*keyOption*/
    ctx[16] + ""
  );
  let t;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = /*keyOption*/
      ctx[16];
      set_input_value(option, option.__value);
    },
    m(target2, anchor) {
      insert(target2, option, anchor);
      append(option, t);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_each_block$5(ctx) {
  let option;
  let t_value = (
    /*keyOption*/
    ctx[16] + ""
  );
  let t;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = /*keyOption*/
      ctx[16];
      set_input_value(option, option.__value);
    },
    m(target2, anchor) {
      insert(target2, option, anchor);
      append(option, t);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_fragment$5(ctx) {
  let div10;
  let h1;
  let t1;
  let div4;
  let div3;
  let div0;
  let label0;
  let t3;
  let textarea0;
  let t4;
  let div1;
  let label1;
  let t6;
  let select0;
  let t7;
  let div2;
  let label2;
  let t9;
  let textarea1;
  let t10;
  let button0;
  let t12;
  let div9;
  let div8;
  let div5;
  let label3;
  let t14;
  let textarea2;
  let t15;
  let div6;
  let label4;
  let t17;
  let select1;
  let t18;
  let div7;
  let label5;
  let t20;
  let textarea3;
  let t21;
  let button1;
  let mounted;
  let dispose;
  let each_value_1 = ensure_array_like(
    /*keyOptions*/
    ctx[6]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
  }
  let each_value = ensure_array_like(
    /*keyOptions*/
    ctx[6]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
  }
  return {
    c() {
      div10 = element("div");
      h1 = element("h1");
      h1.textContent = "Szyfr Cezara";
      t1 = space();
      div4 = element("div");
      div3 = element("div");
      div0 = element("div");
      label0 = element("label");
      label0.textContent = "Tekst jawny";
      t3 = space();
      textarea0 = element("textarea");
      t4 = space();
      div1 = element("div");
      label1 = element("label");
      label1.textContent = "Klucz";
      t6 = space();
      select0 = element("select");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t7 = space();
      div2 = element("div");
      label2 = element("label");
      label2.textContent = "Tekst zaszyfrowany";
      t9 = space();
      textarea1 = element("textarea");
      t10 = space();
      button0 = element("button");
      button0.textContent = "Szyfruj";
      t12 = space();
      div9 = element("div");
      div8 = element("div");
      div5 = element("div");
      label3 = element("label");
      label3.textContent = "Tekst zaszyfrowany";
      t14 = space();
      textarea2 = element("textarea");
      t15 = space();
      div6 = element("div");
      label4 = element("label");
      label4.textContent = "Klucz";
      t17 = space();
      select1 = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t18 = space();
      div7 = element("div");
      label5 = element("label");
      label5.textContent = "Tekst jawny";
      t20 = space();
      textarea3 = element("textarea");
      t21 = space();
      button1 = element("button");
      button1.textContent = "Deszyfruj";
      attr(h1, "class", "mb-4");
      attr(label0, "for", "encrypt-message");
      attr(label0, "class", "form-label");
      attr(textarea0, "spellcheck", "false");
      attr(textarea0, "id", "encrypt-message");
      attr(textarea0, "class", "form-control");
      attr(div0, "class", "mb-3");
      attr(label1, "for", "encrypt-key");
      attr(label1, "class", "form-label");
      attr(select0, "id", "encrypt-key");
      attr(select0, "class", "form-select");
      if (
        /*encryptKey*/
        ctx[1] === void 0
      )
        add_render_callback(() => (
          /*select0_change_handler*/
          ctx[10].call(select0)
        ));
      attr(div1, "class", "mb-3");
      attr(label2, "for", "encrypt-encrypted");
      attr(label2, "class", "form-label");
      attr(textarea1, "spellcheck", "false");
      attr(textarea1, "id", "encrypt-encrypted");
      attr(textarea1, "class", "form-control");
      attr(div2, "class", "mb-3");
      attr(button0, "class", "btn btn-primary");
      attr(div3, "class", "card-body");
      attr(div4, "class", "card mb-3");
      attr(label3, "for", "decrypt-encrypted");
      attr(label3, "class", "form-label");
      attr(textarea2, "spellcheck", "false");
      attr(textarea2, "id", "decrypt-encrypted");
      attr(textarea2, "class", "form-control");
      attr(div5, "class", "mb-3");
      attr(label4, "for", "decrypt-key");
      attr(label4, "class", "form-label");
      attr(select1, "id", "decrypt-key");
      attr(select1, "class", "form-select");
      if (
        /*decryptKey*/
        ctx[4] === void 0
      )
        add_render_callback(() => (
          /*select1_change_handler*/
          ctx[13].call(select1)
        ));
      attr(div6, "class", "mb-3");
      attr(label5, "for", "decrypt-message");
      attr(label5, "class", "form-label");
      attr(textarea3, "spellcheck", "false");
      attr(textarea3, "id", "decrypt-message");
      attr(textarea3, "class", "form-control");
      attr(div7, "class", "mb-3");
      attr(button1, "class", "btn btn-primary");
      attr(div8, "class", "card-body");
      attr(div9, "class", "card");
      attr(div10, "class", "container my-5");
    },
    m(target2, anchor) {
      insert(target2, div10, anchor);
      append(div10, h1);
      append(div10, t1);
      append(div10, div4);
      append(div4, div3);
      append(div3, div0);
      append(div0, label0);
      append(div0, t3);
      append(div0, textarea0);
      set_input_value(
        textarea0,
        /*encryptMessage*/
        ctx[0]
      );
      append(div3, t4);
      append(div3, div1);
      append(div1, label1);
      append(div1, t6);
      append(div1, select0);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(select0, null);
        }
      }
      select_option(
        select0,
        /*encryptKey*/
        ctx[1],
        true
      );
      append(div3, t7);
      append(div3, div2);
      append(div2, label2);
      append(div2, t9);
      append(div2, textarea1);
      set_input_value(
        textarea1,
        /*encryptEncrypted*/
        ctx[2]
      );
      append(div3, t10);
      append(div3, button0);
      append(div10, t12);
      append(div10, div9);
      append(div9, div8);
      append(div8, div5);
      append(div5, label3);
      append(div5, t14);
      append(div5, textarea2);
      set_input_value(
        textarea2,
        /*decryptEncrypted*/
        ctx[5]
      );
      append(div8, t15);
      append(div8, div6);
      append(div6, label4);
      append(div6, t17);
      append(div6, select1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select1, null);
        }
      }
      select_option(
        select1,
        /*decryptKey*/
        ctx[4],
        true
      );
      append(div8, t18);
      append(div8, div7);
      append(div7, label5);
      append(div7, t20);
      append(div7, textarea3);
      set_input_value(
        textarea3,
        /*decryptMessage*/
        ctx[3]
      );
      append(div8, t21);
      append(div8, button1);
      if (!mounted) {
        dispose = [
          listen(
            textarea0,
            "input",
            /*textarea0_input_handler*/
            ctx[9]
          ),
          listen(
            select0,
            "change",
            /*select0_change_handler*/
            ctx[10]
          ),
          listen(
            textarea1,
            "input",
            /*textarea1_input_handler*/
            ctx[11]
          ),
          listen(
            button0,
            "click",
            /*encrypt*/
            ctx[7]
          ),
          listen(
            textarea2,
            "input",
            /*textarea2_input_handler*/
            ctx[12]
          ),
          listen(
            select1,
            "change",
            /*select1_change_handler*/
            ctx[13]
          ),
          listen(
            textarea3,
            "input",
            /*textarea3_input_handler*/
            ctx[14]
          ),
          listen(
            button1,
            "click",
            /*decrypt*/
            ctx[8]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*encryptMessage*/
      1) {
        set_input_value(
          textarea0,
          /*encryptMessage*/
          ctx2[0]
        );
      }
      if (dirty & /*keyOptions*/
      64) {
        each_value_1 = ensure_array_like(
          /*keyOptions*/
          ctx2[6]
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1$2(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1$2(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(select0, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty & /*encryptKey, keyOptions*/
      66) {
        select_option(
          select0,
          /*encryptKey*/
          ctx2[1]
        );
      }
      if (dirty & /*encryptEncrypted*/
      4) {
        set_input_value(
          textarea1,
          /*encryptEncrypted*/
          ctx2[2]
        );
      }
      if (dirty & /*decryptEncrypted*/
      32) {
        set_input_value(
          textarea2,
          /*decryptEncrypted*/
          ctx2[5]
        );
      }
      if (dirty & /*keyOptions*/
      64) {
        each_value = ensure_array_like(
          /*keyOptions*/
          ctx2[6]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$5(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$5(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select1, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*decryptKey, keyOptions*/
      80) {
        select_option(
          select1,
          /*decryptKey*/
          ctx2[4]
        );
      }
      if (dirty & /*decryptMessage*/
      8) {
        set_input_value(
          textarea3,
          /*decryptMessage*/
          ctx2[3]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div10);
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  const alphabetLength = AlphabetUtils.alphabet.length;
  const keyOptions = ArrayUtils.countMap(alphabetLength, (i) => i + 1);
  let encryptMessage = "";
  let encryptKey = 3;
  let encryptEncrypted = "";
  let decryptMessage = "";
  let decryptKey = 3;
  let decryptEncrypted = "";
  function encrypt() {
    $$invalidate(2, encryptEncrypted = CaesarCipher.encrypt(encryptMessage, encryptKey));
  }
  function decrypt() {
    $$invalidate(3, decryptMessage = CaesarCipher.decrypt(decryptEncrypted, decryptKey));
  }
  function textarea0_input_handler() {
    encryptMessage = this.value;
    $$invalidate(0, encryptMessage);
  }
  function select0_change_handler() {
    encryptKey = select_value(this);
    $$invalidate(1, encryptKey);
    $$invalidate(6, keyOptions);
  }
  function textarea1_input_handler() {
    encryptEncrypted = this.value;
    $$invalidate(2, encryptEncrypted);
  }
  function textarea2_input_handler() {
    decryptEncrypted = this.value;
    $$invalidate(5, decryptEncrypted);
  }
  function select1_change_handler() {
    decryptKey = select_value(this);
    $$invalidate(4, decryptKey);
    $$invalidate(6, keyOptions);
  }
  function textarea3_input_handler() {
    decryptMessage = this.value;
    $$invalidate(3, decryptMessage);
  }
  return [
    encryptMessage,
    encryptKey,
    encryptEncrypted,
    decryptMessage,
    decryptKey,
    decryptEncrypted,
    keyOptions,
    encrypt,
    decrypt,
    textarea0_input_handler,
    select0_change_handler,
    textarea1_input_handler,
    textarea2_input_handler,
    select1_change_handler,
    textarea3_input_handler
  ];
}
class CaesarCipher_1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$5, safe_not_equal, {});
  }
}
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[21] = list;
  child_ctx[22] = i;
  return child_ctx;
}
function get_each_context_1$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[23] = list;
  child_ctx[24] = i;
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[24] = i;
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[26] = list;
  child_ctx[22] = i;
  return child_ctx;
}
function get_each_context_4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[27] = list;
  child_ctx[24] = i;
  return child_ctx;
}
function get_each_context_5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[24] = i;
  return child_ctx;
}
function create_each_block_5(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = `${/*x*/
      ctx[24] + 1}`;
      attr(div, "class", "key-header svelte-1wy8f5i");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_4(ctx) {
  let input;
  let mounted;
  let dispose;
  function input_input_handler() {
    ctx[11].call(
      input,
      /*x*/
      ctx[24],
      /*y*/
      ctx[22]
    );
  }
  return {
    c() {
      input = element("input");
      attr(input, "type", "text");
      attr(input, "class", "form-control text-center");
      attr(input, "maxlength", "1");
      toggle_class(input, "border-danger", !!/*encryptKeyErrorMessage*/
      ctx[3]);
      toggle_class(input, "text-danger", !!/*encryptKeyErrorMessage*/
      ctx[3]);
    },
    m(target2, anchor) {
      insert(target2, input, anchor);
      set_input_value(
        input,
        /*encryptKey*/
        ctx[0].characters[
          /*x*/
          ctx[24] + /*y*/
          ctx[22] * /*encryptKey*/
          ctx[0].width
        ]
      );
      if (!mounted) {
        dispose = listen(input, "input", input_input_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*encryptKey*/
      1 && input.value !== /*encryptKey*/
      ctx[0].characters[
        /*x*/
        ctx[24] + /*y*/
        ctx[22] * /*encryptKey*/
        ctx[0].width
      ]) {
        set_input_value(
          input,
          /*encryptKey*/
          ctx[0].characters[
            /*x*/
            ctx[24] + /*y*/
            ctx[22] * /*encryptKey*/
            ctx[0].width
          ]
        );
      }
      if (dirty & /*encryptKeyErrorMessage*/
      8) {
        toggle_class(input, "border-danger", !!/*encryptKeyErrorMessage*/
        ctx[3]);
      }
      if (dirty & /*encryptKeyErrorMessage*/
      8) {
        toggle_class(input, "text-danger", !!/*encryptKeyErrorMessage*/
        ctx[3]);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(input);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block_3(ctx) {
  let div;
  let t1;
  let each_1_anchor;
  let each_value_4 = ensure_array_like({ length: (
    /*encryptKey*/
    ctx[0].width
  ) });
  let each_blocks = [];
  for (let i = 0; i < each_value_4.length; i += 1) {
    each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
  }
  return {
    c() {
      div = element("div");
      div.textContent = `${/*y*/
      ctx[22] + 1}`;
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      attr(div, "class", "key-header svelte-1wy8f5i");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      insert(target2, t1, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target2, anchor);
        }
      }
      insert(target2, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*encryptKey, encryptKeyErrorMessage*/
      9) {
        each_value_4 = ensure_array_like({ length: (
          /*encryptKey*/
          ctx2[0].width
        ) });
        let i;
        for (i = 0; i < each_value_4.length; i += 1) {
          const child_ctx = get_each_context_4(ctx2, each_value_4, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_4(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_4.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
        detach(t1);
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  let t;
  return {
    c() {
      div = element("div");
      t = text(
        /*encryptKeyErrorMessage*/
        ctx[3]
      );
      attr(div, "class", "text-danger my-3");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*encryptKeyErrorMessage*/
      8)
        set_data(
          t,
          /*encryptKeyErrorMessage*/
          ctx2[3]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_2(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = `${/*x*/
      ctx[24] + 1}`;
      attr(div, "class", "key-header svelte-1wy8f5i");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_1$1(ctx) {
  let input;
  let mounted;
  let dispose;
  function input_input_handler_1() {
    ctx[14].call(
      input,
      /*x*/
      ctx[24],
      /*y*/
      ctx[22]
    );
  }
  return {
    c() {
      input = element("input");
      attr(input, "type", "text");
      attr(input, "class", "form-control text-center");
      attr(input, "maxlength", "1");
      toggle_class(input, "border-danger", !!/*decryptKeyErrorMessage*/
      ctx[6]);
      toggle_class(input, "text-danger", !!/*decryptKeyErrorMessage*/
      ctx[6]);
    },
    m(target2, anchor) {
      insert(target2, input, anchor);
      set_input_value(
        input,
        /*decryptKey*/
        ctx[1].characters[
          /*x*/
          ctx[24] + /*y*/
          ctx[22] * /*decryptKey*/
          ctx[1].width
        ]
      );
      if (!mounted) {
        dispose = listen(input, "input", input_input_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*decryptKey*/
      2 && input.value !== /*decryptKey*/
      ctx[1].characters[
        /*x*/
        ctx[24] + /*y*/
        ctx[22] * /*decryptKey*/
        ctx[1].width
      ]) {
        set_input_value(
          input,
          /*decryptKey*/
          ctx[1].characters[
            /*x*/
            ctx[24] + /*y*/
            ctx[22] * /*decryptKey*/
            ctx[1].width
          ]
        );
      }
      if (dirty & /*decryptKeyErrorMessage*/
      64) {
        toggle_class(input, "border-danger", !!/*decryptKeyErrorMessage*/
        ctx[6]);
      }
      if (dirty & /*decryptKeyErrorMessage*/
      64) {
        toggle_class(input, "text-danger", !!/*decryptKeyErrorMessage*/
        ctx[6]);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(input);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block$4(ctx) {
  let div;
  let t1;
  let each_1_anchor;
  let each_value_1 = ensure_array_like({ length: (
    /*decryptKey*/
    ctx[1].width
  ) });
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
  }
  return {
    c() {
      div = element("div");
      div.textContent = `${/*y*/
      ctx[22] + 1}`;
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      attr(div, "class", "key-header svelte-1wy8f5i");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      insert(target2, t1, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target2, anchor);
        }
      }
      insert(target2, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*decryptKey, decryptKeyErrorMessage*/
      66) {
        each_value_1 = ensure_array_like({ length: (
          /*decryptKey*/
          ctx2[1].width
        ) });
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1$1(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_1$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_1.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
        detach(t1);
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block(ctx) {
  let div;
  let t;
  return {
    c() {
      div = element("div");
      t = text(
        /*decryptKeyErrorMessage*/
        ctx[6]
      );
      attr(div, "class", "text-danger my-3");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*decryptKeyErrorMessage*/
      64)
        set_data(
          t,
          /*decryptKeyErrorMessage*/
          ctx2[6]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_fragment$4(ctx) {
  let div14;
  let h1;
  let t1;
  let div6;
  let div5;
  let div0;
  let label0;
  let t3;
  let textarea0;
  let t4;
  let div3;
  let label1;
  let t6;
  let div2;
  let div1;
  let t7;
  let t8;
  let div2_style_value;
  let t9;
  let t10;
  let div4;
  let label2;
  let t12;
  let textarea1;
  let t13;
  let button0;
  let t14;
  let button0_disabled_value;
  let t15;
  let div13;
  let div12;
  let div7;
  let label3;
  let t17;
  let textarea2;
  let t18;
  let div10;
  let label4;
  let t20;
  let div9;
  let div8;
  let t21;
  let t22;
  let div9_style_value;
  let t23;
  let t24;
  let div11;
  let label5;
  let t26;
  let textarea3;
  let t27;
  let button1;
  let t28;
  let button1_disabled_value;
  let mounted;
  let dispose;
  let each_value_5 = ensure_array_like({ length: (
    /*encryptKey*/
    ctx[0].width
  ) });
  let each_blocks_3 = [];
  for (let i = 0; i < each_value_5.length; i += 1) {
    each_blocks_3[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
  }
  let each_value_3 = ensure_array_like({ length: (
    /*encryptKey*/
    ctx[0].height
  ) });
  let each_blocks_2 = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }
  let if_block0 = (
    /*encryptKeyErrorMessage*/
    ctx[3] && create_if_block_1(ctx)
  );
  let each_value_2 = ensure_array_like({ length: (
    /*decryptKey*/
    ctx[1].width
  ) });
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
  }
  let each_value = ensure_array_like({ length: (
    /*decryptKey*/
    ctx[1].height
  ) });
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
  }
  let if_block1 = (
    /*decryptKeyErrorMessage*/
    ctx[6] && create_if_block(ctx)
  );
  return {
    c() {
      div14 = element("div");
      h1 = element("h1");
      h1.textContent = "Szyfr Polibiusza";
      t1 = space();
      div6 = element("div");
      div5 = element("div");
      div0 = element("div");
      label0 = element("label");
      label0.textContent = "Tekst jawny";
      t3 = space();
      textarea0 = element("textarea");
      t4 = space();
      div3 = element("div");
      label1 = element("label");
      label1.textContent = "Klucz";
      t6 = space();
      div2 = element("div");
      div1 = element("div");
      t7 = space();
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      t8 = space();
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t9 = space();
      if (if_block0)
        if_block0.c();
      t10 = space();
      div4 = element("div");
      label2 = element("label");
      label2.textContent = "Tekst zaszyfrowany";
      t12 = space();
      textarea1 = element("textarea");
      t13 = space();
      button0 = element("button");
      t14 = text("Szyfruj");
      t15 = space();
      div13 = element("div");
      div12 = element("div");
      div7 = element("div");
      label3 = element("label");
      label3.textContent = "Tekst zaszyfrowany";
      t17 = space();
      textarea2 = element("textarea");
      t18 = space();
      div10 = element("div");
      label4 = element("label");
      label4.textContent = "Klucz";
      t20 = space();
      div9 = element("div");
      div8 = element("div");
      t21 = space();
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t22 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t23 = space();
      if (if_block1)
        if_block1.c();
      t24 = space();
      div11 = element("div");
      label5 = element("label");
      label5.textContent = "Tekst jawny";
      t26 = space();
      textarea3 = element("textarea");
      t27 = space();
      button1 = element("button");
      t28 = text("Deszyfruj");
      attr(h1, "class", "mb-4");
      attr(label0, "for", "encrypt-message");
      attr(label0, "class", "form-label");
      attr(textarea0, "spellcheck", "false");
      attr(textarea0, "id", "encrypt-message");
      attr(textarea0, "class", "form-control");
      attr(div0, "class", "mb-3");
      attr(label1, "for", "encrypt-key");
      attr(label1, "class", "form-label");
      attr(div1, "class", "key-header empty svelte-1wy8f5i");
      attr(div2, "style", div2_style_value = `display: grid; gap: 0.5rem; grid-template-columns: repeat(${/*encryptKey*/
      ctx[0].width + 1}, 1fr)`);
      attr(div3, "class", "mb-3");
      attr(label2, "for", "encrypt-encrypted");
      attr(label2, "class", "form-label");
      attr(textarea1, "spellcheck", "false");
      attr(textarea1, "id", "encrypt-encrypted");
      attr(textarea1, "class", "form-control");
      attr(div4, "class", "mb-3");
      attr(button0, "class", "btn btn-primary");
      button0.disabled = button0_disabled_value = !!/*encryptKeyErrorMessage*/
      ctx[3];
      attr(div5, "class", "card-body");
      attr(div6, "class", "card mb-3");
      attr(label3, "for", "decrypt-encrypted");
      attr(label3, "class", "form-label");
      attr(textarea2, "spellcheck", "false");
      attr(textarea2, "id", "decrypt-encrypted");
      attr(textarea2, "class", "form-control");
      attr(div7, "class", "mb-3");
      attr(label4, "for", "decrypt-key");
      attr(label4, "class", "form-label");
      attr(div8, "class", "key-header empty svelte-1wy8f5i");
      attr(div9, "style", div9_style_value = `display: grid; gap: 0.5rem; grid-template-columns: repeat(${/*decryptKey*/
      ctx[1].width + 1}, 1fr)`);
      attr(div10, "class", "mb-3");
      attr(label5, "for", "decrypt-message");
      attr(label5, "class", "form-label");
      attr(textarea3, "spellcheck", "false");
      attr(textarea3, "id", "decrypt-message");
      attr(textarea3, "class", "form-control");
      attr(div11, "class", "mb-3");
      attr(button1, "class", "btn btn-primary");
      button1.disabled = button1_disabled_value = !!/*decryptKeyErrorMessage*/
      ctx[6];
      attr(div12, "class", "card-body");
      attr(div13, "class", "card");
      attr(div14, "class", "container my-5");
    },
    m(target2, anchor) {
      insert(target2, div14, anchor);
      append(div14, h1);
      append(div14, t1);
      append(div14, div6);
      append(div6, div5);
      append(div5, div0);
      append(div0, label0);
      append(div0, t3);
      append(div0, textarea0);
      set_input_value(
        textarea0,
        /*encryptMessage*/
        ctx[2]
      );
      append(div5, t4);
      append(div5, div3);
      append(div3, label1);
      append(div3, t6);
      append(div3, div2);
      append(div2, div1);
      append(div2, t7);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        if (each_blocks_3[i]) {
          each_blocks_3[i].m(div2, null);
        }
      }
      append(div2, t8);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(div2, null);
        }
      }
      append(div3, t9);
      if (if_block0)
        if_block0.m(div3, null);
      append(div5, t10);
      append(div5, div4);
      append(div4, label2);
      append(div4, t12);
      append(div4, textarea1);
      set_input_value(
        textarea1,
        /*encryptEncrypted*/
        ctx[4]
      );
      append(div5, t13);
      append(div5, button0);
      append(button0, t14);
      append(div14, t15);
      append(div14, div13);
      append(div13, div12);
      append(div12, div7);
      append(div7, label3);
      append(div7, t17);
      append(div7, textarea2);
      set_input_value(
        textarea2,
        /*decryptEncrypted*/
        ctx[7]
      );
      append(div12, t18);
      append(div12, div10);
      append(div10, label4);
      append(div10, t20);
      append(div10, div9);
      append(div9, div8);
      append(div9, t21);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div9, null);
        }
      }
      append(div9, t22);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div9, null);
        }
      }
      append(div10, t23);
      if (if_block1)
        if_block1.m(div10, null);
      append(div12, t24);
      append(div12, div11);
      append(div11, label5);
      append(div11, t26);
      append(div11, textarea3);
      set_input_value(
        textarea3,
        /*decryptMessage*/
        ctx[5]
      );
      append(div12, t27);
      append(div12, button1);
      append(button1, t28);
      if (!mounted) {
        dispose = [
          listen(
            textarea0,
            "input",
            /*textarea0_input_handler*/
            ctx[10]
          ),
          listen(
            textarea1,
            "input",
            /*textarea1_input_handler*/
            ctx[12]
          ),
          listen(
            button0,
            "click",
            /*encrypt*/
            ctx[8]
          ),
          listen(
            textarea2,
            "input",
            /*textarea2_input_handler*/
            ctx[13]
          ),
          listen(
            textarea3,
            "input",
            /*textarea3_input_handler*/
            ctx[15]
          ),
          listen(
            button1,
            "click",
            /*decrypt*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*encryptMessage*/
      4) {
        set_input_value(
          textarea0,
          /*encryptMessage*/
          ctx2[2]
        );
      }
      if (dirty & /*encryptKey*/
      1) {
        each_value_5 = ensure_array_like({ length: (
          /*encryptKey*/
          ctx2[0].width
        ) });
        let i;
        for (i = 0; i < each_value_5.length; i += 1) {
          const child_ctx = get_each_context_5(ctx2, each_value_5, i);
          if (each_blocks_3[i]) {
            each_blocks_3[i].p(child_ctx, dirty);
          } else {
            each_blocks_3[i] = create_each_block_5(child_ctx);
            each_blocks_3[i].c();
            each_blocks_3[i].m(div2, t8);
          }
        }
        for (; i < each_blocks_3.length; i += 1) {
          each_blocks_3[i].d(1);
        }
        each_blocks_3.length = each_value_5.length;
      }
      if (dirty & /*encryptKey, encryptKeyErrorMessage*/
      9) {
        each_value_3 = ensure_array_like({ length: (
          /*encryptKey*/
          ctx2[0].height
        ) });
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3(ctx2, each_value_3, i);
          if (each_blocks_2[i]) {
            each_blocks_2[i].p(child_ctx, dirty);
          } else {
            each_blocks_2[i] = create_each_block_3(child_ctx);
            each_blocks_2[i].c();
            each_blocks_2[i].m(div2, null);
          }
        }
        for (; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].d(1);
        }
        each_blocks_2.length = each_value_3.length;
      }
      if (dirty & /*encryptKey*/
      1 && div2_style_value !== (div2_style_value = `display: grid; gap: 0.5rem; grid-template-columns: repeat(${/*encryptKey*/
      ctx2[0].width + 1}, 1fr)`)) {
        attr(div2, "style", div2_style_value);
      }
      if (
        /*encryptKeyErrorMessage*/
        ctx2[3]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_1(ctx2);
          if_block0.c();
          if_block0.m(div3, null);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & /*encryptEncrypted*/
      16) {
        set_input_value(
          textarea1,
          /*encryptEncrypted*/
          ctx2[4]
        );
      }
      if (dirty & /*encryptKeyErrorMessage*/
      8 && button0_disabled_value !== (button0_disabled_value = !!/*encryptKeyErrorMessage*/
      ctx2[3])) {
        button0.disabled = button0_disabled_value;
      }
      if (dirty & /*decryptEncrypted*/
      128) {
        set_input_value(
          textarea2,
          /*decryptEncrypted*/
          ctx2[7]
        );
      }
      if (dirty & /*decryptKey*/
      2) {
        each_value_2 = ensure_array_like({ length: (
          /*decryptKey*/
          ctx2[1].width
        ) });
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2(ctx2, each_value_2, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_2(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div9, t22);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_2.length;
      }
      if (dirty & /*decryptKey, decryptKeyErrorMessage*/
      66) {
        each_value = ensure_array_like({ length: (
          /*decryptKey*/
          ctx2[1].height
        ) });
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$4(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$4(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div9, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*decryptKey*/
      2 && div9_style_value !== (div9_style_value = `display: grid; gap: 0.5rem; grid-template-columns: repeat(${/*decryptKey*/
      ctx2[1].width + 1}, 1fr)`)) {
        attr(div9, "style", div9_style_value);
      }
      if (
        /*decryptKeyErrorMessage*/
        ctx2[6]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block(ctx2);
          if_block1.c();
          if_block1.m(div10, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty & /*decryptMessage*/
      32) {
        set_input_value(
          textarea3,
          /*decryptMessage*/
          ctx2[5]
        );
      }
      if (dirty & /*decryptKeyErrorMessage*/
      64 && button1_disabled_value !== (button1_disabled_value = !!/*decryptKeyErrorMessage*/
      ctx2[6])) {
        button1.disabled = button1_disabled_value;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div14);
      }
      destroy_each(each_blocks_3, detaching);
      destroy_each(each_blocks_2, detaching);
      if (if_block0)
        if_block0.d();
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let encryptMessage = "";
  let encryptKey = filledCheckerboard();
  let encryptKeyErrorMessage = "";
  let encryptEncrypted = "";
  let decryptMessage = "";
  let decryptKey = filledCheckerboard();
  let decryptKeyErrorMessage = "";
  let decryptEncrypted = "";
  function filledCheckerboard() {
    const checkerboard = new PolybiusCheckerboard(7, 5);
    AlphabetUtils.alphabet.forEach((character, index) => checkerboard.characters[index] = character);
    return checkerboard;
  }
  function encrypt() {
    $$invalidate(4, encryptEncrypted = PolybiusCipher.encrypt(encryptMessage, encryptKey));
  }
  function decrypt() {
    $$invalidate(5, decryptMessage = PolybiusCipher.decrypt(decryptEncrypted, decryptKey));
  }
  function onEncryptKeyChange() {
    const { missing } = validateKey(encryptKey);
    if (missing.length === 0) {
      $$invalidate(3, encryptKeyErrorMessage = "");
      return;
    }
    $$invalidate(3, encryptKeyErrorMessage = `Klucz nie zawiera liter: ${missing.join(", ")}!`);
  }
  function onDecryptKeyChange() {
    const { missing } = validateKey(decryptKey);
    if (missing.length === 0) {
      $$invalidate(6, decryptKeyErrorMessage = "");
      return;
    }
    $$invalidate(6, decryptKeyErrorMessage = `Klucz nie zawiera liter: ${missing.join(", ")}!`);
  }
  function validateKey(key) {
    const missing = AlphabetUtils.alphabet.filter((character) => !key.characters.includes(character));
    return { missing };
  }
  function textarea0_input_handler() {
    encryptMessage = this.value;
    $$invalidate(2, encryptMessage);
  }
  function input_input_handler(x, y) {
    encryptKey.characters[x + y * encryptKey.width] = this.value;
    $$invalidate(0, encryptKey);
  }
  function textarea1_input_handler() {
    encryptEncrypted = this.value;
    $$invalidate(4, encryptEncrypted);
  }
  function textarea2_input_handler() {
    decryptEncrypted = this.value;
    $$invalidate(7, decryptEncrypted);
  }
  function input_input_handler_1(x, y) {
    decryptKey.characters[x + y * decryptKey.width] = this.value;
    $$invalidate(1, decryptKey);
  }
  function textarea3_input_handler() {
    decryptMessage = this.value;
    $$invalidate(5, decryptMessage);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*encryptKey*/
    1) {
      onEncryptKeyChange();
    }
    if ($$self.$$.dirty & /*decryptKey*/
    2) {
      onDecryptKeyChange();
    }
  };
  return [
    encryptKey,
    decryptKey,
    encryptMessage,
    encryptKeyErrorMessage,
    encryptEncrypted,
    decryptMessage,
    decryptKeyErrorMessage,
    decryptEncrypted,
    encrypt,
    decrypt,
    textarea0_input_handler,
    input_input_handler,
    textarea1_input_handler,
    textarea2_input_handler,
    input_input_handler_1,
    textarea3_input_handler
  ];
}
class PolybiusCipher_1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$4, safe_not_equal, {});
  }
}
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[14] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[14] = list[i];
  return child_ctx;
}
function create_each_block_1(ctx) {
  let option;
  return {
    c() {
      option = element("option");
      option.textContent = `${/*character*/
      ctx[14].toUpperCase()}`;
      option.__value = /*character*/
      ctx[14];
      set_input_value(option, option.__value);
    },
    m(target2, anchor) {
      insert(target2, option, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_each_block$3(ctx) {
  let option;
  return {
    c() {
      option = element("option");
      option.textContent = `${/*character*/
      ctx[14].toUpperCase()}`;
      option.__value = /*character*/
      ctx[14];
      set_input_value(option, option.__value);
    },
    m(target2, anchor) {
      insert(target2, option, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_fragment$3(ctx) {
  let div10;
  let h1;
  let t1;
  let div4;
  let div3;
  let div0;
  let label0;
  let t3;
  let textarea0;
  let t4;
  let div1;
  let label1;
  let t6;
  let select0;
  let t7;
  let div2;
  let label2;
  let t9;
  let textarea1;
  let t10;
  let button0;
  let t12;
  let div9;
  let div8;
  let div5;
  let label3;
  let t14;
  let textarea2;
  let t15;
  let div6;
  let label4;
  let t17;
  let select1;
  let t18;
  let div7;
  let label5;
  let t20;
  let textarea3;
  let t21;
  let button1;
  let mounted;
  let dispose;
  let each_value_1 = ensure_array_like(AlphabetUtils.alphabet);
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let each_value = ensure_array_like(AlphabetUtils.alphabet);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  }
  return {
    c() {
      div10 = element("div");
      h1 = element("h1");
      h1.textContent = "Szyfr Tritemiusza";
      t1 = space();
      div4 = element("div");
      div3 = element("div");
      div0 = element("div");
      label0 = element("label");
      label0.textContent = "Tekst jawny";
      t3 = space();
      textarea0 = element("textarea");
      t4 = space();
      div1 = element("div");
      label1 = element("label");
      label1.textContent = "Klucz";
      t6 = space();
      select0 = element("select");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t7 = space();
      div2 = element("div");
      label2 = element("label");
      label2.textContent = "Tekst zaszyfrowany";
      t9 = space();
      textarea1 = element("textarea");
      t10 = space();
      button0 = element("button");
      button0.textContent = "Szyfruj";
      t12 = space();
      div9 = element("div");
      div8 = element("div");
      div5 = element("div");
      label3 = element("label");
      label3.textContent = "Tekst zaszyfrowany";
      t14 = space();
      textarea2 = element("textarea");
      t15 = space();
      div6 = element("div");
      label4 = element("label");
      label4.textContent = "Klucz";
      t17 = space();
      select1 = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t18 = space();
      div7 = element("div");
      label5 = element("label");
      label5.textContent = "Tekst jawny";
      t20 = space();
      textarea3 = element("textarea");
      t21 = space();
      button1 = element("button");
      button1.textContent = "Deszyfruj";
      attr(h1, "class", "mb-4");
      attr(label0, "for", "encrypt-message");
      attr(label0, "class", "form-label");
      attr(textarea0, "spellcheck", "false");
      attr(textarea0, "id", "encrypt-message");
      attr(textarea0, "class", "form-control");
      attr(div0, "class", "mb-3");
      attr(label1, "for", "encrypt-key");
      attr(label1, "class", "form-label");
      attr(select0, "id", "encrypt-key");
      attr(select0, "class", "form-select");
      if (
        /*encryptKey*/
        ctx[1] === void 0
      )
        add_render_callback(() => (
          /*select0_change_handler*/
          ctx[9].call(select0)
        ));
      attr(div1, "class", "mb-3");
      attr(label2, "for", "encrypt-encrypted");
      attr(label2, "class", "form-label");
      attr(textarea1, "spellcheck", "false");
      attr(textarea1, "id", "encrypt-encrypted");
      attr(textarea1, "class", "form-control");
      attr(div2, "class", "mb-3");
      attr(button0, "class", "btn btn-primary");
      attr(div3, "class", "card-body");
      attr(div4, "class", "card mb-3");
      attr(label3, "for", "decrypt-encrypted");
      attr(label3, "class", "form-label");
      attr(textarea2, "spellcheck", "false");
      attr(textarea2, "id", "decrypt-encrypted");
      attr(textarea2, "class", "form-control");
      attr(div5, "class", "mb-3");
      attr(label4, "for", "decrypt-key");
      attr(label4, "class", "form-label");
      attr(select1, "id", "decrypt-key");
      attr(select1, "class", "form-select");
      if (
        /*decryptKey*/
        ctx[4] === void 0
      )
        add_render_callback(() => (
          /*select1_change_handler*/
          ctx[12].call(select1)
        ));
      attr(div6, "class", "mb-3");
      attr(label5, "for", "decrypt-message");
      attr(label5, "class", "form-label");
      attr(textarea3, "spellcheck", "false");
      attr(textarea3, "id", "decrypt-message");
      attr(textarea3, "class", "form-control");
      attr(div7, "class", "mb-3");
      attr(button1, "class", "btn btn-primary");
      attr(div8, "class", "card-body");
      attr(div9, "class", "card");
      attr(div10, "class", "container my-5");
    },
    m(target2, anchor) {
      insert(target2, div10, anchor);
      append(div10, h1);
      append(div10, t1);
      append(div10, div4);
      append(div4, div3);
      append(div3, div0);
      append(div0, label0);
      append(div0, t3);
      append(div0, textarea0);
      set_input_value(
        textarea0,
        /*encryptMessage*/
        ctx[0]
      );
      append(div3, t4);
      append(div3, div1);
      append(div1, label1);
      append(div1, t6);
      append(div1, select0);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(select0, null);
        }
      }
      select_option(
        select0,
        /*encryptKey*/
        ctx[1],
        true
      );
      append(div3, t7);
      append(div3, div2);
      append(div2, label2);
      append(div2, t9);
      append(div2, textarea1);
      set_input_value(
        textarea1,
        /*encryptEncrypted*/
        ctx[2]
      );
      append(div3, t10);
      append(div3, button0);
      append(div10, t12);
      append(div10, div9);
      append(div9, div8);
      append(div8, div5);
      append(div5, label3);
      append(div5, t14);
      append(div5, textarea2);
      set_input_value(
        textarea2,
        /*decryptEncrypted*/
        ctx[5]
      );
      append(div8, t15);
      append(div8, div6);
      append(div6, label4);
      append(div6, t17);
      append(div6, select1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select1, null);
        }
      }
      select_option(
        select1,
        /*decryptKey*/
        ctx[4],
        true
      );
      append(div8, t18);
      append(div8, div7);
      append(div7, label5);
      append(div7, t20);
      append(div7, textarea3);
      set_input_value(
        textarea3,
        /*decryptMessage*/
        ctx[3]
      );
      append(div8, t21);
      append(div8, button1);
      if (!mounted) {
        dispose = [
          listen(
            textarea0,
            "input",
            /*textarea0_input_handler*/
            ctx[8]
          ),
          listen(
            select0,
            "change",
            /*select0_change_handler*/
            ctx[9]
          ),
          listen(
            textarea1,
            "input",
            /*textarea1_input_handler*/
            ctx[10]
          ),
          listen(
            button0,
            "click",
            /*encrypt*/
            ctx[6]
          ),
          listen(
            textarea2,
            "input",
            /*textarea2_input_handler*/
            ctx[11]
          ),
          listen(
            select1,
            "change",
            /*select1_change_handler*/
            ctx[12]
          ),
          listen(
            textarea3,
            "input",
            /*textarea3_input_handler*/
            ctx[13]
          ),
          listen(
            button1,
            "click",
            /*decrypt*/
            ctx[7]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*encryptMessage*/
      1) {
        set_input_value(
          textarea0,
          /*encryptMessage*/
          ctx2[0]
        );
      }
      if (dirty & /*encryptKey*/
      2) {
        select_option(
          select0,
          /*encryptKey*/
          ctx2[1]
        );
      }
      if (dirty & /*encryptEncrypted*/
      4) {
        set_input_value(
          textarea1,
          /*encryptEncrypted*/
          ctx2[2]
        );
      }
      if (dirty & /*decryptEncrypted*/
      32) {
        set_input_value(
          textarea2,
          /*decryptEncrypted*/
          ctx2[5]
        );
      }
      if (dirty & /*decryptKey*/
      16) {
        select_option(
          select1,
          /*decryptKey*/
          ctx2[4]
        );
      }
      if (dirty & /*decryptMessage*/
      8) {
        set_input_value(
          textarea3,
          /*decryptMessage*/
          ctx2[3]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div10);
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let encryptMessage = "";
  let encryptKey = AlphabetUtils.alphabet[0];
  let encryptEncrypted = "";
  let decryptMessage = "";
  let decryptKey = AlphabetUtils.alphabet[0];
  let decryptEncrypted = "";
  function encrypt() {
    $$invalidate(2, encryptEncrypted = TrithemiusCipher.encrypt(encryptMessage, encryptKey));
  }
  function decrypt() {
    $$invalidate(3, decryptMessage = TrithemiusCipher.decrypt(decryptEncrypted, decryptKey));
  }
  function textarea0_input_handler() {
    encryptMessage = this.value;
    $$invalidate(0, encryptMessage);
  }
  function select0_change_handler() {
    encryptKey = select_value(this);
    $$invalidate(1, encryptKey);
  }
  function textarea1_input_handler() {
    encryptEncrypted = this.value;
    $$invalidate(2, encryptEncrypted);
  }
  function textarea2_input_handler() {
    decryptEncrypted = this.value;
    $$invalidate(5, decryptEncrypted);
  }
  function select1_change_handler() {
    decryptKey = select_value(this);
    $$invalidate(4, decryptKey);
  }
  function textarea3_input_handler() {
    decryptMessage = this.value;
    $$invalidate(3, decryptMessage);
  }
  return [
    encryptMessage,
    encryptKey,
    encryptEncrypted,
    decryptMessage,
    decryptKey,
    decryptEncrypted,
    encrypt,
    decrypt,
    textarea0_input_handler,
    select0_change_handler,
    textarea1_input_handler,
    textarea2_input_handler,
    select1_change_handler,
    textarea3_input_handler
  ];
}
class TrithemiusCipher_1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment$3, safe_not_equal, {});
  }
}
const ciphers = [
  {
    key: "caesar",
    name: "Szyfr Cezara",
    component: CaesarCipher_1
  },
  {
    key: "polybius",
    name: "Szyfr Polibiusza",
    component: PolybiusCipher_1
  },
  {
    key: "trithemius",
    name: "Szyfr Tritemisuza",
    component: TrithemiusCipher_1
  }
];
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[0] = list[i];
  return child_ctx;
}
function create_default_slot$2(ctx) {
  let div;
  let h3;
  let t1;
  return {
    c() {
      div = element("div");
      h3 = element("h3");
      h3.textContent = `${/*cipher*/
      ctx[0].name}`;
      t1 = space();
      attr(h3, "class", "m-0");
      attr(div, "class", "card-body");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      append(div, h3);
      insert(target2, t1, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
        detach(t1);
      }
    }
  };
}
function create_each_block$2(ctx) {
  let link;
  let current;
  link = new Link({
    props: {
      class: "card text-decoration-none mb-4",
      to: `/ciphers/${/*cipher*/
      ctx[0].key}`,
      $$slots: { default: [create_default_slot$2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(link.$$.fragment);
    },
    m(target2, anchor) {
      mount_component(link, target2, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const link_changes = {};
      if (dirty & /*$$scope*/
      8) {
        link_changes.$$scope = { dirty, ctx: ctx2 };
      }
      link.$set(link_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(link.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(link.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(link, detaching);
    }
  };
}
function create_fragment$2(ctx) {
  let div;
  let h1;
  let t1;
  let current;
  let each_value = ensure_array_like(ciphers);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      h1 = element("h1");
      h1.textContent = "Szyfry";
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(h1, "class", "mb-4");
      attr(div, "class", "container my-5");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      append(div, h1);
      append(div, t1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
class Home extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment$2, safe_not_equal, {});
  }
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[0] = list[i];
  return child_ctx;
}
function create_default_slot_1(ctx) {
  let t;
  return {
    c() {
      t = text("Strona główna");
    },
    m(target2, anchor) {
      insert(target2, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_default_slot$1(ctx) {
  let t_value = (
    /*cipher*/
    ctx[0].name + ""
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target2, anchor) {
      insert(target2, t, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_each_block$1(ctx) {
  let li;
  let link;
  let t;
  let current;
  link = new Link({
    props: {
      class: "nav-link p-3",
      to: `/ciphers/${/*cipher*/
      ctx[0].key}`,
      $$slots: { default: [create_default_slot$1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      li = element("li");
      create_component(link.$$.fragment);
      t = space();
    },
    m(target2, anchor) {
      insert(target2, li, anchor);
      mount_component(link, li, null);
      append(li, t);
      current = true;
    },
    p(ctx2, dirty) {
      const link_changes = {};
      if (dirty & /*$$scope*/
      8) {
        link_changes.$$scope = { dirty, ctx: ctx2 };
      }
      link.$set(link_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(link.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(link.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      destroy_component(link);
    }
  };
}
function create_fragment$1(ctx) {
  let header;
  let ul;
  let li;
  let link;
  let t;
  let current;
  link = new Link({
    props: {
      class: "nav-link p-3",
      to: "/",
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  let each_value = ensure_array_like(ciphers);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  return {
    c() {
      header = element("header");
      ul = element("ul");
      li = element("li");
      create_component(link.$$.fragment);
      t = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", "svelte-19a6t20");
      attr(header, "class", "svelte-19a6t20");
    },
    m(target2, anchor) {
      insert(target2, header, anchor);
      append(header, ul);
      append(ul, li);
      mount_component(link, li, null);
      append(ul, t);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      const link_changes = {};
      if (dirty & /*$$scope*/
      8) {
        link_changes.$$scope = { dirty, ctx: ctx2 };
      }
      link.$set(link_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(link.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(link.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(header);
      }
      destroy_component(link);
      destroy_each(each_blocks, detaching);
    }
  };
}
class Header extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment$1, safe_not_equal, {});
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[0] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let route;
  let current;
  route = new Route({
    props: {
      path: `/ciphers/${/*cipher*/
      ctx[0].key}`,
      component: (
        /*cipher*/
        ctx[0].component
      )
    }
  });
  return {
    c() {
      create_component(route.$$.fragment);
    },
    m(target2, anchor) {
      mount_component(route, target2, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(route.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(route.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(route, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let header;
  let t0;
  let route;
  let t1;
  let each_1_anchor;
  let current;
  header = new Header({});
  route = new Route({ props: { path: "/", component: Home } });
  let each_value = ensure_array_like(ciphers);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      create_component(header.$$.fragment);
      t0 = space();
      create_component(route.$$.fragment);
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target2, anchor) {
      mount_component(header, target2, anchor);
      insert(target2, t0, anchor);
      mount_component(route, target2, anchor);
      insert(target2, t1, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target2, anchor);
        }
      }
      insert(target2, each_1_anchor, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(header.$$.fragment, local);
      transition_in(route.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(header.$$.fragment, local);
      transition_out(route.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
        detach(each_1_anchor);
      }
      destroy_component(header, detaching);
      destroy_component(route, detaching);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_fragment(ctx) {
  let router;
  let current;
  router = new Router({
    props: {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(router.$$.fragment);
    },
    m(target2, anchor) {
      mount_component(router, target2, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const router_changes = {};
      if (dirty & /*$$scope*/
      8) {
        router_changes.$$scope = { dirty, ctx: ctx2 };
      }
      router.$set(router_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(router.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(router.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(router, detaching);
    }
  };
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
}
const targetId = "app";
const target = document.getElementById(targetId);
if (!target)
  throw new Error(`Could not find the app root element with id ${targetId}!`);
new App({ target });
