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

  const { SIGN_RELOAD, SIGN_LOG, SIGN_CONNECT } = signals;

  const { runtime, tabs } = browser;

  // =============================== Helper functions ======================================= //
  const formatter = (msg: string) => `[ WER: ${msg} ]`;
  const logger = (msg, level = "info") => console[level](formatter(msg));

  // ========================== Called only on content scripts ============================== //

  runtime.sendMessage({ type: SIGN_CONNECT }).then((msg) => console.info(msg));

  runtime.onMessage.addListener(({ type, payload }: { type: string; payload: any }) => {
    switch (type) {
      case SIGN_RELOAD:
        logger("Detected Changes. Reloading...");
        // eslint-disable-next-line no-var,vars-on-top,block-scoped-var
        console.log("~~~~~~~~~~ reloading", reloadPage, window);
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
