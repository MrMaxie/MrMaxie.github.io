I developed a <mark>work management platform</mark> that brings portfolios, projects and tasks into one shared planning space. Teams can organize work, break it into nested tasks, assign people and resources, monitor progress and keep budgets, costs, risks, documentation and communication connected to the work they describe.

## Planning across projects

- **Projects and portfolios:** group related initiatives and see their progress from a broader planning view.
- **Tasks and timelines:** organize nested work, priorities, statuses and schedules through structured tables and Gantt views.
- **Resources and budgets:** connect people, time, planned costs and available budgets with the tasks and projects using them.
- **Daily collaboration:** keep comments, discussions, documentation and personal task views alongside delivery data.

## Strict tenant isolation

The platform used a **strict multi-tenant boundary** between organizations. Project data, users, resources, budgets and communication were resolved within the active tenant, and the same isolation applied to both ordinary requests and live connections.

## Real-time collaboration

Changes reached open views without requiring a full page refresh. The real-time layer combined <mark>long-running HTTP connections and WebSockets</mark> so planning data and collaborative activity could stay current while several people worked in the platform.

## How I built it

I developed the TypeScript application and C# backend behind the planning workflows. I built the project and task views, complex tables, side panels, dashboards and Gantt-based schedules, then connected them to tenant-aware APIs, application state and the real-time update channels. I also worked across budgeting, resources, documentation and communication so these areas behaved as parts of one planning system rather than separate tools.
