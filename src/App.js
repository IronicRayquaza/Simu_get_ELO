import React, { useState } from "react";

function App() {
  function Probability(rating1, rating2) {
    return 1.0 / (1 + Math.pow(10, (rating1 - rating2) / 400.0));
  }

  function eloRating(Ra, Rb, K, outcome) {
    let Pa = Probability(Rb, Ra);
    return Math.ceil(Ra + K * (outcome - Pa));
  }

  const pokemons = [
    "Mew",
    "Mewtwo",
    "Umbreon",
    "Espeon",
    "Sylveon",
    "Pikachu",
    "Rayquaza",
    "Groudon",
    "Kyogre",
    "Zygarde",
  ];

  const initialRatings = Array(10).fill(100); // All ratings start at 100

  const getRandomPokemon = () => Math.floor(Math.random() * pokemons.length);

  const [ratings, setRatings] = useState(initialRatings);
  const [randomIndices, setRandomIndices] = useState(() => {
    const random1 = getRandomPokemon();
    let random2 = getRandomPokemon();
    while (random2 === random1) {
      random2 = getRandomPokemon();
    }
    return { random1, random2 };
  });

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const poke1 = pokemons[randomIndices.random1];
  const poke2 = pokemons[randomIndices.random2];
  const poke1Rating = ratings[randomIndices.random1];
  const poke2Rating = ratings[randomIndices.random2];

  function handleWin(winner) {
    const winningIndex = winner === "left" ? randomIndices.random1 : randomIndices.random2;
    const losingIndex = winner === "left" ? randomIndices.random2 : randomIndices.random1;

    // Update ratings
    const newRatings = [...ratings];
    newRatings[winningIndex] = eloRating(ratings[winningIndex], ratings[losingIndex], 16, 1);
    newRatings[losingIndex] = eloRating(ratings[losingIndex], ratings[winningIndex], 16, 0);

    // Get new Pokémon to replace the losing side
    let newLosingIndex;
    do {
      newLosingIndex = getRandomPokemon();
    } while (newLosingIndex === winningIndex);

    setRatings(newRatings);
    setRandomIndices({
      random1: winner === "left" ? randomIndices.random1 : newLosingIndex,
      random2: winner === "right" ? randomIndices.random2 : newLosingIndex,
    });
  }

  return (
    <div className="container">
      <div className="card" id="left" onClick={() => handleWin("left")}>
        {poke1}
        <br />
        {poke1Rating}
      </div>

      <div>
        <h1>Choose one!</h1>
        <button className="open" onClick={()=>{setShowLeaderboard(true)}}>Leaderboard</button>
      </div>

      <div className="card" id="right" onClick={() => handleWin("right")}>
        {poke2}
        <br />
        {poke2Rating}
      </div>

      {showLeaderboard && (
        <div className="modal">
          <div className="modal-inner">
            <h1>Leaderboard</h1>
            <h2>Top 10</h2>
            <ul>
  {[...pokemons]
    .map((pokemon, index) => ({ pokemon, rating: ratings[index] }))
    .sort((a, b) => b.rating - a.rating) // Sort in descending order of ratings
    .slice(0, 10) // Take only the top 10
    .map((entry) => (
      <li key={entry.pokemon}>
        {entry.pokemon}: {entry.rating}
      </li>
    ))}
</ul>
            <button className="close" onClick={() => setShowLeaderboard(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
