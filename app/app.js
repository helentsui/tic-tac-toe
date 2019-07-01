import React from 'react';
import TicTacToe from './TicTacToe';
import ReactDOM from 'react-dom';

if (document.getElementById('TicTacToe')) {
    ReactDOM.render(<TicTacToe />, document.getElementById('TicTacToe'));
}