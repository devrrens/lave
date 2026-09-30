var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.16.2_unenv@2.0.0-rc.24_workerd@1.20260926.1/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.16.2_unenv@2.0.0-rc.24_workerd@1.20260926.1/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../node_modules/.pnpm/wrangler@4.143.1_@cloudflare+workers-types@5.20260929.1_@types+node@20.19.43/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y2, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../node_modules/.pnpm/@cloudflare+unenv-preset@2.16.2_unenv@2.0.0-rc.24_workerd@1.20260926.1/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../node_modules/.pnpm/wrangler@4.143.1_@cloudflare+workers-types@5.20260929.1_@types+node@20.19.43/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// _worker.js/index.js
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var ne = Object.create;
var U = Object.defineProperty;
var re = Object.getOwnPropertyDescriptor;
var ae = Object.getOwnPropertyNames;
var oe = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var E = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "E");
var V = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "V");
var ce = /* @__PURE__ */ __name((e, t, n, s) => {
  if (t && typeof t == "object" || typeof t == "function") for (let a of ae(t)) !ie.call(e, a) && a !== n && U(e, a, { get: /* @__PURE__ */ __name(() => t[a], "get"), enumerable: !(s = re(t, a)) || s.enumerable });
  return e;
}, "ce");
var q = /* @__PURE__ */ __name((e, t, n) => (n = e != null ? ne(oe(e)) : {}, ce(t || !e || !e.__esModule ? U(n, "default", { value: e, enumerable: true }) : n, e)), "q");
var m;
var u = E(() => {
  m = { collectedLocales: [] };
});
var _;
var l = E(() => {
  _ = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "4021a093f8e4cbf1d5fc0281226841eaa6a7a64f91" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/orders.ts#createOrder" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "0046f2d3bfdba72181da268a2a4f7e1308f11ba139" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/testimonials-settings.ts#getSettings" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "00d22ad9f7027dd26950cd50372d054775408d86d2" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/testimonials-settings.ts#getTestimonials" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "403d500eb685f081d61c4b0d63915337fc0235f323" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/testimonials-settings.ts#updateSettings" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "4088beffbda34aaad2366ccd598c1e61f1875aadba" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/testimonials-settings.ts#createTestimonial" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40e1b20c7039cf8ce3f5ba2a9891d1cfb13fecc7fa" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/testimonials-settings.ts#deleteTestimonial" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "60cfca2ae9a2a52393a1aa61ebbc55e57e59896abc" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/testimonials-settings.ts#updateTestimonial" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "00a80c0922f33c4ba766311491d81bf0a0f858589e" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/categories.ts#getCategories" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40276f62c9035c0a490147df36ad0d66ce448253aa" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/categories.ts#createCategory" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40dc4480cd9268ccc96eecb0856d37f4a4eebc2450" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/categories.ts#deleteCategory" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "6012791a006be88389974692345319f8a95d8bf764" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/categories.ts#updateCategory" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "607b459ba4bba5d16475637bb171af8d4500f402d0" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/admin.ts#updateStock" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "60e8f778f79acf744f986df2950e64fa2cc1917042" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/admin.ts#updateOrderStatus" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40a3d9bb55ed6a334408a3d5eb1791be86c16b1ebd" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/products.ts#createProduct" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40c0f326b531e365e5c33432250f13a8df60044f9c" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/products.ts#deleteProduct" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40e5bffe30509518bd49b7aca9ff2fe56713f28453" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/products.ts#getProducts" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40f16adf1a19151157b08ed1e3cac5f058c9932c35" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/products.ts#getProductById" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "40f422e885c6769edd8eb36f22d1ccaf201c061668" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/products.ts#duplicateProduct" }] }, { src: "^/(.*)$", has: [{ type: "header", key: "next-action", value: "60e180d7cbdecb5049d7907aecf0f1417a30f11ef4" }], transforms: [{ type: "request.headers", op: "set", target: { key: "x-server-action-name" }, args: "lib/actions/products.ts#updateProduct" }] }, { continue: true, src: "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", missing: [{ type: "header", key: "x-prerender-revalidate", value: "ef187ffb5ca87f68d2a04a41b17ada6f" }], middlewarePath: "middleware", middlewareRawSrc: ["/admin/:path*"], override: true }, { src: "^/(?<path>.+?)(?:/)?$", dest: "/$path.segments/$segmentPath.segment.rsc", has: [{ type: "header", key: "rsc", value: "1" }, { type: "header", key: "next-router-prefetch", value: "1" }, { type: "header", key: "next-router-segment-prefetch", value: "/(?<segmentPath>.+)" }], continue: true, override: true }, { src: "^/?$", dest: "/index.segments/$segmentPath.segment.rsc", has: [{ type: "header", key: "rsc", value: "1" }, { type: "header", key: "next-router-prefetch", value: "1" }, { type: "header", key: "next-router-segment-prefetch", value: "/(?<segmentPath>.+)" }], continue: true, override: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }, { src: "^/(?<path>.+)(?<rscSuffix>\\.segments/.+\\.segment\\.rsc)(?:/)?$", dest: "/$path.rsc", check: true }], rewrite: [{ src: "^/(?<path>.+)(?<rscSuffix>\\.segments/.+\\.segment\\.rsc)(?:/)?$", dest: "/$path.rsc", check: true, override: true }, { src: "^/admin/categories/(?<nxtPid>[^/]+?)/edit(?<rscSuffix>\\.rsc|\\.prefetch\\.rsc|\\.segments/.+\\.segment\\.rsc)(?:/)?$", dest: "/admin/categories/[id]/edit$rscSuffix?nxtPid=$nxtPid", check: true, override: true }, { src: "^/admin/categories/(?<nxtPid>[^/]+?)/edit(?:/)?$", dest: "/admin/categories/[id]/edit?nxtPid=$nxtPid", check: true, override: true }, { src: "^/admin/products/(?<nxtPid>[^/]+?)/edit(?<rscSuffix>\\.rsc|\\.prefetch\\.rsc|\\.segments/.+\\.segment\\.rsc)(?:/)?$", dest: "/admin/products/[id]/edit$rscSuffix?nxtPid=$nxtPid", check: true, override: true }, { src: "^/admin/products/(?<nxtPid>[^/]+?)/edit(?:/)?$", dest: "/admin/products/[id]/edit?nxtPid=$nxtPid", check: true, override: true }, { src: "^/api/auth/(?<nxtPnextauth>.+?)(?<rscSuffix>\\.rsc|\\.prefetch\\.rsc|\\.segments/.+\\.segment\\.rsc)(?:/)?$", dest: "/api/auth/[...nextauth]$rscSuffix?nxtPnextauth=$nxtPnextauth", check: true, override: true }, { src: "^/api/auth/(?<nxtPnextauth>.+?)(?:/)?$", dest: "/api/auth/[...nextauth]?nxtPnextauth=$nxtPnextauth", check: true, override: true }, { src: "^/product/(?<nxtPslug>[^/]+?)(?<rscSuffix>\\.rsc|\\.prefetch\\.rsc|\\.segments/.+\\.segment\\.rsc)(?:/)?$", dest: "/product/[slug]$rscSuffix?nxtPslug=$nxtPslug", check: true, override: true }, { src: "^/product/(?<nxtPslug>[^/]+?)(?:/)?$", dest: "/product/[slug]?nxtPslug=$nxtPslug", check: true, override: true }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|pH1mOwSBnZEvg6UP4sleV)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404, headers: { "x-next-error-status": "404" } }, { src: "^/.*$", dest: "/500", status: 500, headers: { "x-next-error-status": "500" } }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 32, 48, 64, 96, 128, 256, 384], qualities: [75], remotePatterns: [], localPatterns: [{ pathname: "^(?:\\/uploads(?:\\/(?!\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)|$))$" }, { pathname: "^(?:\\/_next\\/static\\/media(?:\\/(?!\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)|$))$", search: "" }, { pathname: "^(?:\\/_next\\/static\\/immutable\\/media(?:\\/(?!\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)|$))$", search: "" }], minimumCacheTTL: 14400, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "404.segments/_tree.segment.rsc.json": { path: "404.segments/_tree.segment.rsc", contentType: "application/json" }, "500.rsc.json": { path: "500.rsc", contentType: "application/json" }, "500.segments/_tree.segment.rsc.json": { path: "500.segments/_tree.segment.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { slug: "nextjs", version: "16.3.7" }, crons: [] };
});
var f;
var p = E(() => {
  f = { "/.DS_Store": { type: "static" }, "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/404.segments/_tree.segment.rsc.json": { type: "override", path: "/404.segments/_tree.segment.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500.rsc.json": { type: "override", path: "/500.rsc.json", headers: { "content-type": "application/json" } }, "/500.segments/_tree.segment.rsc.json": { type: "override", path: "/500.segments/_tree.segment.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/chunks/03eejjilxp28v.js": { type: "static" }, "/_next/static/chunks/0cz1d0mv5g_q7.js": { type: "static" }, "/_next/static/chunks/0dvxpud6-6_7s.js": { type: "static" }, "/_next/static/chunks/0gzi-aams-2ge.js": { type: "static" }, "/_next/static/chunks/0p_3lyf76ptf3.js": { type: "static" }, "/_next/static/chunks/18a1t679baifw.css": { type: "static" }, "/_next/static/chunks/1bujsuyru_dgt.js": { type: "static" }, "/_next/static/chunks/1dzfj3wctyaz3.js": { type: "static" }, "/_next/static/chunks/1h2s9ylzgu5z9.js": { type: "static" }, "/_next/static/chunks/1m8a8k-pei79y.js": { type: "static" }, "/_next/static/chunks/24bxcr486wbgg.js": { type: "static" }, "/_next/static/chunks/2bkbv5e24tj3u.js": { type: "static" }, "/_next/static/chunks/2ip5d6m5o71l8.js": { type: "static" }, "/_next/static/chunks/2qtl5j-l_al2e.js": { type: "static" }, "/_next/static/chunks/2s-ysls33-lio.js": { type: "static" }, "/_next/static/chunks/2tfltvwl12jtl.js": { type: "static" }, "/_next/static/chunks/2wts_zkuc3vf9.js": { type: "static" }, "/_next/static/chunks/3-czqjf5dwl_5.js": { type: "static" }, "/_next/static/chunks/30amcurvtrb8k.js": { type: "static" }, "/_next/static/chunks/3f-_r3egsw8f6.js": { type: "static" }, "/_next/static/chunks/3nybynf3e8t32.js": { type: "static" }, "/_next/static/chunks/3r5s4up_zgmmr.js": { type: "static" }, "/_next/static/chunks/3z09itt2ofda3.js": { type: "static" }, "/_next/static/chunks/3zhb_zq23hflz.js": { type: "static" }, "/_next/static/chunks/turbopack-3dogtj4_xsz4f.js": { type: "static" }, "/_next/static/media/14e23f9b59180572-s.0t8ljjjn9wtsx.woff2": { type: "static" }, "/_next/static/media/1bffadaabf893a1e-s.3-6t-g6q0vh0a.woff2": { type: "static" }, "/_next/static/media/2a65768255d6b625-s.p.3u4lli0-axodc.woff2": { type: "static" }, "/_next/static/media/2bbe8d2671613f1f-s.0k62hbripvv8p.woff2": { type: "static" }, "/_next/static/media/2c55a0e60120577a-s.0-dom-5bn10r2.woff2": { type: "static" }, "/_next/static/media/5476f68d60460930-s.2uwcyprjm3xu3.woff2": { type: "static" }, "/_next/static/media/65c558afe41e89d6-s.3jppgd0xzx-0d.woff2": { type: "static" }, "/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2": { type: "static" }, "/_next/static/media/9c72aa0f40e4eef8-s.1y4-pdgsjb-pw.woff2": { type: "static" }, "/_next/static/media/ad66f9afd8947f86-s.3lvt2whj97whp.woff2": { type: "static" }, "/_next/static/media/b49b0d9b851e4899-s.2zyohmvb-ks7f.woff2": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/_next/static/pH1mOwSBnZEvg6UP4sleV/_buildManifest.js": { type: "static" }, "/_next/static/pH1mOwSBnZEvg6UP4sleV/_clientMiddlewareManifest.js": { type: "static" }, "/_next/static/pH1mOwSBnZEvg6UP4sleV/_ssgManifest.js": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/next.svg": { type: "static" }, "/uploads/.DS_Store": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/about": { type: "function", entrypoint: "__next-on-pages-dist__/functions/about.func.js" }, "/about.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/about.func.js" }, "/admin/categories/[id]/edit": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/categories/[id]/edit.func.js" }, "/admin/categories/[id]/edit.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/categories/[id]/edit.func.js" }, "/admin/categories/new": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/categories/new.func.js" }, "/admin/categories/new.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/categories/new.func.js" }, "/admin/categories": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/categories.func.js" }, "/admin/categories.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/categories.func.js" }, "/admin/customers": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/customers.func.js" }, "/admin/customers.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/customers.func.js" }, "/admin/homepage": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/homepage.func.js" }, "/admin/homepage.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/homepage.func.js" }, "/admin/inventory": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/inventory.func.js" }, "/admin/inventory.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/inventory.func.js" }, "/admin/login": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/login.func.js" }, "/admin/login.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/login.func.js" }, "/admin/orders": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/orders.func.js" }, "/admin/orders.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/orders.func.js" }, "/admin/products/[id]/edit": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/products/[id]/edit.func.js" }, "/admin/products/[id]/edit.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/products/[id]/edit.func.js" }, "/admin/products/new": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/products/new.func.js" }, "/admin/products/new.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/products/new.func.js" }, "/admin/products": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/products.func.js" }, "/admin/products.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/products.func.js" }, "/admin/promotions": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/promotions.func.js" }, "/admin/promotions.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/promotions.func.js" }, "/admin/settings": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/settings.func.js" }, "/admin/settings.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/settings.func.js" }, "/admin/testimonials": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/testimonials.func.js" }, "/admin/testimonials.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin/testimonials.func.js" }, "/admin": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin.func.js" }, "/admin.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/admin.func.js" }, "/api/auth/[...nextauth]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/auth/[...nextauth].func.js" }, "/api/auth/[...nextauth].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/auth/[...nextauth].func.js" }, "/api/upload": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/upload.func.js" }, "/api/upload.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/upload.func.js" }, "/collection": { type: "function", entrypoint: "__next-on-pages-dist__/functions/collection.func.js" }, "/collection.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/collection.func.js" }, "/contact": { type: "function", entrypoint: "__next-on-pages-dist__/functions/contact.func.js" }, "/contact.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/contact.func.js" }, "/index": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/index.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/product/[slug]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/product/[slug].func.js" }, "/product/[slug].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/product/[slug].func.js" }, "/testimonials": { type: "function", entrypoint: "__next-on-pages-dist__/functions/testimonials.func.js" }, "/testimonials.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/testimonials.func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/404.segments/_tree.segment.rsc": { type: "override", path: "/404.segments/_tree.segment.rsc.json", headers: { "content-type": "application/json" } }, "/500.rsc": { type: "override", path: "/500.rsc.json", headers: { "content-type": "application/json" } }, "/500.segments/_tree.segment.rsc": { type: "override", path: "/500.segments/_tree.segment.rsc.json", headers: { "content-type": "application/json" } }, "/_global-error.html": { type: "override", path: "/_global-error.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_global-error": { type: "override", path: "/_global-error.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_global-error.rsc": { type: "override", path: "/_global-error.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/_global-error.segments/__PAGE__.segment.rsc": { type: "override", path: "/_global-error.segments/__PAGE__.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/_global-error.segments/_full.segment.rsc": { type: "override", path: "/_global-error.segments/_full.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/_global-error.segments/_tree.segment.rsc": { type: "override", path: "/_global-error.segments/_tree.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/_not-found.html": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found.rsc": { type: "override", path: "/_not-found.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/_not-found.segments/_full.segment.rsc": { type: "override", path: "/_not-found.segments/_full.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/_not-found.segments/_not-found/__PAGE__.segment.rsc": { type: "override", path: "/_not-found.segments/_not-found/__PAGE__.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/_not-found.segments/_tree.segment.rsc": { type: "override", path: "/_not-found.segments/_tree.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/cart.html": { type: "override", path: "/cart.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/cart/layout,_N_T_/(storefront)/cart/page,_N_T_/cart", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/cart": { type: "override", path: "/cart.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/cart/layout,_N_T_/(storefront)/cart/page,_N_T_/cart", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/cart.rsc": { type: "override", path: "/cart.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/cart/layout,_N_T_/(storefront)/cart/page,_N_T_/cart", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/cart.segments/!KHN0b3JlZnJvbnQp/cart/__PAGE__.segment.rsc": { type: "override", path: "/cart.segments/!KHN0b3JlZnJvbnQp/cart/__PAGE__.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/cart/layout,_N_T_/(storefront)/cart/page,_N_T_/cart", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/cart.segments/_full.segment.rsc": { type: "override", path: "/cart.segments/_full.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/cart/layout,_N_T_/(storefront)/cart/page,_N_T_/cart", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/cart.segments/_tree.segment.rsc": { type: "override", path: "/cart.segments/_tree.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/cart/layout,_N_T_/(storefront)/cart/page,_N_T_/cart", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/checkout.html": { type: "override", path: "/checkout.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/checkout/layout,_N_T_/(storefront)/checkout/page,_N_T_/checkout", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/checkout": { type: "override", path: "/checkout.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/checkout/layout,_N_T_/(storefront)/checkout/page,_N_T_/checkout", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/checkout.rsc": { type: "override", path: "/checkout.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/checkout/layout,_N_T_/(storefront)/checkout/page,_N_T_/checkout", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/checkout.segments/!KHN0b3JlZnJvbnQp/checkout/__PAGE__.segment.rsc": { type: "override", path: "/checkout.segments/!KHN0b3JlZnJvbnQp/checkout/__PAGE__.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/checkout/layout,_N_T_/(storefront)/checkout/page,_N_T_/checkout", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/checkout.segments/_full.segment.rsc": { type: "override", path: "/checkout.segments/_full.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/checkout/layout,_N_T_/(storefront)/checkout/page,_N_T_/checkout", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/checkout.segments/_tree.segment.rsc": { type: "override", path: "/checkout.segments/_tree.segment.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(storefront)/layout,_N_T_/(storefront)/checkout/layout,_N_T_/(storefront)/checkout/page,_N_T_/checkout", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component", "x-nextjs-postponed": "2" } }, "/robots.txt": { type: "override", path: "/robots.txt", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/sitemap.xml": { type: "override", path: "/sitemap.xml", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, middleware: { type: "middleware", entrypoint: "__next-on-pages-dist__/functions/middleware.func.js" } };
});
var F = V((We, $) => {
  "use strict";
  u();
  l();
  p();
  function w(e, t) {
    e = String(e || "").trim();
    let n = e, s, a = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      s = e[0];
      let i = e.lastIndexOf(s);
      a += e.substring(i + 1), e = e.substring(1, i);
    }
    let r = 0;
    return e = pe(e, (i) => {
      if (/^\(\?[P<']/.test(i)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(i);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(i)}`);
        let d = i.substring(c[0].length, i.length - 1);
        return t && (t[r] = c[1]), r++, `(${d})`;
      }
      return i.substring(0, 3) === "(?:" || r++, i;
    }), e = e.replace(/\[:([^:]+):\]/g, (i, c) => w.characterClasses[c] || i), new w.PCRE(e, a, n, a, s);
  }
  __name(w, "w");
  function pe(e, t) {
    let n = 0, s = 0, a = false;
    for (let o = 0; o < e.length; o++) {
      let r = e[o];
      if (a) {
        a = false;
        continue;
      }
      switch (r) {
        case "(":
          s === 0 && (n = o), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let i = o + 1, c = n === 0 ? "" : e.substring(0, n), d = e.substring(i), h = String(t(e.substring(n, i)));
            e = c + h + d, o = n;
          }
          break;
        case "\\":
          a = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(pe, "pe");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      constructor(s, a, o, r, i) {
        super(s, a), this.pcrePattern = o, this.pcreFlags = r, this.delimiter = i;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(w || (w = {}));
  w.prototype = w.PCRE.prototype;
  $.exports = w;
});
var X = V((H) => {
  "use strict";
  u();
  l();
  p();
  H.parse = Re;
  H.serialize = Te;
  var be = Object.prototype.toString, S = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function Re(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var n = {}, s = t || {}, a = s.decode || je, o = 0; o < e.length; ) {
      var r = e.indexOf("=", o);
      if (r === -1) break;
      var i = e.indexOf(";", o);
      if (i === -1) i = e.length;
      else if (i < r) {
        o = e.lastIndexOf(";", r - 1) + 1;
        continue;
      }
      var c = e.slice(o, r).trim();
      if (n[c] === void 0) {
        var d = e.slice(r + 1, i).trim();
        d.charCodeAt(0) === 34 && (d = d.slice(1, -1)), n[c] = ke(d, a);
      }
      o = i + 1;
    }
    return n;
  }
  __name(Re, "Re");
  function Te(e, t, n) {
    var s = n || {}, a = s.encode || Pe;
    if (typeof a != "function") throw new TypeError("option encode is invalid");
    if (!S.test(e)) throw new TypeError("argument name is invalid");
    var o = a(t);
    if (o && !S.test(o)) throw new TypeError("argument val is invalid");
    var r = e + "=" + o;
    if (s.maxAge != null) {
      var i = s.maxAge - 0;
      if (isNaN(i) || !isFinite(i)) throw new TypeError("option maxAge is invalid");
      r += "; Max-Age=" + Math.floor(i);
    }
    if (s.domain) {
      if (!S.test(s.domain)) throw new TypeError("option domain is invalid");
      r += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!S.test(s.path)) throw new TypeError("option path is invalid");
      r += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!Ne(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      r += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (r += "; HttpOnly"), s.secure && (r += "; Secure"), s.priority) {
      var d = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (d) {
        case "low":
          r += "; Priority=Low";
          break;
        case "medium":
          r += "; Priority=Medium";
          break;
        case "high":
          r += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var h = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (h) {
        case true:
          r += "; SameSite=Strict";
          break;
        case "lax":
          r += "; SameSite=Lax";
          break;
        case "strict":
          r += "; SameSite=Strict";
          break;
        case "none":
          r += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return r;
  }
  __name(Te, "Te");
  function je(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(je, "je");
  function Pe(e) {
    return encodeURIComponent(e);
  }
  __name(Pe, "Pe");
  function Ne(e) {
    return be.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(Ne, "Ne");
  function ke(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(ke, "ke");
});
u();
l();
p();
u();
l();
p();
u();
l();
p();
var b = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
u();
l();
p();
u();
l();
p();
u();
l();
p();
u();
l();
p();
var D = q(F());
function P(e, t, n) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let s = n ? "" : "i", a = [];
  return { match: (0, D.default)(`%${e}%${s}`, a).exec(t), captureGroupKeys: a };
}
__name(P, "P");
function R(e, t, n, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (a, o) => {
    let r = n.indexOf(o);
    return s && r === -1 ? a : (r === -1 ? t[parseInt(o, 10)] : t[r + 1]) || "";
  });
}
__name(R, "R");
function A(e, { url: t, cookies: n, headers: s, routeDest: a }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, s.get(e.key), a) : { valid: s.has(e.key) };
    case "cookie": {
      let o = n[e.key];
      return o && e.value !== void 0 ? M(e.value, o, a) : { valid: o !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), a) : { valid: t.searchParams.has(e.key) };
  }
}
__name(A, "A");
function M(e, t, n) {
  let { match: s, captureGroupKeys: a } = P(e, t);
  return n && s && a.length ? { valid: !!s, newRouteDest: R(n, s, a, { namedOnly: true }) } : { valid: !!s };
}
__name(M, "M");
u();
l();
p();
function z(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", b), new Request(e, { headers: t });
}
__name(z, "z");
u();
l();
p();
function x(e, t, n) {
  let s = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [a, o] of s) {
    let r = a.toLowerCase(), i = n?.match ? R(o, n.match, n.captureGroupKeys) : o;
    r === "set-cookie" ? e.append(r, i) : e.set(r, i);
  }
}
__name(x, "x");
function T(e) {
  return /^https?:\/\//.test(e);
}
__name(T, "T");
function y(e, t) {
  for (let [n, s] of t.entries()) {
    let a = /^nxtP(.+)$/.exec(n), o = /^nxtI(.+)$/.exec(n);
    a?.[1] ? (e.set(n, s), e.set(a[1], s)) : o?.[1] ? e.set(o[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(n) || !!s && !e.getAll(n).includes(s)) && e.append(n, s);
  }
}
__name(y, "y");
function I(e, t) {
  let n = new URL(t, e.url);
  return y(n.searchParams, new URL(e.url).searchParams), n.pathname = n.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(n, e);
}
__name(I, "I");
function j(e) {
  return new Response(e.body, e);
}
__name(j, "j");
function L(e) {
  return e.split(",").map((t) => {
    let [n, s] = t.split(";"), a = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [n.trim(), isNaN(a) ? 1 : a];
  }).sort((t, n) => n[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(L, "L");
u();
l();
p();
function O(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function N(e, { request: t, assetsFetcher: n, ctx: s }, { path: a, searchParams: o }) {
  let r, i = new URL(t.url);
  y(i.searchParams, o);
  let c = new Request(i, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let d = await import(e.entrypoint);
        try {
          r = await d.default(c, s);
        } catch (h) {
          let g = h;
          throw g.name === "TypeError" && g.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : h;
        }
        break;
      }
      case "override": {
        r = j(await n.fetch(I(c, e.path ?? a))), e.headers && x(r.headers, e.headers);
        break;
      }
      case "static": {
        r = await n.fetch(I(c, a));
        break;
      }
      default:
        r = new Response("Not Found", { status: 404 });
    }
  } catch (d) {
    return console.error(d), new Response("Internal Server Error", { status: 500 });
  }
  return j(r);
}
__name(N, "N");
function B(e, t) {
  let n = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(n) || !e.endsWith(s) ? false : e.slice(n.length, -s.length).split("|").every((o) => t.has(o));
}
__name(B, "B");
u();
l();
p();
function de(e, { protocol: t, hostname: n, port: s, pathname: a }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(n).test(e.hostname) || s && !new RegExp(s).test(e.port) || a && !new RegExp(a).test(e.pathname));
}
__name(de, "de");
function he(e, t) {
  if (e.method !== "GET") return;
  let { origin: n, searchParams: s } = new URL(e.url), a = s.get("url"), o = Number.parseInt(s.get("w") ?? "", 10), r = Number.parseInt(s.get("q") ?? "75", 10);
  if (!a || Number.isNaN(o) || Number.isNaN(r) || !t?.sizes?.includes(o) || r < 0 || r > 100) return;
  let i = new URL(a, n);
  if (i.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = a.startsWith("//"), d = a.startsWith("/") && !c;
  if (!d && !t?.domains?.includes(i.hostname) && !t?.remotePatterns?.find((v) => de(i, v))) return;
  let h = e.headers.get("Accept") ?? "", g = t?.formats?.find((v) => h.includes(v))?.replace("image/", "");
  return { isRelative: d, imageUrl: i, options: { width: o, quality: r, format: g } };
}
__name(he, "he");
function _e(e, t, n) {
  let s = new Headers();
  if (n?.contentSecurityPolicy && s.set("Content-Security-Policy", n.contentSecurityPolicy), n?.contentDispositionType) {
    let o = t.pathname.split("/").pop(), r = o ? `${n.contentDispositionType}; filename="${o}"` : n.contentDispositionType;
    s.set("Content-Disposition", r);
  }
  e.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${n?.minimumCacheTTL ?? 60}`);
  let a = j(e);
  return x(a.headers, s), a;
}
__name(_e, "_e");
async function G(e, { buildOutput: t, assetsFetcher: n, imagesConfig: s }) {
  let a = he(e, s);
  if (!a) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: o, imageUrl: r } = a, c = await (o && r.pathname in t ? n.fetch.bind(n) : fetch)(r);
  return _e(c, r, s);
}
__name(G, "G");
u();
l();
p();
u();
l();
p();
u();
l();
p();
async function k(e) {
  return import(e);
}
__name(k, "k");
var fe = "x-vercel-cache-tags";
var me = "x-next-cache-soft-tags";
var ge = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${b}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let n = new URL(e.url), s = await xe();
    if (n.pathname === "/v1/suspense-cache/revalidate") {
      let o = n.searchParams.get("tags")?.split(",") ?? [];
      for (let r of o) await s.revalidateTag(r);
      return new Response(null, { status: 200 });
    }
    let a = n.pathname.replace("/v1/suspense-cache/", "");
    if (!a.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let o = W(e, me), r = await s.get(a, { softTags: o });
        return r ? new Response(JSON.stringify(r.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (r.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let o = globalThis[ge], r = /* @__PURE__ */ __name(async () => {
          let i = await e.json();
          i.data.tags === void 0 && (i.tags ??= W(e, fe) ?? []), await s.set(a, i);
        }, "r");
        return o ? o.ctx.waitUntil(r()) : await r(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (n) {
    return console.error(n), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function xe() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? K("kv") : K("cache-api");
}
__name(xe, "xe");
async function K(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, n = await k(t);
  return new n.default();
}
__name(K, "K");
function W(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(W, "W");
function Q() {
  globalThis[Z] || (ye(), globalThis[Z] = true);
}
__name(Q, "Q");
function ye() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let n = new Request(...t), s = await we(n);
    return s || (s = await J(n), s) ? s : (ve(n), e(n));
  };
}
__name(ye, "ye");
async function we(e) {
  if (e.url.startsWith("blob:")) try {
    let n = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, s = (await k(n)).default, a = { async arrayBuffer() {
      return s;
    }, get body() {
      return new ReadableStream({ start(o) {
        let r = Buffer.from(s);
        o.enqueue(r), o.close();
      } });
    }, async text() {
      return Buffer.from(s).toString();
    }, async json() {
      let o = Buffer.from(s);
      return JSON.stringify(o.toString());
    }, async blob() {
      return new Blob(s);
    } };
    return a.clone = () => ({ ...a }), a;
  } catch {
  }
  return null;
}
__name(we, "we");
function ve(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(ve, "ve");
var Z = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
u();
l();
p();
var Y = q(X());
var C = class {
  static {
    __name(this, "C");
  }
  constructor(t, n, s, a, o) {
    this.routes = t;
    this.output = n;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), y(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = o?.find((r) => r.domain === this.url.hostname), this.locales = new Set(a.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: n, checkIntercept: s }) {
    let a = P(t.src, this.path, t.caseSensitive);
    if (!a.match || t.methods && !t.methods.map((r) => r.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let o = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((r) => {
      let i = A(r, o);
      return i.newRouteDest && (o.routeDest = i.newRouteDest), !i.valid;
    }) && !t.missing?.find((r) => A(r, o).valid) && !(n && t.status !== this.status)) {
      if (s && t.dest) {
        let r = /\/(\(\.+\))+/, i = r.test(t.dest), c = r.test(this.path);
        if (i && !c) return;
      }
      return { routeMatch: a, routeDest: o.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let n = "x-middleware-override-headers", s = t.headers.get(n);
    if (s) {
      let c = new Set(s.split(",").map((d) => d.trim()));
      for (let d of c.keys()) {
        let h = `x-middleware-request-${d}`, g = t.headers.get(h);
        this.reqCtx.request.headers.get(d) !== g && (g ? this.reqCtx.request.headers.set(d, g) : this.reqCtx.request.headers.delete(d)), t.headers.delete(h);
      }
      t.headers.delete(n);
    }
    let a = "x-middleware-rewrite", o = t.headers.get(a);
    if (o) {
      let c = new URL(o, this.url), d = this.url.hostname !== c.hostname;
      this.path = d ? `${c}` : c.pathname, y(this.searchParams, c.searchParams), t.headers.delete(a);
    }
    let r = "x-middleware-next";
    t.headers.get(r) ? t.headers.delete(r) : !o && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), x(this.reqCtx.request.headers, t.headers), x(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let n = t && this.output[t];
    if (!n || n.type !== "middleware") return this.status = 500, false;
    let s = await N(n, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, n, s) {
    !t.headers || (x(this.headers.normal, t.headers, { match: n, captureGroupKeys: s }), t.important && x(this.headers.important, t.headers, { match: n, captureGroupKeys: s }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, n, s) {
    if (!t.dest) return this.path;
    let a = this.path, o = t.dest;
    this.wildcardMatch && /\$wildcard/.test(o) && (o = o.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = R(o, n, s);
    let r = /\/index\.rsc$/i.test(this.path), i = /^\/(?:index)?$/i.test(a), c = /^\/__index\.prefetch\.rsc$/i.test(a);
    r && !i && !c && (this.path = a);
    let d = /\.rsc$/i.test(this.path), h = /\.prefetch\.rsc$/i.test(this.path), g = this.path in this.output;
    d && !h && !g && (this.path = this.path.replace(/\.rsc/i, ""));
    let v = new URL(this.path, this.url);
    return y(this.searchParams, v.searchParams), T(this.path) || (this.path = v.pathname), a;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: s, cookie: a } } = t, o = a && this.cookies[a], r = L(o ?? ""), i = L(this.reqCtx.request.headers.get("accept-language") ?? ""), h = [...r, ...i].map((g) => s[g]).filter(Boolean)[0];
    if (h) {
      !this.path.startsWith(h) && (this.headers.normal.set("location", h), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, n) {
    return !this.locales || n !== "miss" ? t : B(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, n) {
    let s = this.getLocaleFriendlyRoute(n, t), { routeMatch: a, routeDest: o } = this.checkRouteMatch(s, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, r = { ...s, dest: o };
    if (!a?.match || r.middlewarePath && this.middlewareInvoked.includes(r.middlewarePath)) return "skip";
    let { match: i, captureGroupKeys: c } = a;
    if (this.applyRouteOverrides(r), this.applyLocaleRedirects(r), !await this.runRouteMiddleware(r.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(r, i, c), this.applyRouteStatus(r);
    let h = this.applyRouteDest(r, i, c);
    if (r.check && !T(this.path)) if (h === this.path) {
      if (t !== "miss") return this.checkPhase(O(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !r.continue || r.status && r.status >= 300 && r.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let n = true;
    for (let o of this.routes[t]) {
      let r = await this.checkRoute(t, o);
      if (r === "error") return "error";
      if (r === "done") {
        n = false;
        break;
      }
    }
    if (t === "hit" || T(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let o of this.locales) {
      let r = new RegExp(`/${o}(/.*)`), c = this.path.match(r)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let o = this.path.replace(/\/$/, "");
      s = o in this.output, s && (this.path = o);
    }
    if (t === "miss" && !s) {
      let o = !this.status || this.status < 400;
      this.status = o ? 404 : this.status;
    }
    let a = "miss";
    return s || t === "miss" || t === "error" ? a = "hit" : n && (a = O(t)), this.checkPhase(a);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let n = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), n;
  }
};
async function ee(e, t, n, s) {
  let a = new C(t.routes, n, e, s, t.wildcard), o = await te(a);
  return Se(e, o, n);
}
__name(ee, "ee");
async function te(e, t = "none", n = false) {
  return await e.run(t) === "error" || !n && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
async function Se(e, { path: t = "/404", status: n, headers: s, searchParams: a, body: o }, r) {
  let i = s.normal.get("location");
  if (i) {
    if (i !== s.middlewareLocation) {
      let h = [...a.keys()].length ? `?${a.toString()}` : "";
      s.normal.set("location", `${i ?? "/"}${h}`);
    }
    return new Response(null, { status: n, headers: s.normal });
  }
  let c;
  if (o !== void 0) c = new Response(o, { status: n });
  else if (T(t)) {
    let h = new URL(t);
    y(h.searchParams, a), c = await fetch(h, e.request);
  } else c = await N(r[t], e, { path: t, status: n, headers: s, searchParams: a });
  let d = s.normal;
  return x(d, c.headers), x(d, s.important), c = new Response(c.body, { ...c, status: n || c.status, headers: d }), c;
}
__name(Se, "Se");
u();
l();
p();
function se() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Ce };
}
__name(se, "se");
function Ce(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let n = Ee();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, n), n;
}
__name(Ce, "Ce");
function Ee() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((t, n) => e.has(n) ? e.get(n) : Reflect.get(globalThis, n), "get"), set: /* @__PURE__ */ __name((t, n, s) => Me.has(n) ? Reflect.set(globalThis, n, s) : (e.set(n, s), true), "set") });
}
__name(Ee, "Ee");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ae = Object.defineProperty;
var Ie = /* @__PURE__ */ __name((...e) => {
  let t = e[0], n = e[1], s = "__import_unsupported";
  if (!(n === s && typeof t == "object" && t !== null && s in t)) return Ae(...e);
}, "Ie");
globalThis.Object.defineProperty = Ie;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var js = { async fetch(e, t, n) {
  se(), Q();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let r = new URL(e.url), i = await t.ASSETS.fetch(`${r.protocol}//${r.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = i.ok ? i.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: a, requestContextAsyncLocalStorage: o } = s;
  return a.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: b }, async () => o.run({ env: t, ctx: n, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return G(e, { buildOutput: f, assetsFetcher: t.ASSETS, imagesConfig: _.images });
    let i = z(e);
    return ee({ request: i, ctx: n, assetsFetcher: t.ASSETS }, _, f, m);
  }));
} };
export {
  js as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.13274244025598148.mjs.map
