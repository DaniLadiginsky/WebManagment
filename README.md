# Web Managment

A simple REST API built with **Node.js + Express + PostgreSQL** for managing categories, items, and item volumes with per-volume pricing.

---

## Features
- Each **item name** is unique.
- Each item belongs to a **category**.
- Each item must have at least one **volume**.
- Unique price per `(item_id, volume_id)` combination.
- Search by **item name**, **category name**, or **volume value**.
- All endpoints are **protected with API Key** authentication.

---

## Installation & Run

Clone the repo and install dependencies:
npm i

Run the server (default port from .env, e.g. 5000):
npm run dev

---

## Authentication

All API endpoints are protected with an API key.

## Endpoints
Categories:

 POST /category → Create a new category (idempotent) Headers: x-api-key, Content-Type: application/json 

GET /category/:id → Get a category and all its items (with volumes) 

Items:

POST /items → Create/Update an item with volumes and prices Headers: x-api-key, Content-Type: application/json

GET /items → Get all items GET /item/:id → Get a single item with its volumes and prices

GET /item/search?q=... → Search by item name, category name, or volume value
