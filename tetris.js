// Helper functions
function clone(s) {
  for(p in s)
    this[p] = (typeof(s[p]) == 'object')? new clone(s[p]) : s[p];
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// Block object
function Block() {
  var r = Math.floor((Math.random()*Object.size(Blocks)));
  
  this.matrix = new clone(Blocks[r].matrix);
  this.pivot = Blocks[r].pivot;
  this.color = Blocks[r].color;
  this.x = 4*30;
  this.y = 0;

  this.rotate = function() {
    var matrix = new clone(this.matrix);

    for (var i=3;i>=0;i--) {
      for (var j=0;j<4;j++) {
        this.matrix[3-j][i] = matrix[i][j];
      }
    } 
    delete matrix;
  }
}

// Different types of blocks and their properties
var Blocks = {
  0 : {
    matrix : [
      [0,1,0,0],
      [0,1,1,0],
      [0,0,1,0],
      [0,0,0,0]
    ],
    pivot : [1,1],
    color : "#174040"
  },
  1 : {
    matrix : [
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0]
    ],
    pivot : [1,1],
    color:"#888C65"
  },
  2 : {
    matrix : [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    pivot : [1,1],
    color : "#D9CA9C"
  },
  3 : {
    matrix: [
      [0,1,1,0],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,0,0]
    ],
    pivot : [1,1],
    color : "#D98162"
  },
  4 : {
    matrix: [
      [0,1,1,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,0,0,0]
    ],
    pivot : [1,1],
    color: "#A65858"
  },
  5 : {
    matrix: [
      [0,1,0,0],
      [0,1,1,0],
      [0,1,0,0],
      [0,0,0,0]
    ],
    pivot : [1,1],
    color: "#788880"
  }
}



var Tetris = {
  canvas : {},
  ctx : {},
  interval : 0,
  settings : {
    width : 0,
    height : 0,
    block : 30,
    interval : 1000
  },
  init : function() {
    Tetris.curBlock = new Block();
    
    Tetris.canvas = $('#gameBoard');
    Tetris.ctx = Tetris.canvas[0].getContext('2d');
    
    Tetris.settings.width = $("#gameBoard").width();
    Tetris.settings.height = $("#gameBoard").height();

    Tetris.interval = setInterval("Tetris.draw()", 10);
  },
  curBlock : {},
  board : {
    add : function(block) {
      var row = parseInt(block.y/30);
      var col = parseInt(block.x/30);
      for (var r in block.matrix) {
        for (var c in block.matrix) {
          if (block.matrix[r][c])
            Tetris.board.matrix[parseInt(r)+parseInt(row)][parseInt(c)+parseInt(col)] = block.color;
        }
      }
    },
    matrix : [
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','','']
    ],
    deleteRow : function(row) {
      for (var c = 0; c < Tetris.board.matrix[row].length; c++)
        Tetris.board.matrix[row][c] = '';
    },
    shiftRows : function(row) {
      for (var r = row; r > 0; r--) {
        for (var c = 0; c < Tetris.board.matrix[r].length; c++) {
           Tetris.board.matrix[r][c] =  Tetris.board.matrix[r-1][c];
        }
      }
    },
    checkRow : function() {
      for (var r = Tetris.board.matrix.length-1; r >= 0; r--) {
        var delRow = true;
        for (var c = 0; c < Tetris.board.matrix[r].length; c++) {
          if (Tetris.board.matrix[r][c] == '') {
            delRow = false;
          }
        }
        if (delRow) {
          Tetris.board.deleteRow(r);
          Tetris.board.shiftRows(r);
          r++;
        }
      }
    }
  },
  newBlock : function() {
    Tetris.curBlock = new Block();
    if (!Tetris.check(Tetris.curBlock))
      console.log("Game Over");
  },
  moveBlock : function() {
    var block = new clone(Tetris.curBlock);
    block.y += 30;
    if (Tetris.check(block)) {
      Tetris.curBlock.y += 30;
    }
    else {
      Tetris.board.add(Tetris.curBlock);
      Tetris.board.checkRow();
      Tetris.newBlock();
    }
  },
  timer : 0,
  draw : function() {
     Tetris.ctx.clearRect( 0, 0, Tetris.settings.width, Tetris.settings.height);

     Tetris.ctx.fillStyle = "#000000";
     Tetris.ctx.beginPath();
     Tetris.ctx.rect(0, 0, Tetris.settings.width, Tetris.settings.height);
     Tetris.ctx.closePath();
     Tetris.ctx.fill();
     
     if (Tetris.timer == Tetris.settings.interval) {
       Tetris.moveBlock();
       Tetris.timer = 0;
     }

     var block = Tetris.curBlock;
     for (var r in block.matrix) {
       for (var c in block.matrix[r]) {
         if (block.matrix[r][c]) {
           Tetris.ctx.fillStyle = block.color;
           Tetris.ctx.beginPath();
           Tetris.ctx.rect(block.x+c*30, block.y+r*30, Tetris.settings.block, Tetris.settings.block);
           Tetris.ctx.closePath();
           Tetris.ctx.fill();
         }
       }
     }

     for (var r in Tetris.board.matrix) {
       for (var c in Tetris.board.matrix[r]) {
         if (Tetris.board.matrix[r][c] != '') {
           Tetris.ctx.fillStyle = Tetris.board.matrix[r][c];
           Tetris.ctx.beginPath();
           Tetris.ctx.rect(c*30, r*30, Tetris.settings.block, Tetris.settings.block);
           Tetris.ctx.closePath();
           Tetris.ctx.fill();
         }
       }
     }

     Tetris.timer += 10;
  },
  check : function(block) {
    var newx = block.x;
    var newy = block.y;
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var x = parseInt(eval((block.x/30)+c));
        var y = parseInt(eval((block.y/30)+r));
        console.log(x,y);
        if (block.matrix[r][c] && block.y+r*30 >= Tetris.settings.height)
          return false;
        if (block.matrix[r][c] && newx + c*30 < 0)
          return false;
        if (block.matrix[r][c] && newx + c*30 >= Tetris.settings.width)
          return false;
        if (block.matrix[r][c] && Tetris.board.matrix[y][x] != '') {
          return false;
        }
      }
    }

    return true;
  },
  pause : function() {
    if(Tetris.interval == 0)
      Tetris.interval = setInterval("Tetris.draw()", 10);
    else {
      clearInterval(Tetris.interval);
      Tetris.interval = 0;
    }
  },
  keyBindings : function(key) {
    switch (key) {
      case 97 :
        var block = new clone(Tetris.curBlock);
        block.x -= 30;
        if (Tetris.check(block)) 
          Tetris.curBlock.x -= 30;
        delete block;
        break;
      case 100 :
        var block = new clone(Tetris.curBlock);
        block.x += 30;
        if (Tetris.check(block))
          Tetris.curBlock.x += 30;
        delete block;
        break;
      case 115 :
        var block = new clone(Tetris.curBlock);
        block.y += 30;
        if (Tetris.check(block))
          Tetris.curBlock.y += 30;
        delete block;
        break;
      case 119 :
        var block = new clone(Tetris.curBlock);
        block.rotate();
        if (Tetris.check(block))
          Tetris.curBlock.rotate();
        delete block;
        break;
      case 112 :
        Tetris.pause();
        break;
    }
  }
};

Tetris.init();
$(document).keypress(function(e){Tetris.keyBindings(e.which);});