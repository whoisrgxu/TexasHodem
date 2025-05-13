import React, { useState } from 'react';

const GamePage = () => {
    const [users, setUsers] = useState([]);
    const [gameState, setGameState] = useState('waiting'); // 'waiting', 'in-progress', 'finished'

    const startGame = () => {
        if (users.length >= 2) {
            setGameState('in-progress');
        } else {
            alert('Need at least 2 users to start the game.');
        }
    };

    const addUser = (name) => {
        setUsers([...users, { name, chips: 1000 }]);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Texas Hold'em</h1>
            {gameState === 'waiting' && (
                <div>
                    <h2>Waiting for users...</h2>
                    <button onClick={() => addUser(`User ${users.length + 1}`)}>
                        Add User
                    </button>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>{user.name} - Chips: {user.chips}</li>
                        ))}
                    </ul>
                    <button onClick={startGame} disabled={users.length < 2}>
                        Start Game
                    </button>
                </div>
            )}
            {gameState === 'in-progress' && (
                <div>
                    <h2>Game in Progress</h2>
                    <p>Game logic goes here...</p>
                </div>
            )}
            {gameState === 'finished' && (
                <div>
                    <h2>Game Over</h2>
                    <p>Results go here...</p>
                </div>
            )}
        </div>
    );
};

export default GamePage;