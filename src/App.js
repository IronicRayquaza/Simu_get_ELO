import React, { useState } from "react";

function App() {
  function Probability(rating1, rating2) {
    return 1.0 / (1 + Math.pow(10, (rating1 - rating2) / 100.0));
  }

  function eloRating(Ra, Rb, K, outcome) {
    let Pa = Probability(Rb, Ra);
    Ra = Math.ceil(Ra + K * (outcome - Pa));
    return Ra;
  }

  const pokemons = [
    "Mew",
    "Mewtwo",
    "Umbreon",
    "Espeon",
    "Sylveon",
    "Pikachu",
    "Rayquaza",
    "Grodoun",
    "Kyogre",
    "Zygarde",
  ];
  const initialRatings = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  const getRandomPokemon = () => Math.floor(Math.random() * 10);

  const [randomIndices, setRandomIndices] = useState({
    random1: getRandomPokemon(),
    random2: getRandomPokemon(),
  });
   console.log(randomIndices.random1)
   console.log(randomIndices.random2)
  const [ratings, setRatings] = useState(initialRatings);

  const [{ poke1, poke2 }, changePoke] = useState({
    poke1: pokemons[randomIndices.random1],
    poke2: pokemons[randomIndices.random2],
  });
  console.log(poke1)
  console.log(poke2)
  const [{ poke1Rating, poke2Rating }, changePokeRating] = useState({
    poke1Rating: ratings[randomIndices.random1],
    poke2Rating: ratings[randomIndices.random2],
  });

  function win(event) {
    const winningSide = event.target.id; // "left" or "right"
    const losingSide = winningSide === "left" ? "poke2" : "poke1";

    const winningIndex =
      winningSide === "left" ? randomIndices.random1 : randomIndices.random2;
    const losingIndex =
      winningSide === "left" ? randomIndices.random2 : randomIndices.random1;

    // Calculate new ratings
    const newWinnerRating = eloRating(ratings[winningIndex], ratings[losingIndex], 16, 1);
    const newLoserRating = eloRating(ratings[losingIndex], ratings[winningIndex], 16, 0);

    // Update ratings array
    const updatedRatings = [...ratings];
    updatedRatings[winningIndex] = newWinnerRating;
    updatedRatings[losingIndex] = newLoserRating;

    // Replace losing Pokémon
    let newLosingIndex;
    do {
      newLosingIndex = getRandomPokemon();
    } while (newLosingIndex === winningIndex);

    const newLosingPokemon = pokemons[newLosingIndex];
    const newLosingRating = updatedRatings[newLosingIndex];

    // Update state for Pokémon names and ratings
    changePoke({
      poke1: winningSide === "left" ? poke1 : newLosingPokemon,
      poke2: winningSide === "right" ? poke2 : newLosingPokemon,
    });

    changePokeRating({
      poke1Rating: winningSide === "left" ? newWinnerRating : newLosingRating,
      poke2Rating: winningSide === "right" ? newWinnerRating : newLosingRating,
    });

    setRatings(updatedRatings);
    setRandomIndices({
      random1: winningSide === "left" ? randomIndices.random1 : newLosingIndex,
      random2: winningSide === "right" ? randomIndices.random2 : newLosingIndex,
    });

    alert(`${winningSide === "left" ? poke1 : poke2} won!`);
    console.log(pokemons);
    console.log(updatedRatings);
  }

  return (
    <div className="container">
      <div className="card" id="left" onClick={win}>
        {poke1}
        <br />
        {poke1Rating}
      </div>
      <div>
        <h1>Choose one!</h1>
      </div>
      <div className="card" id="right" onClick={win}>
        {poke2}
        <br />
        {poke2Rating}
      </div>
    </div>
  );
}

export default App;
