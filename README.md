# Consume Chrome Extension

A Chrome Extension that replaces purchase-related button labels with random uppercase slogans, ensuring a consistent light gray styling across all sites (including Amazon and eBay).

## Features

- Replaces common purchase button text (e.g. Buy Now, Add to Cart, Proceed to Checkout)
- Random uppercase slogans:
  - CONSUME
  - OBEY
  - STAY ASLEEP
  - MARRY AND REPRODUCE
  - SUBMIT
  - WATCH T.V.
  - DO NOT THINK
  - MONEY IS YOUR GOD
  - CONFORM
  - NO THOUGHT
  - DO NOT QUESTION AUTHORITY
- Case-insensitive matching
- 100% local processing—no data collected or transmitted
- Forces a light gray background, extra-bold black text, and strips borders/shadows
- Works on dynamically loaded content (AJAX/SPAs)
- Special overrides for Amazon’s `.a-button-primary`

## Installation

### From source

1. Clone this repo:
   ```bash
   git clone https://github.com/<your-username>/consume-extension.git
   cd consume-extension
   ```
