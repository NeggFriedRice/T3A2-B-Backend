# T3A2-B-Backend

## API Documentation

### GET /
- Returns a welcome message

## Events

### GET /events

- Returns a list of events based on the query parameters in JSON format
- Query parameters:
  - title: String, optional
  - category: ObjectId, optional
  - month: Number, optional
  - year: Number, optional

Example:
```JSON
{
  "title": "Event Title",
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e"
}
``` 
returns all events with the title "Event Title" and category "5f8a5e3e3f3e3e3e3e3e3e3e"

```JSON
{
  "month": 10,
  "year": 2020
}
```
returns all events in October 2020

```JSON
{
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e",
  "month": 10,
  "year": 2020
}
```
returns all events in category "5f8a5e3e3f3e3e3e3e3e3e3e" in October 2020

### GET /events/all

- Returns a list of all events in JSON format

### GET /events/:id

- Returns a single event in JSON format

### POST /events

- Creates a new event
- Requires a JSON body with the following fields:
  - title: String, required
  - description: String, required
  - category: ObjectId, required
  - date: Date(YYYY-MM-DD), required

Example:
```json
{
  "title": "Event Title",
  "description": "Event Description",
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e",
  "date": "YYYY-MM-DD"
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