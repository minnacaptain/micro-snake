enum Dir {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

enum GameMode {
    NAME_SELECTION = 0,
    SNAKE = 1
}

interface Point {
    cx: number
    cy: number
}

let gameMode: GameMode = GameMode.NAME_SELECTION
let letterIndex = 0
let playerName = ''

let gameIsStarted = false
let gameIsOver = false
let snakeArray: Point[] = []
let maxSnakeLength = 1
let direction: Dir = Dir.RIGHT
let currentFood: Point = null

const unplotScreen = () => {
    for (let gx = 0; gx < 5; gx = gx + 1) {
        for (let gy = 0; gy < 5; gy = gy + 1) {
            led.unplot(gx, gy)
        }
    }
}

input.onButtonPressed(Button.AB, () => {
    if (gameMode === GameMode.NAME_SELECTION && playerName.length === 0) {
        showLetters(letterIndex)
    } else if (gameMode === GameMode.NAME_SELECTION) {
        unplotScreen()
        basic.showString(playerName)
        gameMode = GameMode.SNAKE
    } else if (gameMode === GameMode.SNAKE && !gameIsOver && !gameIsStarted) {
        unplotScreen()
        gameIsStarted = true
        control.inBackground(() => doGame())
    }
})

input.onButtonPressed(Button.B, () => {
    if (gameMode === GameMode.NAME_SELECTION) {
        selectLetter(letterIndex)
        unplotScreen()
        basic.pause(200)
        letterIndex = 0
        showLetters(letterIndex)
    } else if (gameMode === GameMode.SNAKE) {
        turnClockwise()
    }
})

input.onButtonPressed(Button.A, () => {
    if (gameMode === GameMode.NAME_SELECTION) {
        letterIndex = letterIndex + 1
        showLetters(letterIndex)
    } else if (gameMode === GameMode.SNAKE) {
        turnAntiClockwise()
    }
})

const turnClockwise = () => {
    if (direction === Dir.UP) {
        direction = Dir.RIGHT
    } else if (direction === Dir.RIGHT) {
        direction = Dir.DOWN
    } else if (direction === Dir.DOWN) {
        direction = Dir.LEFT
    } else if (direction === Dir.LEFT) {
        direction = Dir.UP
    }
}

const turnAntiClockwise = () => {
    if (direction === Dir.UP) {
        direction = Dir.LEFT
    } else if (direction === Dir.RIGHT) {
        direction = Dir.UP
    } else if (direction === Dir.DOWN) {
        direction = Dir.RIGHT
    } else if (direction === Dir.LEFT) {
        direction = Dir.DOWN
    }
}

const plotSnake = (pt: Point) => {
    led.plotBrightness(pt.cx, pt.cy, 130)
}

const plotFood = (pt: Point) => {
    led.plotBrightness(pt.cx, pt.cy, 255)
}

const doGame = () => {
    let x = 0
    let y = 0
    const zeroPoint = { cx: x, cy: y }
    plotSnake(zeroPoint)
    snakeArray.push(zeroPoint)

    currentFood = getNextFood()
    plotFood(currentFood)

    while (true) {
        basic.pause(500)
        x = getNextX(x, direction)
        y = getNextY(y, direction)

        const newPoint: Point = { cx: x, cy: y }

        if (isCollision(newPoint, snakeArray)) {
            gameIsOver = true
            showGameOverScreen()
            break
        }

        snakeArray.push(newPoint)
        plotSnake(newPoint)

        checkIfFoodJustEaten(newPoint)

        snakeArray = trimSnakeArray(snakeArray)
    }
}

const showGameOverScreen = () => {
    unplotScreen()
    basic.pause(500)
    basic.showNumber(snakeArray.length)
}

const checkIfFoodJustEaten = (newPoint: Point) => {
    if (newPoint.cx === currentFood.cx && newPoint.cy === currentFood.cy) {
        maxSnakeLength = maxSnakeLength + 1
        currentFood = getNextFood()
        plotFood(currentFood)
    }
}

function getNextFood(): Point {
    const newFood: Point = {
        cx: Math.random(4),
        cy: Math.random(4)
    }
    if (isCollision(newFood, snakeArray)) {
        return getNextFood()
    }
    return newFood
}

function isCollision(point: Point, points: Point[]) {
    for (let i = 0; i < points.length; i = i + 1) {
        if (point.cx === points[i].cx && point.cy === points[i].cy) {
            return true
        }
    }
    return false
}

const trimSnakeArray = (array: Point[]): Point[] => {
    if (array.length > maxSnakeLength) {
        const lastPoint = array.removeAt(0)
        led.unplot(lastPoint.cx, lastPoint.cy)
    }
    return array
}

const getNextX = (x: number, direction: Dir): number => {
    if (direction === Dir.LEFT) {
        return loopArrayIndex(x - 1, 5)
    } else if (direction === Dir.RIGHT) {
        return loopArrayIndex(x + 1, 5)
    }
    return x
}

const getNextY = (y: number, direction: Dir): number => {
    if (direction === Dir.UP) {
        return loopArrayIndex(y - 1, 5)
    } else if (direction === Dir.DOWN) {
        return loopArrayIndex(y + 1, 5)
    }
    return y
}

const loopArrayIndex = (z: number, arrLength: number): number => {
    if (z > arrLength - 1) {
        return 0
    } else if (z < 0) {
        return arrLength - 1
    }
    return z
}

const showLetters = (index: number) => {
    basic.showString(alphabet[index])
}

const selectLetter = (index: number) => {
    playerName = playerName + alphabet[index]
}

const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'Å',
    'Ä',
    'Ö'
]
