import type {
  BoundTryHandleRequest,
  DianemoBackend,
  PluginContext,
} from "@dianemo/core";

interface BindingState {
  bound?: BoundTryHandleRequest;
  handler?: PluginContext["handler"];
  backend?: DianemoBackend;
}

/**
 * Process-wide, not module-scoped: a `let` here is per *copy* of this package,
 * and npm installs a second copy whenever two plugins resolve incompatible
 * ranges of it — which made the guard below fail open, the case it exists to
 * refuse. Versioned so an older copy cannot read a future state shape.
 */
const STATE_KEY = Symbol.for("@dianemo/plugin-kit.binding.v2");

const globals = globalThis as typeof globalThis & {
  [STATE_KEY]?: BindingState;
};

function state(): BindingState {
  return (globals[STATE_KEY] ??= {});
}

/**
 * Not threaded through call signatures, which is what keeps a request function
 * at `cancelShipment(clientName, data)` — its domain arguments and nothing
 * about how the handler was composed.
 *
 * The cost is one handler per process. A second is refused loudly rather than
 * rerouting the first one's traffic: requests would keep succeeding, against
 * the wrong rate-limit budget.
 */
export function bindTryHandleRequest(ctx: PluginContext): void {
  const current = state();
  if (current.handler && current.handler !== ctx.handler) {
    throw new Error(
      "Plugins are already bound to a different RequestHandler. Plugin request " +
        "functions use a process-scoped binding and can serve only one handler " +
        "per process. Compose all plugins onto a single handler, or run the " +
        "second handler in its own process."
    );
  }
  current.bound = ctx.tryHandleRequest;
  current.handler = ctx.handler;
  current.backend = ctx.backend;
}

/** Resolved at call time: `handler.use()` is what establishes the binding. */
export const tryHandleRequest: BoundTryHandleRequest = (...args) => {
  const { bound } = state();
  if (!bound) {
    throw new Error(
      "A plugin request function was called before registration. Pass the " +
        "plugin to `handler.use(plugin)` before calling its requests."
    );
  }
  return bound(...args);
};

export function currentHandler(): PluginContext["handler"] | undefined {
  return state().handler;
}

/**
 * Exported from `@dianemo/plugin-kit/testing` rather than the package root:
 * calling it from production code silently defeats the one-handler refusal
 * above, and something that dangerous should not sit next to
 * `tryHandleRequest` in the import a plugin reaches for every day.
 */
export function resetBinding(): void {
  delete globals[STATE_KEY];
}

/**
 * Whether a cache written here reaches other processes is the host's choice of
 * backend, not the plugin's; under a memory backend it does not.
 *
 * Build keys with `pluginKey`: this backend is shared with the handler's own
 * bookkeeping, with every other plugin, and — if the host set a `keyPrefix` —
 * with every other handler pointed at the same Redis.
 */
export function backend(): DianemoBackend {
  const { backend: bound } = state();
  if (!bound) {
    throw new Error(
      "A plugin asked for the backend before registration. Pass the plugin to " +
        "`handler.use(plugin)` before calling its requests."
    );
  }
  return bound;
}

/**
 * `handler.getNamespace()` folds in the host's `keyPrefix`, which is what makes
 * this necessary — see
 * /docs/core-behaviour.md#handlergetnamespace-is-the-only-public-read-of-keyprefix.
 */
export function pluginKey(plugin: string, ...parts: string[]): string {
  const { handler } = state();
  if (!handler) {
    throw new Error(
      "A plugin asked for a backend key before registration. Pass the plugin " +
        "to `handler.use(plugin)` before calling its requests."
    );
  }
  return [handler.getNamespace(), "plugin", plugin, ...parts].join(":");
}
