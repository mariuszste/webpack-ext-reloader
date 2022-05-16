/* eslint-disable */
/* -------------------------------------------------- */
/*      Start of Webpack Hot Extension Middleware     */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
(function () {
  const injectionContext = this || { browser: null };

  (function () {
    `<%= polyfillSource %>`;
  })();

  const { browser }: any = injectionContext || {};
  const signals: any = JSON.parse('<%= signals %>');
  const config: any = JSON.parse('<%= config %>');

  const wsHost = "<%= WSHost %>";
  const { SIGN_CHANGE, SIGN_RELOAD, SIGN_RELOADED, SIGN_CONNECT } = signals;
  const { RECONNECT_INTERVAL, SOCKET_ERR_CODE_REF } = config;

  const { runtime, tabs } = browser;
  const manifest = runtime.getManifest();

  // =============================== Helper functions ======================================= //
  const formatter = (msg: string) => `[ WER: ${msg} ]`;
  const logger = (msg, level = "info") => console[level](formatter(msg));
  const timeFormatter = (date: Date) => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

  runtime.onMessage.addListener((action: { type: string; payload: any }, sender) => {
    if (action.type === SIGN_CONNECT) {
      return Promise.resolve(formatter("Connected to Web Extension Hot Reloader"));
    }
    return true;
  });

  const socket = new WebSocket(wsHost);

  socket.addEventListener("message", ({ data }: MessageEvent) => {
    const { type, payload } = JSON.parse(data);

    if (type === SIGN_CHANGE && (!payload || !payload.onlyPageChanged)) {
      tabs.query({ status: "complete" }).then((loadedTabs) => {
        loadedTabs.forEach((tab) => tab.id && tabs.sendMessage(tab.id, { type: SIGN_RELOAD }));
        socket.send(
          JSON.stringify({
            type: SIGN_RELOADED,
            payload: formatter(`${timeFormatter(new Date())} - ${manifest.name} successfully reloaded`),
          }),
        );
        runtime.reload();
      });
    } else {
      runtime.sendMessage({ type, payload });
    }
  });

  socket.addEventListener("close", ({ code }: CloseEvent) => {
    logger(`Socket connection closed. Code ${code}. See more in ${SOCKET_ERR_CODE_REF}`, "warn");

    const intId = setInterval(() => {
      logger("Attempting to reconnect (tip: Check if Webpack is running)");
      const ws = new WebSocket(wsHost);
      ws.onerror = () => logger(`Error trying to re-connect. Reattempting in ${RECONNECT_INTERVAL / 1000}s`, "warn");
      ws.addEventListener("open", () => {
        clearInterval(intId);
        logger("Reconnected. Reloading plugin");
        runtime.reload();
      });
    }, RECONNECT_INTERVAL);
  });
})();
/* eslint-disable */
/* ----------------------------------------------- */
/* End of Webpack Hot Extension Middleware  */
/* ----------------------------------------------- */
