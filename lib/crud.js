/*
Super simple persistance layer.

Note: this can be imported from 'lib/crud' in any file in the project.

Only use it if the user explicitly asks for data persistance.

Make sure that it is clear what schema each key has, and that the schema is consistent across the code.
If it is not, start by stating what the schema is in the comments, or at least your thinking.

Exact schema of the objects table:
[
  {
    "column_name": "id",
    "data_type": "bigint",
    "is_nullable": "NO"
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "column_name": "key",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "column_name": "value",
    "data_type": "jsonb",
    "is_nullable": "YES"
  },
  {
    "column_name": "project_id",
    "data_type": "text",
    "is_nullable": "NO"
  },
]

Example usage:
```js
import { client } from 'lib/crud';

class User {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    }
}

client.set('user:anton_osika', { name: 'Anton Osika', age: 33 })
client.set('user:john_doe', { name: 'John Doe', age: 25 })
client.get('user:anton_osika').then(data => {
    const user = new User(data.name, data.age)
    console.log(user)
})
client.getWithPrefix('user:').then(data => {
    for (const obj of data) {
        console.log(obj.key, obj.value)
    }
})
client.delete('user:anton_osika')
```

*/

// setup, ignore this
const SUPABASE_URL = "https://dsmnnnvbvapoyacvfuqg.supabase.co/v1/rest/events";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbW5ubnZidmFwb3lhY3ZmdXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5ODcwNTgsImV4cCI6MjAzMDU2MzA1OH0.JBn3ieDfquvB44M9yB6va1bQFz6DxjOqCw-eAQO-rwA";

// pay attention to how the client works:
export const client = {
  get: async (key) => {
    const response = await fetch(`${SUPABASE_URL}?select=value&key=eq.${key}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    const data = await response.json();
    return data[0] ? data[0].value : null;
  },
  set: async (key, value) => {
    const response = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ key, value }),
    });
    return response.ok;
  },
  delete: async (key) => {
    const response = await fetch(`${SUPABASE_URL}?key=eq.${key}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    return response.ok;
  },
  getWithPrefix: async (prefix) => {
    const response = await fetch(`${SUPABASE_URL}?select=key,value&key=like.${prefix}%`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    const data = await response.json();
    return data;
  },
};
