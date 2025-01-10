# Pokémon Elo Rating System

A React-based web app to simulate Pokémon battles and update their Elo ratings based on the results. Players can choose between two randomly selected Pokémon, and the winner's Elo rating is updated accordingly. This app helps simulate how Pokémon would rank over time in a competitive system.

## Features

- **Elo Rating Calculation**: Uses the Elo rating system to adjust Pokémon ratings after each battle.
- **Random Pokémon Selection**: Two Pokémon are selected randomly from a predefined list for each match.
- **Match Simulation**: Players can click on a Pokémon to choose the winner, and the ratings are updated accordingly.
- **Dynamic Interface**: The names and ratings of the Pokémon are displayed and updated after each match.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **JavaScript (ES6)**: Core language for app logic.
- **CSS**: For styling the user interface.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/pokemon-elo-rating.git
```

2. Navigate into the project directory:

```bash
cd pokemon-elo-rating
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The app will run on `http://localhost:3000`.

## Usage

1. The app will display two randomly selected Pokémon.
2. Click on one of the Pokémon to choose the winner.
3. The Elo rating of the winner and loser will be updated based on the outcome.
4. A new pair of Pokémon will be selected for the next match.

## How Elo Rating Works

The Elo rating system is used to calculate the relative skill levels of two players. After each match:

- The winner's rating is adjusted upward based on the difference in ratings between the two Pokémon.
- The loser’s rating is adjusted downward accordingly.
- The formula used is:

```javascript
1 / (1 + Math.pow(10, (rating1 - rating2) / 100))
```

- The `K` factor is set to 16 in this implementation.

## Future Improvements

- Add more Pokémon to the list.
- Implement animations for the Pokémon.
- Introduce a leaderboard or ranking system for the Pokémon.
- Allow players to choose Pokémon manually instead of random selection.
- Implement a multiplayer feature to let users battle against each other.

