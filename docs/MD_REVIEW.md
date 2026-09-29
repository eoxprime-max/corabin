# Phase 2: MD Review

## Issues & Resolutions from `Corabin_-_Website_Copy.md`
- **Missing Information**: The MD file provides replacements for most textual sections but omits a few critical template elements (e.g., Blog placeholder data, Client Logo replacements).
  - *Resolution*: Will use placeholders as requested or keep the structure neutral until real data is provided.
- **Section Deletion Requests**: The MD requests omission of the **Pricing Section** (Home) and the **Culture Section** (About). 
  - *Resolution*: Deleting these sections safely requires removing them from the React DOM tree in the hydration chunks AND the static HTML.
- **Services Map**: Service 04 is changed from "Motion Graphics" to "App Development", which fits the slot structure well.
- **Metrics Change**: Values are reduced (e.g. 47+ to 25+). We will ensure the visual layout holds up with slightly shorter strings.
- **Testimonials**: Text lengths are nearly identical.
- **Missing Brand Fact Sheet**: The Fact Sheet was left empty, but the provided MD content at the top of the prompt fully supplies the brand details (Corabin, hello@corabin.com, etc.).
