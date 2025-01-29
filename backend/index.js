

// require("dotenv").config();
// const PORT = process.env.PORT || 5000;
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

// // Initialize Pokémon ratings
// const ratings = {};

// // Default ELO rating
// const DEFAULT_RATING = 1000;
// const K_FACTOR = 32;

// // Fetch Pokémon data
// const fetchPokemonData = async (name) => {
//   try {
//     const response = await axios.get(`${POKE_API_URL}/${name.toLowerCase()}`);
//     const { stats, types } = response.data;
//     const type = types.map((t) => t.type.name);
//     const baseStats = stats.reduce((acc, stat) => {
//       acc[stat.stat.name] = stat.base_stat;
//       return acc;
//     }, {});
//     return { name, type, stats: baseStats };
//   } catch (error) {
//     console.error(`Error fetching data for ${name}:`, error);
//     return null;  // Return null if data fetching fails
//   }
// };

// // Calculate expected score
// const calculateExpected = (ratingA, ratingB) => {
//   return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
// };

// // Update ELO ratings
// const updateElo = (winner, loser) => {
//   const ratingWinner = ratings[winner] || DEFAULT_RATING;
//   const ratingLoser = ratings[loser] || DEFAULT_RATING;

//   const expectedWinner = calculateExpected(ratingWinner, ratingLoser);
//   const expectedLoser = calculateExpected(ratingLoser, ratingWinner);

//   // Update ratings
//   ratings[winner] = Math.round(ratingWinner + K_FACTOR * (1 - expectedWinner));
//   ratings[loser] = Math.round(ratingLoser + K_FACTOR * (0 - expectedLoser));
// };

// // Battle simulation
// const simulateBattle = async (team1, team2) => {
//   if (team1.length === 0 || team2.length === 0) {
//     return "Error: Both teams must have at least one Pokémon.";
//   }

//   const team1Data = await Promise.all(team1.map(fetchPokemonData));
//   const team2Data = await Promise.all(team2.map(fetchPokemonData));

//   // Filter out invalid Pokémon data (null values)
//   const validTeam1 = team1Data.filter((data) => data !== null);
//   const validTeam2 = team2Data.filter((data) => data !== null);

//   if (validTeam1.length === 0 || validTeam2.length === 0) {
//     return "Error: One or both teams have invalid Pokémon.";
//   }

//   let index1 = 0,
//     index2 = 0;

//   // Simulate the battle with valid Pokémon
//   while (index1 < validTeam1.length && index2 < validTeam2.length) {
//     const active1 = validTeam1[index1];
//     const active2 = validTeam2[index2];

//     console.log(`Battle: ${active1.name} vs ${active2.name}`);

//     while (active1.stats.hp > 0 && active2.stats.hp > 0) {
//       const damageTo2 = Math.max(1, active1.stats.attack - active2.stats.defense / 2);
//       active2.stats.hp -= damageTo2;

//       if (active2.stats.hp <= 0) break;

//       const damageTo1 = Math.max(1, active2.stats.attack - active1.stats.defense / 2);
//       active1.stats.hp -= damageTo1;
//     }

//     if (active1.stats.hp <= 0) {
//       updateElo(active2.name, active1.name);
//       index1++;
//     }
//     if (active2.stats.hp <= 0) {
//       updateElo(active1.name, active2.name);
//       index2++;
//     }
//   }

//   if (index1 === validTeam1.length && index2 === validTeam2.length) return "It's a draw!";
//   return index1 === validTeam1.length ? "Team 2 wins!" : "Team 1 wins!";
// };

// // API endpoint
// app.post("/simulate", async (req, res) => {
//   const { team1, team2 } = req.body;

//   // Check if both teams have at least one Pokémon
//   if (team1.length === 0 || team2.length === 0) {
//     return res.status(400).json({ error: "Both teams must have at least one Pokémon." });
//   }

//   const result = await simulateBattle(team1, team2);
//   if (result.startsWith("Error")) {
//     return res.status(400).json({ error: result });
//   }

//   res.json({ result, ratings });
// });

// // API endpoint to get rankings
// app.get("/rankings", (req, res) => {
//   const sortedRankings = Object.entries(ratings)
//     .sort((a, b) => b[1] - a[1])
//     .map(([name, rating]) => ({ name, rating }));

