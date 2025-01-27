
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [team1, setTeam1] = useState(Array(6).fill(""));
  const [team2, setTeam2] = useState(Array(6).fill(""));
  const [result, setResult] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [teamSuggestions, setTeamSuggestions] = useState({
    team1: Array(6).fill([]),
    team2: Array(6).fill([]),
  });
  const [activeInput, setActiveInput] = useState({ team: null, index: null });

  const handleInputChange = (team, index, value) => {
    if (team === "team1") {
      const updatedTeam = [...team1];
      updatedTeam[index] = value;
      setTeam1(updatedTeam);
    } else {
      const updatedTeam = [...team2];
      updatedTeam[index] = value;
      setTeam2(updatedTeam);
    }
  };

  const simulateBattle = async () => {
    try {
      const response = await axios.post("http://localhost:5000/simulate", {
        team1: team1.filter(Boolean),
        team2: team2.filter(Boolean),
      });
      setResult(response.data.result);
      fetchLeaderboard();
    } catch (error) {
      console.error("Error simulating battle:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rankings");
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchPokemonSuggestions = async (query, team, index) => {
    if (query.length < 2) {
      setTeamSuggestions((prev) => {
        const updatedSuggestions = { ...prev };
        updatedSuggestions[team][index] = [];
        return updatedSuggestions;
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=1000`
      );
      const allPokemon = response.data.results;
      const filteredPokemon = allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      setTeamSuggestions((prev) => {
        const updatedSuggestions = { ...prev };
        updatedSuggestions[team][index] = filteredPokemon;
        return updatedSuggestions;
      });
    } catch (error) {
      console.error("Error fetching Pokémon suggestions:", error);
    }
  };

  const handleSearchChange = (e, team, index) => {
    const value = e.target.value;
    setActiveInput({ team, index });
    handleInputChange(team, index, value);
    fetchPokemonSuggestions(value, team, index);
  };

  const handleSuggestionSelect = (name, team, index) => {
    if (team === "team1") {
      const updatedTeam = [...team1];
      updatedTeam[index] = name;
      setTeam1(updatedTeam);
    } else {
      const updatedTeam = [...team2];
      updatedTeam[index] = name;
      setTeam2(updatedTeam);
    }

    setTeamSuggestions((prev) => {
      const updatedSuggestions = { ...prev };
      updatedSuggestions[team][index] = [];
      return updatedSuggestions;
    });
    setActiveInput({ team: null, index: null });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Pokémon Battle Simulator</h1>
      <div className="teams">
        {["team1", "team2"].map((teamName, teamIndex) => (
          <div key={teamIndex} className="team">
            <h2 className="team-title">
              {teamName === "team1" ? "Team 1" : "Team 2"}
            </h2>
            {(teamName === "team1" ? team1 : team2).map((pokemon, index) => (
              <div key={index} className="pokemon-input-container">
                <input
                  type="text"
                  value={pokemon}
                  onChange={(e) => handleSearchChange(e, teamName, index)}
                  placeholder={`Pokémon ${index + 1}`}
                  className="pokemon-input"
                />
                {activeInput.team === teamName &&
                  activeInput.index === index &&
                  teamSuggestions[teamName][index].length > 0 && (
                    <ul className="suggestions">
                      {teamSuggestions[teamName][index].map(
                        (suggestion, idx) => (
                          <li
                            key={idx}
                            className="suggestion-item"
                            onClick={() =>
                              handleSuggestionSelect(
                                suggestion.name,
                                teamName,
                                index
                              )
                            }
                          >
                            {suggestion.name}
                          </li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={simulateBattle} className="simulate-button">
        Simulate Battle
      </button>
      {result && <div className="result">{result}</div>}

      <div className="leaderboard">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Pokémon</th>
              <th>ELO Rating</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No data available
                </td>
              </tr>
            ) : (
              leaderboard.map((pokemon, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{pokemon.name}</td>
                  <td>{pokemon.rating}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
