// Amazon-specific CSS override: strip yellow background & border on .a-button-primary
(function () {
  const style = document.createElement("style");
  style.textContent = `
		.a-button-primary,
		.a-button-primary .a-button-inner {
			background-color: rgb(220,220,220) !important;
			border-color:     rgb(220,220,220) !important;
			box-shadow:       none                !important;
			outline:          none                !important;
		}
	`;
  document.head.appendChild(style);
})();

/**
 * ButtonTextReplacer
 * Replaces purchase-related labels on buttons, links, and inputs
 * with a random uppercase slogan (case-insensitive),
 * preserves surrounding styling, tints elements light gray,
 * makes text extra-bold, and strips any borders/shadows via !important.
 */
class ButtonTextReplacer {
  /**
   * @param {string[]} targets      – Array of label strings to match.
   * @param {string[]} replacements – Array of slogan strings.
   */
  constructor(targets, replacements) {
    this.targets = new Set(targets.map((t) => t.toLowerCase()));
    this.replacements = replacements;
    this.observer = null;
  }

  /** @returns {string} A random uppercase slogan */
  getRandomReplacement() {
    const idx = Math.floor(Math.random() * this.replacements.length);
    return this.replacements[idx].toUpperCase();
  }

  /**
   * Find the nearest actionable wrapper (button, link, input, Amazon spans).
   * @param {Node} node
   * @returns {HTMLElement|null}
   */
  findActionable(node) {
    return (
      node.parentElement?.closest(
        'button, a, input[type="submit"], input[type="button"], input[type="reset"], span.a-button, span.a-button-inner'
      ) || null
    );
  }

  /**
   * Force-override styling via !important
   * @param {HTMLElement} el
   */
  applyStyles(el) {
    if (!el) return;
    el.style.setProperty("background-color", "rgb(220,220,220)", "important");
    el.style.setProperty("background-image", "none", "important");
    el.style.setProperty("font-weight", "900", "important");
    el.style.setProperty("color", "black", "important");
    el.style.setProperty("border", "none", "important");
    el.style.setProperty("box-shadow", "none", "important");
    el.style.setProperty("outline", "none", "important");
  }

  /**
   * Replace a text node if it exactly matches a target (ignoring case & trimming),
   * preserve whitespace, swap in a random slogan, then style the actionable wrapper.
   * @param {Text} node
   */
  replaceTextNode(node) {
    const orig = node.textContent;
    const trimmed = orig.trim();
    if (this.targets.has(trimmed.toLowerCase())) {
      const leading = orig.match(/^\s*/)[0];
      const trailing = orig.match(/\s*$/)[0];
      node.textContent = `${leading}${this.getRandomReplacement()}${trailing}`;

      const actionable = this.findActionable(node) || node.parentElement;
      this.applyStyles(actionable);
    }
  }

  /**
   * Walk all text nodes under `root`.
   * @param {Node} root
   */
  replaceInTree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      this.replaceTextNode(n);
    }
  }

  /**
   * Replace values on <input> buttons/submit/reset and style them.
   * @param {Element|Document} root
   */
  replaceInputs(root) {
    const scope = root instanceof Element ? root : document;
    scope
      .querySelectorAll(
        'input[type="submit"], input[type="button"], input[type="reset"]'
      )
      .forEach((input) => {
        const valLower = input.value.trim().toLowerCase();
        if (this.targets.has(valLower)) {
          input.value = this.getRandomReplacement();
          this.applyStyles(input);
        }
      });
  }

  /** Perform initial full-page pass */
  replaceAll() {
    this.replaceInTree(document.body);
    this.replaceInputs(document.body);
  }

  /** Observe new nodes & character changes */
  initObserver() {
    this.observer = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.replaceInTree(node);
              this.replaceInputs(node);
            }
          });
        } else if (m.type === "characterData") {
          this.replaceTextNode(m.target);
        }
      }
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  /** Start the replacer */
  start() {
    this.replaceAll();
    this.initObserver();
  }
}

// Labels to match (any case)
const purchaseLabels = [
  "Buy Now",
  "Add to Cart",
  "Proceed to Checkout",
  "Checkout",
  "Order Now",
  "Complete Purchase",
  "Purchase",
  "Subscribe",
  "Subscribe Now",
  "Continue to Payment",
  "Move to Cart",
  "Buy it Now",
  "Add",
  "Options",
  "Find a Store",
];

// Replacement slogans
const slogans = [
  "Consume",
  "Obey",
  "Stay Asleep",
  "Marry and Reproduce",
  "Submit",
  "Watch T.V.",
  "Do Not Think",
  "Money Is Your God",
  "Conform",
  "No Thought",
  "Do Not Question Authority",
];

// Launch!
new ButtonTextReplacer(purchaseLabels, slogans).start();