//   res.json(sortedRankings);
// });

// // Start server
// // const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Allow requests from your frontend URL
const corsOptions = {
  origin: 'https://simu-get-elo.vercel.app', // Your frontend URL
  methods: ['GET', 'POST'], // Adjust methods as needed
  allowedHeaders: ['Content-Type'],
};

app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS configuration

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

// Initialize Pokémon ratings
const ratings = {};

// Default ELO rating
const DEFAULT_RATING = 1000;
const K_FACTOR = 32;

// Fetch Pokémon data
const fetchPokemonData = async (name) => {
  try {
    const response = await axios.get(`${POKE_API_URL}/${name.toLowerCase()}`);
    const { stats, types } = response.data;
    const type = types.map((t) => t.type.name);
    const baseStats = stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
    return { name, type, stats: baseStats };
  } catch (error) {
    console.error(`Error fetching data for ${name}:`, error);
    return null;  // Return null if data fetching fails
  }
};

// Calculate expected score
const calculateExpected = (ratingA, ratingB) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

// Update ELO ratings
const updateElo = (winner, loser) => {
  const ratingWinner = ratings[winner] || DEFAULT_RATING;
  const ratingLoser = ratings[loser] || DEFAULT_RATING;

  const expectedWinner = calculateExpected(ratingWinner, ratingLoser);
  const expectedLoser = calculateExpected(ratingLoser, ratingWinner);

  // Update ratings
  ratings[winner] = Math.round(ratingWinner + K_FACTOR * (1 - expectedWinner));
  ratings[loser] = Math.round(ratingLoser + K_FACTOR * (0 - expectedLoser));
};

// Battle simulation
const simulateBattle = async (team1, team2) => {
  if (team1.length === 0 || team2.length === 0) {
    return "Error: Both teams must have at least one Pokémon.";
  }

  const team1Data = await Promise.all(team1.map(fetchPokemonData));
  const team2Data = await Promise.all(team2.map(fetchPokemonData));

  // Filter out invalid Pokémon data (null values)
  const validTeam1 = team1Data.filter((data) => data !== null);
  const validTeam2 = team2Data.filter((data) => data !== null);

  if (validTeam1.length === 0 || validTeam2.length === 0) {
    return "Error: One or both teams have invalid Pokémon.";
  }

  let index1 = 0,
    index2 = 0;

  // Simulate the battle with valid Pokémon
  while (index1 < validTeam1.length && index2 < validTeam2.length) {
    const active1 = validTeam1[index1];
    const active2 = validTeam2[index2];

    console.log(`Battle: ${active1.name} vs ${active2.name}`);

    while (active1.stats.hp > 0 && active2.stats.hp > 0) {
      const damageTo2 = Math.max(1, active1.stats.attack - active2.stats.defense / 2);
      active2.stats.hp -= damageTo2;

      if (active2.stats.hp <= 0) break;

      const damageTo1 = Math.max(1, active2.stats.attack - active1.stats.defense / 2);
      active1.stats.hp -= damageTo1;
    }

    if (active1.stats.hp <= 0) {
      updateElo(active2.name, active1.name);
      index1++;
    }
    if (active2.stats.hp <= 0) {
      updateElo(active1.name, active2.name);
      index2++;
    }
  }

  if (index1 === validTeam1.length && index2 === validTeam2.length) return "It's a draw!";
  return index1 === validTeam1.length ? "Team 2 wins!" : "Team 1 wins!";
};

// API endpoint
app.post("/simulate", async (req, res) => {
  const { team1, team2 } = req.body;

  // Check if both teams have at least one Pokémon
  if (team1.length === 0 || team2.length === 0) {
    return res.status(400).json({ error: "Both teams must have at least one Pokémon." });
  }

  const result = await simulateBattle(team1, team2);
  if (result.startsWith("Error")) {
    return res.status(400).json({ error: result });
  }

  res.json({ result, ratings });
});

// API endpoint to get rankings
app.get("/rankings", (req, res) => {
  const sortedRankings = Object.entries(ratings)
    .sort((a, b) => b[1] - a[1])
    .map(([name, rating]) => ({ name, rating }));

  res.json(sortedRankings);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
