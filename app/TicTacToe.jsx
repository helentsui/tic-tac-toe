import React, { Component } from 'react';
import './TicTacToe.scss';

const isVertical = (cell, cells, boardSize) => {
    const column = cell[0];
    const cellsInSameColumn = cells.filter(cell => cell[0] === column);
    if (cellsInSameColumn.length === boardSize) {
        return true;
    }
    return false;
}

const isHorizontal = (cell, cells, boardSize) => {
    const row = cell[1];
    const cellsInSameRow = cells.filter(cell => cell[1] === row);
    if (cellsInSameRow.length === boardSize) {
        return true;
    }
    return false;
}

const isBackDiagonal = (cell, cells, boardSize) => {
    if (cell[0] === cell[1]) {
        const backDiagonalCells = cells.filter(cell => cell[0] === cell[1]);
        if (backDiagonalCells.length === boardSize) {
            return true;
        }
    }
    return false;
}

const isForwardDiagonal = (cells, boardSize) => {
    let isForwardDiagonal = false;
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

    return isForwardDiagonal;
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
        this.isTie = this.isTie.bind(this);
    }

    startGame() {
        if (this.state.boardSize > 1) {
            this.setState({
                startGame: true,
                errorMessage: ''
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

    didSomeoneWin(cells, currentCell) {
        const { boardSize } = this.state;
        if (isVertical(currentCell, cells, boardSize) || isHorizontal(currentCell, cells, boardSize) || isBackDiagonal(currentCell, cells, boardSize) || isForwardDiagonal(cells, boardSize)) {
            return true;
        }
    }

    handleCellClick(e) {
        const { nextValue, winner } = this.state;
        if (!winner) {
            const cell = e.target;
            if (cell.classList.contains('o') || cell.classList.contains('x')) {
                this.setState({
                    errorMessage: 'You can only click on empty cells!'
                });
            }
            else {
                const td = cell.parentElement;
                const currentCell = [td.cellIndex, td.parentElement.rowIndex];
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
                const { xCells } = this.state;
                if (xCells.length >= parseInt(boardSize)) {
                    if (this.didSomeoneWin(xCells, currentCell)) {
                        this.setState({
                            winner: 'x'
                        });
                    }
                }
                this.isTie();
            });
        }
        else {
            this.setState({
                nextValue: 'x',
                oCells: [...this.state.oCells, currentCell],
                errorMessage: ''
            }, () => {
                const { oCells } = this.state;
                if (oCells.length >= parseInt(boardSize)) {
                    if (this.didSomeoneWin(oCells, currentCell)) {
                        this.setState({
                            winner: 'o'
                        });
                   }
                }
                this.isTie();
            });
        }
    }

    isTie() {
        const { xCells, oCells, boardSize } = this.state;
        if (xCells.length + oCells.length === boardSize * boardSize) {
            this.setState({
                winner: 'TIE'
            });
        }
    }

    resetBoard() {
        let tableData = document.getElementsByClassName('tdContent');
        if (tableData.length) {
            tableData = Array.from(tableData);
            tableData.forEach(cell => {
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
            tableData.push(<td key={`td-${i}`}><div onClick={this.handleCellClick} className='tdContent'></div></td>)
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
                                <input onChange={this.setBoardSize} className="mr" type="number" />
                                <button onClick={this.startGame}>Start</button>
                            </div>
                        )
                }
                </div>
            </div>
        );
    }
}



