import React, { Component } from 'react';
import './TicTacToe.scss';

const isVertical = (cells, boardSize) => {
    for (let i = 0; i < cells.length; i++) {
        let counter = 0;
        let column = cells[i][0];
        for (let j = 0; j < cells.length; j++) {
            if (cells [j][0] === column) {
                counter++;
            }
        }
        if (counter === boardSize) {
            return true;
        }
    }
    return false;
}

const isHorizontal = (cells, boardSize) => {
    for (let i = 0; i < cells.length; i++) {
        let counter = 0;
        let row = cells[i][1];
        for (let j = 0; j < cells.length; j++) {
            if (cells [j][1] === row) {
                counter++;
            }
        }
        if (counter === boardSize) {
            return true;
        }
    }
    return false;
}

const isDiagonal = (cells, boardSize) => {
    let isBackDiagonal = false;
    let isForwardDiagonal = false;
    let counter = 0;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i][0] === cells[i][1]) {
            counter++;
        }
    }
    if (counter === boardSize) {
        isBackDiagonal = true;
    }
    let forwardDiagonalCounter = 0;
    let y = boardSize - 1;
    for (let x = 0; x < boardSize; x++) {
        if (cells.find(cell => cell[0] === x && cell[1] === y)) {
            forwardDiagonalCounter++;
        }
        y--;
    }

    if (forwardDiagonalCounter === boardSize) {
        isForwardDiagonal = true;
    }

    return isBackDiagonal || isForwardDiagonal;
}

export default class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextValue: 'x',
            xCells: [],
            oCells: [],
            errorMessage: '',
            boardSize: 0,
            winner: null,
            startGame: false
        }
        this.setBoardSize = this.setBoardSize.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.toggleValue = this.toggleValue.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    startGame() {
        if (this.state.boardSize > 1) {
            this.setState({
                startGame: true
            });
        }
        else {
            this.setState({
                errorMessage: 'Please enter a number that is greater than 1.'
            });
        }
    }

    setBoardSize(e) {
        this.setState({
            boardSize: Number(e.target.value)
        });
    }

    didSomeoneWin(cells) {
        const { boardSize } = this.state;
        if (isVertical(cells, boardSize) || isHorizontal(cells, boardSize) || isDiagonal(cells, boardSize)) {
            return true;
        }
    }

handleCellClick(e) {
        const { nextValue, winner } = this.state;
        if (!winner) {
            const cell = e.target;
            if (cell.innerText) {
                this.setState({
                    errorMessage: 'You can only click on empty cells!'
                });
            }
            else {
                const currentCell = [cell.cellIndex, cell.parentElement.rowIndex];
                cell.innerText = nextValue;
                cell.classList.add(nextValue);
                this.toggleValue(currentCell);
            }
        }
    }

    toggleValue(currentCell) {
        const { boardSize } = this.state;
        if (this.state.nextValue === 'x') {
            this.setState({
                nextValue: 'o',
                xCells: [...this.state.xCells, currentCell],
                errorMessage: ''
            }, () => {
                const { xCells, oCells } = this.state;
                if (xCells.length >= parseInt(boardSize)) {
                    if (this.didSomeoneWin(xCells)) {
                        this.setState({
                            winner: 'x'
                        });
                    }
                }
                if (xCells.length + oCells.length === boardSize * boardSize) {
                    this.setState({
                        winner: 'TIE'
                    });
                }
            });
        }
        else {
            this.setState({
                nextValue: 'x',
                oCells: [...this.state.oCells, currentCell],
                errorMessage: ''
            }, () => {
                const { xCells, oCells } = this.state;
                if (oCells.length >= parseInt(boardSize)) {
                    if (this.didSomeoneWin(oCells)) {
                        this.setState({
                            winner: 'o'
                        });
                   }
                }
                if (xCells.length + oCells.length === boardSize * boardSize) {
                    this.setState({
                        winner: 'TIE'
                    });
                }
            });
        }
    }

    resetBoard() {
        let tableData = document.getElementsByTagName('td');
        if (tableData.length) {
            tableData = Array.from(tableData);
            tableData.forEach(cell => {
                cell.innerText = '';
                cell.classList.remove('x');
                cell.classList.remove('o');
            });
            this.setState({
                xCells: [],
                oCells: [],
                nextValue: 'x',
                startGame: true,
                winner: null
            });
        }
    }

    renderTable() {
        const tableRows = [];
        const tableData = [];
        for (let i = 0; i < this.state.boardSize; i++) {
            tableData.push(<td key={`td-${i}`} onClick={this.handleCellClick}></td>)
            tableRows.push(<tr key={`tr-${i}`}>{tableData}</tr>);
        }
        return tableRows;
    }

    render() {
        const { errorMessage, startGame, winner } = this.state;
        return (
            <div className="d-flex justify-content-center">
                <div>
                    <div className="d-flex justify-content-center">
                        <h1>Tic Tac Toe</h1>
                        {startGame && <button className="pt" onClick={this.resetBoard}>Reset Board</button> }
                    </div>
                {errorMessage && (
                    <p className="error">{errorMessage}</p>
                )}
                { winner && (
                    <p className="winningMessage">{winner === 'TIE' ? 'There was a tie!' : `${winner} has won!`}</p>
                )}
                {
                    startGame ? (
                        <div>
                            <table>
                                <tbody>
                                    {this.renderTable()}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                            <div>
                                <p>Please enter a Tic Tac Toe board size.</p>
                                <input onChange={this.setBoardSize} className="mr"/>
                                <button onClick={this.startGame}>Start</button>
                            </div>
                        )
                }
                </div>
            </div>
        );
    }
}



