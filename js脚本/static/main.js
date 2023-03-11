/**
 * const varible
 * STEP: move STEPpx once
 * WIDTH: width of container
 * HEIGHT: height of container
 */
const STEP = 40
const WIDTH = 400
const HEIGHT = 720
const ROW = HEIGHT / STEP
const COL = WIDTH / STEP
var scores = 0;
/**
 * MODELS
 */
var MODELS = [
    // L MODEL has 4 blocks
    {
        0: {
            row: 2,
            col: 0,
        },
        1: {
            row: 2,
            col: 1,
        },
        2: {
            row: 2,
            col: 2,
        },
        3: {
            row: 1,
            col: 2,
        }
    },
    // 第二个样式(凸)
    {
        0: {
            row: 1,
            col: 1
        },
        1: {
            row: 0,
            col: 0
        },
        2: {
            row: 1,
            col: 0
        },
        3: {
            row: 2,
            col: 0
        },
    },
    //  第三个样式(田)
    {
        0: {
            row: 1,
            col: 1
        },
        1: {
            row: 2,
            col: 1
        },
        2: {
            row: 1,
            col: 2
        },
        3: {
            row: 2,
            col: 2
        },
    },
    // 第四个样式(一)
    {
        0: {
            row: 0,
            col: 0
        },
        1: {
            row: 0,
            col: 1
        },
        2: {
            row: 0,
            col: 2
        },
        3: {
            row: 0,
            col: 3
        },
    },
    // 第五个样式(Z)
    {
        0: {
            row: 1,
            col: 1
        },
        1: {
            row: 1,
            col: 2
        },
        2: {
            row: 2,
            col: 2
        },
        3: {
            row: 2,
            col: 3
        },
    }
]
var curModel = {}
var curX = 0, curY = 0  // note MODEL loation when moving
var fixedBlocks = {}  // remember all fixed blocks K=row_col, V=block
var mInterval = null  // time count
/**
 * import lodash (this version doesn't support ES6)
 */
var  JSElement=document.createElement("script");
JSElement.setAttribute("type","text/javascript");
JSElement.setAttribute("src","lodash.min.js");
document.body.appendChild(JSElement);

/**
 * entry of main.js
 * function init() will be execute when htmlfile is loaded
 */
function init(){
    createModel()
    onKeyDown()
}

/**
 * watch keyEvent
 */
function onKeyDown(){
    document.onkeydown = function ( event ) {
        let value = event.key
        console.log(value);
        switch( value ){
            case "ArrowUp":
                rotate()
                break
            case "ArrowDown":
                move(0, 1)
                break
            case "ArrowLeft":
                move(-1, 0)
                break
            case "ArrowRight":
                move(1, 0)
                break
            default:
                console.log("other keys")
                break
        }
    }
}

/**
 * move in a rectangular coordinate
 * @param x move x*STEPpx on x-dir 
 * @param y move y*STEPpx on y-dir
 */
function move(x, y){
    if(meet(curX+x, curY+y, curModel)) {
        if(y!=0) fixBottomModel()
        return
    }
    curX += x
    curY += y
    locationBlocks()
}

/**
 * rotate MODEL 90
 */
function rotate(){
    var cloneCurModel = _.cloneDeep(curModel) // using lodash
    for(let key in cloneCurModel){
        let block = cloneCurModel[key]
        let temp = block.row
        block.row = block.col
        block.col = 3 - temp
        /**
         * change 3 if you change model base
         */
    }
    if(meet(curX, curY, cloneCurModel)) return
    curModel = cloneCurModel
    locationBlocks()
}

/**
 * create a MODEL and put this MODEL onto container
 */
function createModel(){
    if(isOver()){
        gameOver()
        return
    }
    curModel = MODELS[_.random(0, MODELS.length-1)]
    curX = 0
    curY = 0
    for(let key in curModel) {
        let block = document.createElement("div")
        block.className = "active_block"
        // block.style = {top:"0px", left:"0px"}
        document.getElementById("container").appendChild(block)
    }
    locationBlocks()
    autoFall()
}

/**
 * locate current MODEL depending its shape and input
 */
function locationBlocks(){
    checkBound()
    let eles = document.getElementsByClassName("active_block")
    for(let i=0;i<eles.length;++i){
        let block = eles[i]
        let blockModel = curModel[i]
        block.style.top = (blockModel.row + curY) * STEP + "px"
        block.style.left = (blockModel.col + curX)* STEP + "px"
    }
}

/**
 * asure the current MODEL move only in our container
 */
function checkBound(){
    let leftBound = 0, rightBound = COL, bottomBound = ROW
    for(let key in curModel){
        let block = curModel[key]
        if(block.col+curX<leftBound) curX++
        if(block.col+curX>=rightBound) curX--
        if(block.row+curY>=bottomBound){
            curY--
            fixBottomModel()
        }
    }
}

/**
 * LOCK the current MODEL when it reachs the bottom
 */
function fixBottomModel(){
    let eles = document.getElementsByClassName("active_block")
    for(let i=eles.length-1;i>=0;--i){
        let block = eles[i]
        block.className = "fixed_block"
        let blockModel = curModel[i]
        fixedBlocks[(curY + blockModel.row) + "_" + (curX + blockModel.col)] = block
    }
    isComplete()
    createModel()
}

/**
 * note all fixed models to resolve model collision
 * @param x the x position current MODEL is going to
 * @param y the y position current MODEL is going to
 * @param model the target-MODEL current MODEL is going to change into
 * @returns true means collision, false means movable
 */
function meet(x, y, model){
    for(let k in model){
        let block = model[k]
        if(fixedBlocks[(y + block.row) + "_" + (x + block.col)]){
            return true
        }
    }
    return false
}

/**
 * check whether a line is filled completely 
 */
function isComplete(){
    for(let i = ROW-1;i>=0;--i){
        let flag = true
        for(let j=0;j<COL;++j){
            if(!fixedBlocks[i + "_" + j]){
                flag = false
                break
            }
        }
        if(flag){
            removeLine(i)
        }
    }
}

/**
 * clear the complete line
 */
function removeLine(rowNo){
    for(let i=0;i<COL;++i){
        document.getElementById("container").removeChild(fixedBlocks[rowNo+"_"+i])
        fixedBlocks[rowNo+"_"+i] = null
    }
    fall(rowNo)
    ++scores
}

/**
 * let left lines fall
 */
function fall(rowNo){
    for(let i=rowNo-1;i>=0;--i){
        for(let j=0;j<COL;++j){
            if(!fixedBlocks[i+"_"+j]) continue
            fixedBlocks[(i+1)+"_"+j] = fixedBlocks[i+"_"+j]
            fixedBlocks[(i+1)+"_"+j].style.top = (i+1)*STEP + "px"
            fixedBlocks[i+"_"+j] = null
        }
    }
}

/**
 * make MODEL automatic fall down
 */
function autoFall(){
    if(mInterval) clearInterval(mInterval)
    mInterval = setInterval(function(){
        move(0, 1)
    }, 1200)
}

/**
 * check whether game's over
 */
function isOver(){
    for(let i=0;i<COL;++i){
        if(fixedBlocks["0_"+i]){
            return true
        }
    }
    return false
}

/**
 * Game Over
 */
function gameOver(){
    if(mInterval){
        clearInterval(mInterval)
    }
    alert("Game is over. Your score is: " + scores)
}