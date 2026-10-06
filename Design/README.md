# LeaveBy — Low-Fidelity Wireframes

Harvey Chowdhury · MTEC 3200 · Project 1

Open [the rough pencil-style sketches](LeaveBy_Rough_Sketches.pdf) or [their PNG](LeaveBy_Rough_Sketches.png).

For the clean layout reference, open [the three-screen sheet](LeaveBy_Wireframes.pdf) or [the image preview](LeaveBy_Wireframes.png).

## Main flow

1. **Plan the transition:** enter the next commitment date/time, preparation, commute, and buffer. Select **Calculate times**.
2. **Read the plan:** see **Stop workout** first, then **Leave by**, with the timing breakdown beneath. Select **Edit plan** when an estimate changes.
3. **Adjust the plan:** keep the existing values, change the commute or another input, and select **Recalculate**. Return to the results screen with updated times.

## Screen decisions

- Plain boxes, labels, and arrows keep attention on the flow.
- The workout stop time receives the strongest emphasis because it is the action the user needs to take first.
- Preparation and commute are separate fields so stopping the workout is not confused with leaving the gym.
- Every screen has one main action. Editing preserves values to avoid unnecessary typing.
- Text labels carry the meaning; the interface does not depend on color.

## Example shown

Example commitment: October 6 at 10:00 AM. This is an interface example, not the MTEC3200 meeting time. Preparation: 30 minutes. Commute: 60 minutes. Buffer: 15 minutes.

Stop workout at 8:15 AM, leave at 8:45 AM, and aim to arrive at 9:45 AM. In screen 3, the commute changes to 75 minutes. Recalculating returns to screen 2 with an 8:00 AM stop and an 8:30 AM departure.

## States for the first build

- Missing field: show a short message beside the relevant input and keep the entered values.
- Invalid duration: ask for a whole number of minutes, zero or greater.
- Past commitment: ask for a future date and time.
- Stop time already passed: show the computed times and “Your workout stop time has passed. Stop now and review your plan.”
- Times on a different date: show the date beside the time.

These are digital wireframe sketches. The paper-photo deliverable can use the same layout redrawn on paper and photographed. No completed usability test is claimed by these screens.

## Connection to course research

| Course finding | Design response |
| --- | --- |
| Small delays consume the limited gap after a workout. | Include an explicit buffer input. |
| Preparation and commuting both take time. | Use separate preparation and commute fields. |
| The chosen direction works backward from a fixed commitment. | Calculate and emphasize the workout stop time. |
| Estimates can change during a busy day. | Preserve inputs when editing and recalculate the results. |

Source: [Class 4 synthesis](../research/synthesis.md). No interface or code from another class is used.
