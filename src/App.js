import {useEffect, useState} from 'react'
import BlueCandy from './images/blue-candy.png'
import GreenCandy from './images/green-candy.png'
import OrageCandy from './images/orange-candy.png'
import PurpleCandy from './images/purple-candy.png'
import RedCandy from './images/red-candy.png'
import YellowCandy from './images/yellow-candy.png'
import BlankCandy from './images/blank.png'
import ScoreBoard from './components/ScoreBoard'


const width = 8
const candyColor = 
[
  BlueCandy , GreenCandy , OrageCandy,
  PurpleCandy, RedCandy, YellowCandy
]
function App() {

  const [currentColorArray, setCurrentColorArray] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const createBoard = () =>
  {
    const randomColorArray = []
    for(let i = 0; i < width * width; i++)
    {
      const randomColor = candyColor[Math.floor(Math.random() * candyColor.length)]
      randomColorArray.push(randomColor)
    }

    setCurrentColorArray(randomColorArray)
  }


  const checkForColumnOfFour = () =>
  {
      for(let i = 0; i <= 39; i++)
      {
        const columnOfFour = [i, i+width, i+width*2, i+width*3]
        const decidedColor = currentColorArray[i]
        const isBlank = currentColorArray[i] === BlankCandy

        if(columnOfFour.every(square => currentColorArray[square] === decidedColor && !isBlank))
        {
          columnOfFour.forEach(square => currentColorArray[square] = BlankCandy)          
          setScoreDisplay((score)=>score+4)
          return true
        }
      }
  }


  const checkForColumnOfThree = () =>
  {
      for(let i = 0; i <= 47; i++)
      {
        const columnOfThree = [i, i+width, i+width*2]
        const decidedColor = currentColorArray[i]

        const isBlank = currentColorArray[i] === BlankCandy
        
        if(columnOfThree.every(square => currentColorArray[square] === decidedColor && !isBlank))
        {
            columnOfThree.forEach(square => currentColorArray[square] = BlankCandy)
            setScoreDisplay((score)=>score+3)
            
            return true

        }
      }
  } 

  const checkForRowOfThree = () =>
  {
      for(let i = 0; i < 63; i++)
      {
        const rowOfThree = [i, i+1, i+2]
        const decidedColor = currentColorArray[i]
        const isBlank = currentColorArray[i] === BlankCandy

        const notValidSquare = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]

        if(notValidSquare.includes(i))
          continue

        if(rowOfThree.every(square => currentColorArray[square] === decidedColor && !isBlank))
        {
          rowOfThree.forEach(square => currentColorArray[square] = BlankCandy)
          setScoreDisplay((score)=>score+3)

          return true
        }
      }
  } 

  
  const checkForRowOfFour = () =>
  {
      for(let i = 0; i < 63; i++)
      {
        const rowOfFour = [i, i+1, i+2, i+3]
        const decidedColor = currentColorArray[i]
        const isBlank = currentColorArray[i] === BlankCandy

        const notValidSquare = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63]

        if(notValidSquare.includes(i))
          continue
          
        if(rowOfFour.every(square => currentColorArray[square] === decidedColor && !isBlank))
        {
          rowOfFour.forEach(square => currentColorArray[square] = BlankCandy)
          setScoreDisplay((score)=>score+4)

          return true
        }
      }
  }

  const moveSquareBelow = () =>
  {
    const firstRow = [0,1,2,3,4,5,6,7]
      for(let i = 0; i <= 55; i++)
      {
        const isFirstRow = firstRow.includes(i)

        if(isFirstRow && currentColorArray[i] === BlankCandy)
        {
          let randomNumber = Math.floor(Math.random() * candyColor.length)
          currentColorArray[i] = candyColor[randomNumber]
        }
        if((currentColorArray[i+width]) === BlankCandy)
        {
          currentColorArray[i+width] = currentColorArray[i]
          currentColorArray[i] = BlankCandy
        }
      }
  }

  const dragStart = (e) =>
  {
      setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) =>
  {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = (e) =>
  {    
    const squareBeingDraggedID = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedID = parseInt(squareBeingReplaced.getAttribute('data-id')) 

    currentColorArray[squareBeingReplacedID] = squareBeingDragged.getAttribute('src')
    currentColorArray[squareBeingDraggedID] = squareBeingReplaced.getAttribute('src')


    const validMoves = [
      squareBeingDraggedID - 1,
      squareBeingDraggedID - width,
      squareBeingDraggedID + 1,
      squareBeingDraggedID + width
    ]
     
      const validMove = validMoves.includes(squareBeingReplacedID)

      const isColumnOfFour = false
      const isColumnOfThree = false
      const isRowOfFour = false
      const isRowOfThree = false

      if(validMove)
      {
         isColumnOfFour = checkForColumnOfFour()
         isColumnOfThree = checkForColumnOfThree()
         isRowOfFour = checkForRowOfFour()
         isRowOfThree = checkForRowOfThree()
      }

      if(squareBeingReplacedID &&
        validMove &&
        (isRowOfFour ||
        isRowOfThree ||
        isColumnOfFour ||
        isColumnOfThree))
        {
          setSquareBeingDragged(null)
          setSquareBeingReplaced(null)
        }else{
          currentColorArray[squareBeingReplacedID] = 
          squareBeingReplaced.getAttribute('src')

          currentColorArray[squareBeingDraggedID] = 
          //squareBeingDragged.style.backgroundColor
          squareBeingDragged.getAttribute('src')
        }
  }

  useEffect(()=>
  {
    createBoard()
  },[])

  useEffect(()=>
  {
     const timer = setInterval(()=>
     {
       checkForColumnOfFour()
       checkForColumnOfThree()
       checkForRowOfFour()
       checkForRowOfThree()
       moveSquareBelow()
       setCurrentColorArray([...currentColorArray])
     },100)
     return () => clearInterval(timer)
  },
  [  checkForRowOfFour,
     checkForRowOfThree,
     checkForColumnOfThree,
     checkForColumnOfFour,
     moveSquareBelow,
     currentColorArray
  ])

 

  return (
    <div className="app">
      <div className='game'>
        {currentColorArray.map((candyColor, index)=>
        (<img 
              key={index}
              //style={{background:candyColor}}
              src={candyColor}
              alt={candyColor}
              data-id = {index}
              draggable={true}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter = {(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDragStart={dragStart}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
              />)
        )}
      </div>
     <ScoreBoard scoreDisplay = {scoreDisplay}/>
    </div>
  );
}

export default App;
