# T3A2-B-Backend

## API Documentation

### GET /
- Returns a welcome message

## Events

### GET /events

- Returns a list of all events in JSON format

### GET /events/:id

- Returns a single event in JSON format

### POST /events

- Creates a new event
- Requires a JSON body with the following fields:
  - title: String, required
  - description: String, required
  - category: ObjectId, required

Example:
```json
{
  "title": "Event Title",
  "description": "Event Description",
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e"
}
```

### PUT /events/:id

- Updates an event

- Requires a JSON body with the following optional fields:
  - title: String
  - description: String
  - category: ObjectId

Example:
```json
{
  "title": "New Event Title", 
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e"
}
```

### DELETE /events/:id

- Deletes an event

## Categories

### GET /categories

- Returns a list of all categories in JSON format