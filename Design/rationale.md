# Design rationale

October 20, 2026. References: [wireframe flow](README.md), [research insights](../research/insight_statements.md), and the implemented form/result components.

| Concept | Interface decision | Reason and implementation |
| --- | --- | --- |
| Affordance and signifier | Native inputs accept date, time and duration values. A contrasting, labeled button signals the calculation action. | The controls support entry and activation; labels and visual treatment communicate what action is available. |
| Mapping | Separate preparation, commute and buffer inputs map to the transition stages. | The result breakdown uses the same concepts. Buffer is deducted once before arrival, commute before departure, and preparation before the workout stop. |
| Feedback | Submission shows calculated times or field-specific errors. | Successful calculation focuses the Stop workout heading. An invalid submission focuses the first invalid field and keeps entered values. |
| Constraints | Require a future commitment and nonnegative whole minutes. | Blank, negative, fractional, text and excessive values cannot produce a plan. Explicit zero is valid. |
| Conceptual model | Work backward from a fixed commitment. | The most prominent time is the first action: stop exercise. Leave by follows as a separate milestone. |
| Recovery | Edit plan keeps all five values. | Users correct one estimate and recalculate. Invalid edits preserve the form. |
| Visibility | Dates accompany milestones that fall on a different day. | Midnight crossings remain understandable. The result states that times use the user's estimates. |

## Scope and trade-offs

One commitment and session memory keep the flow small. Reload clears the plan. No account, transit feed or notification system is included. A stop time that has passed produces a visible warning when calculating; the app does not update as a live countdown.

The interface uses text for meaning rather than color alone. Inputs and buttons are 48 pixels high. Automated and browser checks are documented in [verification](../docs/verification.md); peer observations remain pending.

## Wireframe formats

The repository contains the original rough PNG and clean PNG/PDF references. An [editable Figma conversion](https://www.figma.com/design/o5HfqhQTqwBFK8nFTEWvx2) reproduces the three states and keeps the example values. It was created October 20 after the prototype build. Class 5 makes conversion optional, while the overall Project 1 brief lists Figma wireframes; both formats are now available.

