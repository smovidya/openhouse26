# Astro Starter Kit: Basics

```sh
bun create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## How to test sse

- clone the sse repo
- start (sse) dev server
- start this repo dev server
- if you see any red error message, please restart (this) dev sever

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Useful SQL Queries

```sql
-- นับจำนวนคนมีสิทธิรับเกียรติบัตร

SELECT
  participant_ticket_code AS participantTicketId,
  SUM(CASE WHEN checkpoint_id LIKE 'workshop-%' THEN 1 ELSE 0 END) AS workshop_checkin_count,
  SUM(CASE WHEN checkpoint_id NOT LIKE 'workshop-%'
            AND checkpoint_id != 'redeem-reward'
      THEN 1 ELSE 0 END) AS booth_checkin_count
FROM checkins
WHERE deleted_at IS NULL
  AND participant_ticket_code NOT LIKE 'T%'
GROUP BY participant_ticket_code
HAVING workshop_checkin_count >= 1
    OR booth_checkin_count >= 3;
```