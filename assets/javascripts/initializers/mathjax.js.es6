/* global MathJax */

import { decorateCooked } from 'discourse/lib/plugin-api';
import loadScript from 'discourse/lib/load-script';

function oldApplyBody() {
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, "topic"]);
}

function oldApplyPreview() {
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, "wmd-preview"]);
  // if the caret is on the last line ensure preview scrolled to bottom
  const caretPosition = Discourse.Utilities.caretPosition(this.wmdInput[0]);
  if (!this.wmdInput.val().substring(caretPosition).match(/\\n/)) {
    const $wmdPreview = $('#wmd-preview');
    if ($wmdPreview.is(':visible')) {
      $wmdPreview.scrollTop($wmdPreview[0].scrollHeight);
    }
  }
}

function mathJaxConfig() {
  MathJax.Hub.Config({
    "HTML-CSS": {
      preferredFont: "TeX",
      availableFonts: ["TeX"],
      linebreaks: {
        automatic: true
      },
      EqnChunk: (MathJax.Hub.Browser.isMobile ? 10 : 50)
    },
    tex2jax: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ],
      processEscapes: true
    },
    TeX: {
      noUndefined: {
        attributes: {
          mathcolor: "red",
          mathbackground: "#FFEEEE",
          mathsize: "90%"
        }
      },
      Macros: {
        href: "{}"
      }
    },
    messageStyle: "none"
  });
}

function oldCode(container) {
  const siteSettings = container.lookup('site-settings:main');
  if (!siteSettings.enable_mathjax_plugin) { return; }

  loadScript(siteSettings.mathjax_url + '?config=' + siteSettings.mathjax_config, { scriptTag: true }).then(function () {
    mathJaxConfig();

    decorateCooked(container, oldApplyBody);
    container.lookupFactory('view:composer').prototype.on("previewRefreshed", oldApplyPreview);
  });
}

export default {
  name: 'discourse-mathjax',
  after: 'inject-objects',

  initialize: function (container) {
    oldCode(container);
  }
};
