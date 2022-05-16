/* eslint-disable */
/* -------------------------------------------------- */
/*      Start of Webpack Hot Extension Middleware     */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
(function (window) {
  const injectionContext = this || window || { browser: null };

  (function () {
    `<%= polyfillSource %>`;
  })();

  const { browser }: any = injectionContext || {};
  const signals: any = JSON.parse('<%= signals %>');

  const reloadPage: boolean = ('<%= reloadPage %>' as "true" | "false") === "true";

  const { SIGN_CHANGE, SIGN_LOG, SIGN_CONNECT } = signals;

  const { runtime, tabs } = browser;

  // =============================== Helper functions ======================================= //
  const formatter = (msg: string) => `[ WER: ${msg} ]`;
  const logger = (msg, level = "info") => console[level](formatter(msg));

  runtime.sendMessage({ type: SIGN_CONNECT }).then((msg) => console.info(msg));

  runtime.onMessage.addListener(({ type, payload }: { type: string; payload: any }) => {
    switch (type) {
      case SIGN_CHANGE:
        logger("Detected Changes. Reloading...");
        reloadPage && window?.location.reload();
        break;

      case SIGN_LOG:
        console.info(payload);
        break;

      default:
        break;
    }
  });
})(window);
/* eslint-disable */
/* ----------------------------------------------- */
/* End of Webpack Hot Extension Middleware  */
/* ----------------------------------------------- */
