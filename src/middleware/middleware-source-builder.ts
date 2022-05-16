import { template } from "lodash";
import { RawSource, Source } from "webpack-sources";

import background from "raw-loader!./wer-middleware-background.raw";
import content from "raw-loader!./wer-middleware-content.raw";
import extension from "raw-loader!./wer-middleware-extension.raw";
import polyfillSource from "raw-loader!webextension-polyfill";

import { RECONNECT_INTERVAL, SOCKET_ERR_CODE_REF } from "../constants/middleware-config.constants";
import * as signals from "../utils/signals";

export default function middleWareSourceBuilder({ port, reloadPage, page }: IMiddlewareTemplateParams): Source {
  const rawSource = {
    content,
    background,
    extension,
  };

  const tmpl = template(rawSource[page as any]);

  return new RawSource(
    tmpl({
      WSHost: `ws://localhost:${port}`,
      config: JSON.stringify({ RECONNECT_INTERVAL, SOCKET_ERR_CODE_REF }),
      polyfillSource: `"||${polyfillSource}"`,
      reloadPage: `${reloadPage}`,
      signals: JSON.stringify(signals),
    }),
  );
}
