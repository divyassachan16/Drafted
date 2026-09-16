# hello-api

Throwaway Express API for learning REST + project structure basics.

## Run it

```bash
npm install
npm run dev
```

Server starts at `http://localhost:3000`.

## Try it (curl)

```bash
# List all greetings
curl http://localhost:3000/api/hello

# Get one
curl http://localhost:3000/api/hello/1

# Create one
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"message":"Hey there"}'

# Update one
curl -X PUT http://localhost:3000/api/hello/1 \
  -H "Content-Type: application/json" \
  -d '{"message":"Updated greeting"}'

# Delete one
curl -X DELETE http://localhost:3000/api/hello/1

# Hit a route that doesn't exist — see the 404 handler
curl http://localhost:3000/api/nope
```

## What to notice while you poke at it

- `routes/` only maps HTTP method + path to a controller function — no logic.
- `controllers/` validates input, calls the model, and picks the status code.
- `models/` is the only place that touches "storage" (here, an array — swap for a real DB later without touching routes or controllers).
- Status codes: 200 (read), 201 (created), 204 (deleted, no body), 400 (bad input), 404 (not found).
- Data resets every time you restart the server — it's in memory on purpose, since this is throwaway.
