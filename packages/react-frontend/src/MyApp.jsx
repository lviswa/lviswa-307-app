import React, { useState, useEffect } from "react";
import Table from "./Table.jsx";
import Form from "./Form.jsx";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const characterToDelete = characters[index];
    fetch(`http://localhost:8000/users/${characterToDelete.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((character, i) => i !== index);
          setCharacters(updated);
        } else {
          console.error("Failed to delete character");
        }
      })
      .catch((error) => console.error("Error deleting character:", error));
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json(); // Parse the response JSON
        } else {
          throw new Error("Failed to add user");
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]); // Update the state with the newly added user
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;