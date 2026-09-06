I developed a platform for arranging and holding <mark>live consultations with specialists</mark>. It connects discovery, availability and communication in one flow: users can find a suitable specialist, choose an available time and meet through a video call or live chat.

## Scheduling around real availability

Specialists can organize their availability through calendars and defined time windows. The booking flow turns that availability into clear appointment choices, helping users select both a suitable time and the form of the consultation.

- **Availability windows:** describe when a specialist can accept meetings.
- **Bookable time slots:** present valid appointment times based on the current calendar.
- **Connected calendars:** keep scheduled consultations visible as part of the specialist's working day.

## Calls and chat at the scheduled time

Each appointment connects its booking with the live conversation. At the scheduled time, participants can enter the consultation and communicate through <mark>real-time video or chat</mark> without moving to a separate product.

## Custom real-time infrastructure

The communication layer uses a custom WebRTC media service together with WebSocket signaling and live application events. It coordinates call rooms, participants, media connections and chat state so the consultation remains synchronized for everyone involved.

## How I built it

I developed the TypeScript application and its backend workflows across specialist availability, calendars, appointment booking, live chat and video consultations. I also built and integrated the real-time communication stack, connecting WebRTC media handling, WebSocket events and application state into the complete consultation flow.
