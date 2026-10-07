# LocalScout

AI concierge that turns a conference attendee's free time between events
into a verified, personalized itinerary — food, side events, and travel,
checked against their real schedule so they never miss their next
commitment.

**Live demo:** https://prod-main-localscout-31a2b3-00rjc2q6t56.compute.instacloud-edge.com/

Built for the AI-Native Startup Hackathon (SF Tech Week, Oct 2026).

## The problem

Conference attendees have real gaps in their schedule but no single tool
tells them what to actually do with 90 free minutes — accounting for
travel time, food preferences, budget, and the deadline to be at their
next event.

## What it does

Enter your location, free window, next commitment, interests, food
preference, and budget. LocalScout returns three schedule-aware plans —
Best Networking, Best Food, and Safest Schedule — each with a restaurant,
a side event, travel time, cost, a schedule-fit score, and the reasoning
behind the pick.

## AI workforce

- **Concierge Intake Agent** — converts the request into structured constraints
- **Event Scout Agent** — surfaces relevant side events
- **Place Scout Agent** — finds food matching budget/diet/location
- **Itinerary Planner Agent** — combines candidates into three feasible plans
- **Trust & Feasibility Agent** — verifies timing and rejects plans that don't fit

Agents built in Kylon, connected via BAND.

## Tech stack

AdaL (build), Kylon (AI agent team), BAND (agent coordination), Rocket
Ride (workflow automation), Prelint (requirements validation), Instacloud
(deployment).

## Notes

Uses bundled sample data (no live API calls) so the demo can't fail on a
network issue — clearly labeled in the UI. GapFit scoring logic estimates
travel time from neighborhood distances.

## Team

- Niramay Kelkar — Engineering
- Mrunmayee Joshi — Product / AI Agents

_Reviewed via Prelint._
