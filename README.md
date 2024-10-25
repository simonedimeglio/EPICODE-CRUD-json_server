# CRUD

Per utilizzare **JSON Server** installiamo lanciando, all'interno della cartella del progetto, il seguente comando

```bash
npm install -g json-server
```

## Creazione del file `db.json`

Nella cartella del progetto, crea un file chiamato `db.json`, che conterrà le nostre attività (tasks). Questo file simulerà un database locale.

```json
{
  "tasks": [
    { "id": 1, "title": "Task 1", "completed": false },
    { "id": 2, "title": "Task 2", "completed": true }
  ]
}
```

## Avvio di JSON Server

Una volta creato il file `db.json`, avvia JSON Server in modo che possa servire le nostre API, con il comando:

```bash
json-server --watch db.json --port 3000
```

> Questo comando avvia un server che risponderà alle richieste API su http://localhost:3000/tasks. Il server si aggiornerà automaticamente ogni volta che modifichi il file `db.json`.
