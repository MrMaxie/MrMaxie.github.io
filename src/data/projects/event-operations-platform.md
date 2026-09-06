I developed an event platform that supports an exhibitor from registration through a <mark>complex event order</mark>. An order can be prepared over time, allowing the exhibitor to return to a long-running cart while selected event resources remain reserved.

## Exhibitor orders

The ordering flow calculates prices from several connected factors rather than a single fixed product price.

- **Long-running cart:** keep a complex order available while the exhibitor prepares participation in the event.
- **Reservations:** retain the resources selected for the order during that process.
- **Price calculation:** combine stand area, event sector and applicable discounts or allowances.

## Tickets and user communication

The platform supports <mark>secure ticket issuing</mark> and communication with users. These tools connect participation and order handling with the contact needed around the event.

## Administration

A **large administrative area** brings together exhibitor registrations, complex orders, reservations, ticket issuing and user communication for the people operating the event.

## How I built it

I developed the <mark>TypeScript interfaces and backend</mark> for exhibitor registration, long-running orders, reservations, price calculation, secure ticket issuing, user communication and the administrative area. I connected these workflows so information entered by exhibitors could be handled consistently across the user-facing and administrative parts of the platform.
