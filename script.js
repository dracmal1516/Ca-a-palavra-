const palavras = ["MVP", "USUARIO", "FEEDBACK", "ITERACAO", "TESTE", "VALOR", "PROTOTIPO", "AJUSTE", "METRICA", "FUNCIONALIDADE"];
const linhas = 15;
const colunas = 15;
const board = document.getElementById("board");
const listaPalavras = document.getElementById("listaPalavras");
const feedback = document.getElementById("feedback");
const grid = Array.from({length: linhas}, () => Array(colunas).fill(''));

let selecting = false;
let startCell = null;
let currentCells = [];

// Criar lista de palavras
palavras.forEach(p => {
  const li = document.createElement('li');
  li.textContent = p;
  listaPalavras.appendChild(li);
});

// Preencher letras aleatórias
function fillRandom() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (!grid[i][j]) grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
    }
  }
}

// Colocar palavras horizontal, vertical e diagonal
function placeWords() {
  palavras.forEach(word => {
    const directions = [
      [0,1], [1,0], [1,1], [-1,1] // direita, baixo, diagonal direita-baixo, diagonal direita-cima
    ];
    let placed = false;
    while(!placed) {
      const row = Math.floor(Math.random() * linhas);
      const col = Math.floor(Math.random() * colunas);
      const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
      if(canPlace(word, row, col, dx, dy)) {
        for(let i=0; i<word.length; i++){
          grid[row + i*dx][col + i*dy] = word[i];
        }
        placed = true;
      }
    }
  });
}

function canPlace(word, row, col, dx, dy){
  for(let i=0; i<word.length; i++){
    const r = row + i*dx;
    const c = col + i*dy;
    if(r<0||r>=linhas||c<0||c>=colunas) return false;
    if(grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

// Criar tabela
function createTable() {
  board.innerHTML = '';
  for(let i=0;i<linhas;i++){
    const tr = document.createElement('tr');
    for(let j=0;j<colunas;j++){
      const td = document.createElement('td');
      td.textContent = grid[i][j];
      td.dataset.row = i;
      td.dataset.col = j;
      
      td.addEventListener('mousedown', e=>{startSelecting(td)});
      td.addEventListener('mouseover', e=>{addSelecting(td)});
      td.addEventListener('mouseup', e=>{finishSelecting()});
      tr.appendChild(td);
    }
    board.appendChild(tr);
  }
}

// Funções de seleção
function startSelecting(td){
  if(td.classList.contains('correct')) return;
  selecting = true;
  startCell = td;
  currentCells = [td];
  td.style.backgroundColor = document.getElementById("corSeletor").value;
}

function addSelecting(td){
  if(!selecting || currentCells.includes(td)) return;
  const last = currentCells[currentCells.length-1];
  if(isNeighbor(last, td)){
    currentCells.push(td);
    td.style.backgroundColor = document.getElementById("corSeletor").value;
  }
}

function isNeighbor(a,b){
  const r1=parseInt(a.dataset.row), c1=parseInt(a.dataset.col);
  const r2=parseInt(b.dataset.row), c2=parseInt(b.dataset.col);
  return Math.abs(r1-r2)<=1 && Math.abs(c1-c2)<=1;
}

function finishSelecting(){
  if(!selecting) return;
  selecting=false;
  const word = currentCells.map(td=>td.textContent).join('');
  const wordRev = word.split('').reverse().join('');
  
  if(palavras.includes(word) || palavras.includes(wordRev)){
    currentCells.forEach(td=>{
      td.classList.add('correct');
      td.style.backgroundColor = '#4caf50';
    });
    const li = Array.from(listaPalavras.children).find(l=>l.textContent===word||l.textContent===wordRev);
    if(li) li.classList.add('found');
  }else{
    currentCells.forEach(td=>td.classList.add('error'));
  }
  currentCells=[];
  checkAllFound();
}

function checkAllFound(){
  if(document.querySelectorAll('#listaPalavras li.found').length === palavras.length){
    feedback.textContent = "Parabéns! Você encontrou todas as palavras!";
  }
}

// Botão apagar tentativas erradas
document.getElementById('apagarErros').addEventListener('click',()=>{
  document.querySelectorAll('td.error').forEach(td=>{
    td.style.backgroundColor='';
    td.classList.remove('error');
  });
});

// Inicializar
placeWords();
fillRandom();
createTable();
