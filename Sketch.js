// Variáveis do jogo
let xBolinha = 300;
let yBolinha = 200;
let diametro = 15;
let raio = diametro / 2;

let velocidadeXBolinha = 3; 
let velocidadeYBolinha = 3;
let incrementoVelocidade = 0.2;
let velocidadeMaxima = 12;

let xRaquete = 5;
let yRaquete = 150;

let raqueteLargura = 10;
let raqueteAltura = 90;

let xRaqueteOponente = 585;
let yRaqueteOponente = 150;
let velocidadeYOponente;

let meusPontos = 0;
let pontosOponente = 0;

let chanceDeErrar = 0;
let raquetada;
let pontuacao;

let telaInicial = true;
let doisJogadores = false;

function preload() {
  raquetada = loadSound("raquetada.mp3");
  pontuacao = loadSound("ponto.mp3");
}

function setup() {
  createCanvas(600, 400);
}

function draw() {
  if (telaInicial) {
    telaInicialDraw();
  } else {
    jogoDraw();
  }
}

function telaInicialDraw() {
  background(0);
  textAlign(CENTER);
  textSize(50);
  fill(255);
  text("PING PONG DO THIAGO", width / 2, height / 5);

  textSize(20);
  fill(255);
  text("Pressione Q para um Jogador", width / 2 - 13, height / 2);
  text("Pressione E para dois Jogadores", width / 2, height / 2 + 30);

  textSize(16);
  fill(255);
  text("Pressione ESC durante o Game para voltar para a Tela inicial", width / 2, height / 2 + 189);
}

function jogoDraw() {
  background(255);
  fill(0);
  mostrarBolinha();
  movimentarBolinha();
  verificarColisaoComABorda();
  mostrarRaquete(xRaquete, yRaquete);
  mostrarRaquete(xRaqueteOponente, yRaqueteOponente);
  movimentarRaquetes();
  colisaoComRaqueteBiblioteca(xRaquete, yRaquete);
  colisaoComRaqueteBiblioteca(xRaqueteOponente, yRaqueteOponente);
  incluirPlacar();
  bolinhaNaoFicaPresa();
}

function mostrarBolinha() {
  circle(xBolinha, yBolinha, diametro);
}

function movimentarBolinha() {
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function verificarColisaoComABorda() {
  if (xBolinha + raio > width) {
    meusPontos++;
    pontuacao.play();
    reiniciarBolinha(false);
  }
  if (xBolinha - raio < 0) {
    pontosOponente++;
    pontuacao.play();
    reiniciarBolinha(true);
  }
  if (yBolinha + raio > height || yBolinha - raio < 0) {
    velocidadeYBolinha *= -1;
  }
}

function reiniciarBolinha(paraEsquerda) {
  xBolinha = width / 2;
  yBolinha = height / 2;
  velocidadeXBolinha = 3 * (paraEsquerda ? -1 : 1);
  velocidadeYBolinha = 3;
}

function mostrarRaquete(x, y) {
  rect(x, y, raqueteLargura, raqueteAltura);
}

function movimentarRaquetes() {
  movimentarRaqueteJogador();
  if (doisJogadores) {
    movimentarRaqueteOponente();
  } else {
    movimentarRaqueteOponenteAutomatico();
  }
}

function movimentarRaqueteJogador() {
  if (keyIsDown(87)) {
    yRaquete -= 10;
  }
  if (keyIsDown(83)) {
    yRaquete += 10;
  }
}

function movimentarRaqueteOponente() {
  if (keyIsDown(UP_ARROW)) {
    yRaqueteOponente -= 10;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yRaqueteOponente += 10;
  }
}

function movimentarRaqueteOponenteAutomatico() {
  velocidadeYOponente = yBolinha - yRaqueteOponente - raqueteLargura / 2 - 30;
  yRaqueteOponente += velocidadeYOponente + chanceDeErrar;
  calcularChanceDeErrar();
}

function calcularChanceDeErrar() {
  if (pontosOponente >= meusPontos) {
    chanceDeErrar += 1;
    if (chanceDeErrar >= 39) {
      chanceDeErrar = 40;
    }
  } else {
    chanceDeErrar -= 1;
    if (chanceDeErrar <= 35) {
      chanceDeErrar = 35;
    }
  }
}

function colisaoComRaqueteBiblioteca(x, y) {
  let colisao = collideRectCircle(x, y, raqueteLargura, raqueteAltura, xBolinha, yBolinha, diametro);
  if (colisao) {
    if (x === xRaqueteOponente) {
      xBolinha = xRaqueteOponente - raqueteLargura / 2 - raio;
    } else {
      xBolinha = xRaquete + raqueteLargura / 2 + raio;
    }
    velocidadeXBolinha *= -1;
    raquetada.play();

    // Aumentar a velocidade da bolinha a cada colisão com a raquete
    if (abs(velocidadeXBolinha) < velocidadeMaxima) {
      velocidadeXBolinha += (velocidadeXBolinha > 0 ? incrementoVelocidade : -incrementoVelocidade);
    }
    if (abs(velocidadeYBolinha) < velocidadeMaxima) {
      velocidadeYBolinha += (velocidadeYBolinha > 0 ? incrementoVelocidade : -incrementoVelocidade);
    }
  }
}

function incluirPlacar() {
  stroke(255);
  textAlign(CENTER);
  fill(color(0, 0, 0));
  rect(150, 10, 40, 20);
  fill(255);
  text(meusPontos, 170, 26);
  fill(color(0, 0, 0));
  rect(450, 10, 40, 20);
  fill(255);
  text(pontosOponente, 470, 26);
}

function bolinhaNaoFicaPresa() {
  if (xBolinha - raio < 0) {
    xBolinha = 23;
  }
}

function keyPressed() {
  if (telaInicial) {
    if (key === 'q' || key === 'Q') {
      iniciarJogo(false);
    } else if (key === 'e' || key === 'E') {
      iniciarJogo(true);
    }
  } else if (key === 'Escape') {
    telaInicial = true;
  }
}

function iniciarJogo(doisJogadoresAtivado) {
  telaInicial = false;
  doisJogadores = doisJogadoresAtivado;
  reiniciarBolinha(false);
  meusPontos = 0;
  pontosOponente = 0;
}
