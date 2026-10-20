# LeaveBy manual check

Status: awaiting actual browser testing. Record results after trying each action.

1. Pull the latest commit in Codespaces. If the server is running, stop it with Ctrl+C, run `npm ci`, then `npm run dev`. Open port 3000.
2. Choose a future date, 10:00 AM, 30 minutes preparation, 60 commute and 15 buffer. Select Calculate times. Expect Stop workout 8:15 AM, Leave by 8:45 AM and arrival 9:45 AM.
3. Select Edit plan. Confirm all five values remain. Change commute to 75 and select Recalculate. Expect 8:00 AM stop, 8:30 AM departure and unchanged arrival.
4. Set commitment to 12:30 AM on a future date, preparation 30, commute 60 and buffer 15. Expect previous-date stop 10:45 PM and departure 11:15 PM, with explicit dates; arrival is 12:15 AM on commitment day.
5. Submit blank, negative, fractional or nonnumeric duration values. Expect errors beside fields and preserved inputs. Explicit zero should work.
6. Select a past commitment. Expect an error; no new result. Then try a future commitment whose estimated workout stop is already past. Expect the stop-now warning and visible results.
7. Use only the keyboard through entry, result and editing. Check labels, focus and errors; try phone-width and desktop layouts and both display color schemes.
8. Reload. Expect a fresh plan; saved routines are outside the MVP.

These checks are for Harvey's review. Actual peer testing requires another person and recorded observations. A Vercel URL is still needed for deployment review.
