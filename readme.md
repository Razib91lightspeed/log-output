# Exercise 4.5 – Update Todo (PUT)

This exercise extends the Project Todo application by adding support for marking todos as **done** using a `PUT` request.

## What was implemented
- Added a `done` field to todos
- Implemented `PUT /todos/<id>` endpoint
```bash
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "UPDATE todos SET done = TRUE WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
});
```
- Updated backend logic to mark a todo as completed
- Verified functionality using Kubernetes service and port-forwarding

## Verification
The screenshot below demonstrates:
- Todo creation via `POST /todos`
- Todo update via `PUT /todos/<id>`
- Backend responding with `"done": true`
- Application running correctly in Kubernetes

![Exercise 4.5 proof](image/ex4.5.jpeg)
# End