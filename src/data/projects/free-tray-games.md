**I built** FreeTrayGames as a small Windows utility for keeping track of limited-time game giveaways. It runs in the <mark>system tray</mark> and shows active offers for Steam, Epic Games Store and GOG, so checking several storefronts does not have to become a recurring manual task.

## Finding offers

The app uses <mark>GamerPower</mark> as its offer source.

- Refresh the list **every three hours**.
- Trigger a **manual refresh** from the tray menu.
- Browse current offers and **open a giveaway** in the browser.

## Tray controls

Newly detected offers can produce a <mark>Windows notification</mark>, and those notifications can be disabled. The tray menu is the main interface, which keeps the app available in the background without requiring a permanent window.

## How I built it

I implemented the <mark>Rust application</mark>, Windows tray integration and notifications, and handled packaging and releases. The project concentrates on that short path from discovering an offer to opening its page, with refresh and notification controls available where the offers are listed.
