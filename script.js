// URL base dell'API JSON Server
// Qui specifichiamo dove si trovano le nostre task. JSON Server agisce come backend simulato che risponde a tutte le richieste CRUD (Create, Read, Update, Delete)
const apiUrl = "http://localhost:3000/tasks";

// Funzione per ottenere tutte le task (GET request)
// Questa funzione effettua una richiesta GET per recuperare tutte le task dal "server"
// 1. Chiamiamo fetch() per inviare una richiesta all'API.
// 2. Convertiamo la risposta in formato JSON.
// 3. Aggiorniamo il DOM (pagina web) per mostrare tutte le task.
function getTasks() {
  fetch(apiUrl) // Richiesta GET
    .then((response) => {
      if (!response.ok) {
        // Controllo di errore se la risposta non è OK
        throw new Error("Errore nella richiesta GET"); // Se c'è un errore, lo lanciamo
      }
      return response.json(); // Convertiamo la risposta in JSON
    })
    .then((data) => {
      const taskList = document.getElementById("taskList"); // Selezioniamo l'elemento <ul> per mostrare le task
      taskList.innerHTML = ""; // Puliamo la lista prima di aggiungere le nuove task

      // Per ogni task ricevuta dal server, creiamo un elemento <li> che la rappresenta
      data.forEach((task) => {
        const taskItem = document.createElement("li"); // Creiamo un nuovo <li> per ogni task
        // Inseriamo il titolo e il bottone per "Elimina" e "Completata/Da completare"
        taskItem.innerHTML = `
          ${task.title} ${
          task.completed ? "✅" : ""
        } <!-- Visualizza se la task è completata -->
          <button onclick="deleteTask('${
            task.id
          }')">Elimina</button> <!-- Bottone per eliminare la task -->
          <button onclick="toggleComplete('${task.id}', ${task.completed})">
            ${
              task.completed ? "Completata" : "Da completare"
            } <!-- Bottone per marcare la task come completata o incompleta -->
          </button>
        `;
        taskList.appendChild(taskItem); // Aggiungiamo la task alla lista <ul>
      });
    })
    .catch((error) => console.error("Errore:", error)); // Se c'è un errore, lo mostriamo in console
}

// Funzione per aggiungere una nuova task (POST request)
// Quando l'utente invia una nuova task, questa funzione:
// 1. Verifica che il titolo non sia vuoto.
// 2. Invia una richiesta POST per creare una nuova task.
// 3. Aggiorna la lista delle task richiamando getTasks().
function addTask(title) {
  if (!title.trim()) {
    // Controlliamo che il titolo non sia vuoto o solo spazi
    console.error("Il titolo della task non può essere vuoto"); // Mostriamo un errore se il titolo è vuoto
    return;
  }

  // Definiamo il nuovo oggetto task che sarà inviato al server
  const newTask = {
    title: title.trim(), // Rimuoviamo spazi vuoti all'inizio e alla fine del titolo
    completed: false, // Impostiamo che la task è incompleta (default)
  };

  fetch(apiUrl, {
    method: "POST", // Metodo POST per creare una nuova risorsa
    headers: {
      "Content-type": "application/json", // Specifichiamo che stiamo inviando dati in formato JSON
    },
    body: JSON.stringify(newTask), // Convertiamo l'oggetto JavaScript in JSON
  })
    .then((response) => {
      if (!response.ok) {
        // Controllo se la richiesta ha avuto successo
        throw new Error("Errore nella richiesta POST");
      }
      return response.json(); // Convertiamo la risposta in JSON
    })
    .then(() => getTasks()) // Ricarichiamo le task per aggiornare la lista
    .catch((error) => console.error("Errore:", error)); // Gestione degli errori
}

// Funzione per eliminare una task (DELETE request)
// Quando l'utente clicca su "Elimina", questa funzione:
// 1. Invia una richiesta DELETE per eliminare la task dal server.
// 2. Aggiorna la lista delle task richiamando getTasks().
function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, {
    // URL dell'API con l'ID della task da eliminare
    method: "DELETE", // Metodo DELETE per eliminare la task
  })
    .then((response) => {
      if (!response.ok) {
        // Controllo se la richiesta ha avuto successo
        throw new Error("Errore nella richiesta DELETE");
      }
      return response.json(); // Convertiamo la risposta in JSON (anche se per DELETE non è strettamente necessario)
    })
    .then(() => getTasks()) // Ricarichiamo la lista delle task dopo l'eliminazione
    .catch((error) => console.error("Errore:", error)); // Gestione degli errori
}

// Funzione per aggiornare lo stato di completamento di una task (PATCH request)
// Questa funzione cambia lo stato "completed" di una task (da completato a non completato e viceversa):
// 1. Invia una richiesta PATCH per aggiornare solo il campo "completed".
// 2. Aggiorna la lista delle task richiamando getTasks().
function toggleComplete(id, completed) {
  const updatedTask = {
    completed: !completed, // Cambiamo lo stato di "completed" (inverte il valore)
  };

  fetch(`${apiUrl}/${id}`, {
    method: "PATCH", // Metodo PATCH per aggiornare parzialmente la task
    headers: {
      "Content-type": "application/json", // Dati inviati in formato JSON
    },
    body: JSON.stringify(updatedTask), // Convertiamo l'oggetto aggiornato in JSON
  })
    .then((response) => {
      if (!response.ok) {
        // Controllo se la richiesta ha avuto successo
        throw new Error("Errore nella richiesta PATCH");
      }
      return response.json(); // Convertiamo la risposta in JSON
    })
    .then(() => getTasks()) // Ricarichiamo la lista delle task dopo l'aggiornamento
    .catch((error) => console.error("Errore:", error)); // Gestione degli errori
}

// Gestione dell'invio del form per aggiungere una nuova task
// Quando l'utente invia il form, questa funzione:
// 1. Previene l'invio predefinito del form (per evitare il refresh della pagina).
// 2. Prende il titolo della task e chiama la funzione addTask() per creare la nuova task.
const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Blocca l'invio predefinito del form
  const taskTitle = document.getElementById("taskTitle").value; // Prende il valore del campo input
  addTask(taskTitle); // Chiamiamo addTask con il titolo inserito dall'utente
  taskForm.reset(); // Resettiamo (svuotiamo) il form dopo l'invio
});

// Caricamento iniziale delle task quando la pagina viene caricata
// 1. Appena la pagina è caricata, richiama getTasks() per mostrare le task già presenti.
document.addEventListener("DOMContentLoaded", getTasks); // Richiamiamo getTasks quando il DOM è pronto
