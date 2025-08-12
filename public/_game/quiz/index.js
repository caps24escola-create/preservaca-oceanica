// CONFIG
const QUIZ_SIZE = 10;

// Banco de 25 perguntas (texto, [opções A-E], índice da correta)
const QUESTION_BANK = [
  ["O que é a maior ameaça ao recife de coral nos últimos anos?", ["Pesca artesanal", "Acidificação e aquecimento das águas", "Turismo responsável", "Plantio de manguezais", "Limpeza regular"], 1],
  ["Qual é a ação mais eficaz para reduzir lixo plástico nos oceanos?", ["Aumentar embalagens plásticas", "Reciclar e reduzir uso de plásticos descartáveis", "Jogá-los em rios", "Misturá-los ao solo", "Exportar para outros países"], 1],
  ["O que são áreas marinhas protegidas (AMP)?", ["Áreas para construção", "Zonas protegidas para conservar biodiversidade marinha", "Locais para despejo industrial", "Áreas de pesca intensiva", "Zonas de turismo náutico apenas"], 1],
  ["Qual animal é frequentemente afetado por emaranhamento em redes e plásticos?", ["Pinguins", "Golfinhos", "Tartarugas marinhas", "Caranguejos terrestres", "Siri"], 2],
  ["O que é pesca sustentável?", ["Pescar até esgotar o estoque", "Utilizar métodos que preservam populações e habitats", "Usar redes de arrasto em todos os locais", "Pesca ilegal sem registro", "Aumentar captura de juvenis"], 1],
  ["Como o escoamento agrícola afeta o oceano?", ["Aumenta a biodiversidade", "Causa eutrofização e zonas mortas", "Diminui a salinidade permanentemente", "Aumenta a produção pesqueira sempre", "Purifica a água"], 1],
  ["O que é acidificação dos oceanos?", ["Aumento do pH por substâncias básicas", "Queda no pH causada pelo CO2 dissolvido", "Aumento da alcalinidade", "Maior transparência da água", "Mais oxigênio dissolvido"], 1],
  ["Como podemos ajudar as tartarugas marinhas?", ["Ignorar luzes nas praias durante desova", "Plantar árvores na praia que atrapalhem ninhos", "Construir estruturas na areia", "Usar mais palhinhas", "Soltar fogos na praia"], 0],
  ["Qual é um efeito da perda de habitats marinhos como manguezais e pradarias marinhas?", ["Maior proteção costeira", "Redução de estoques pesqueiros e perda de proteção costeira", "Aumento de reprodução de peixes", "Melhoria na qualidade da água", "Menos erosão"], 1],
  ["O que significa 'bycatch' (captura acessória)?", ["Captura de peixes-alvo apenas", "Captura acidental de espécies não desejadas", "Um tipo de rede seletiva", "Técnica de aquicultura", "Reabastecimento de estoques"], 1],
  ["Qual atitude reduz diretamente a poluição por óleo?", ["Despejar óleo usado no mar", "Manter manutenção adequada de embarcações e destinar óleo usado corretamente", "Usar mais combustíveis fósseis", "Aumentar descarga industrial sem tratamento", "Queimar óleo na praia"], 1],
  ["Por que a biodiversidade marinha é importante?", ["Não tem importância", "Mantém serviços ecossistêmicos como pesca e turismo", "Só é relevante para aquários", "Impede a navegação", "Diminui qualidade de vida"], 1],
  ["O que é microplástico?", ["Plástico grande flutuante", "Fragmentos pequenos de plástico menores que 5 mm", "Tipo de alga", "Pedra marinha", "Saco biodegradável"], 1],
  ["Como a pesca ilegal afeta os oceanos?", ["Aumenta recursos de forma sustentável", "Piora o manejo e reduz estoques" ,"Melhora a fiscalização", "Não tem impacto", "Apenas beneficia comunidades"], 1],
  ["Qual prática do turismo pode ajudar a conservar o oceano?", ["Pisar em recifes para fotos", "Respeitar regras e não tocar corais", "Alimentar peixes com comida humana", "Deixar lixo na praia", "Ignorar sinalizações"], 1],
  ["O que são zonas mortas marinhas?", ["Áreas com excesso de oxigênio", "Regiões com baixo oxigênio onde vida é escassa", "Áreas protegidas", "Águas muito frias", "Lagos de água doce"], 1],
  ["Como a energia renovável offshore pode impactar o oceano positivamente?", ["Sempre destrói habitats", "Pode reduzir emissões quando bem planejada", "Aumenta poluição plástica", "Substitui a pesca sustentável", "Sempre causa zonas mortas"], 1],
  ["Por que reduzir o consumo de carne pode ajudar os oceanos?", ["Não tem relação", "Reduz impacto agrícola e escoamento que causam poluição" ,"Aumenta a aquicultura", "Causa mais desmatamento marinho", "Acelera a acidificação"], 1],
  ["Qual é um sinal de um recife de coral saudável?", ["Menos peixes e corais branqueados", "Alta diversidade de corais e peixes", "Areia preta dominante", "Muitas algas invasoras", "Baixa transparência da água"], 1],
  ["O que significa 'restauração marinha'?", ["Construir mais portos", "Atividades para recuperar habitats e populações marinhas", "Abrir áreas para pesca intensiva", "Aumentar poluição controlada", "Remover manguezais"], 1],
  ["Como a poluição sonora afeta a vida marinha?", ["Aumenta a capacidade de reprodução", "Interfere em comunicação e navegação de animais marinhos", "Melhora habitats", "Atrai mais peixes", "Não tem efeito"], 1],
  ["Qual material é preferível evitar para diminuir risco à vida marinha?", ["Plástico descartável", "Fibra natural", "Papel reciclado", "Vidro reutilizável", "Alumínio reciclado"], 0],
  ["Por que é importante monitorar estoques pesqueiros?", ["Para permitir pesca descontrolada", "Para garantir que capturas sejam sustentáveis e evitar colapso", "Para aumentar o bycatch", "Para reduzir fiscalização", "Para promover pesca ilegal"], 1],
  ["Qual é uma ação individual eficaz para conservação marinha?", ["Comprar mais produtos de origem duvidosa", "Reduzir plástico, participar de mutirões de limpeza e apoiar políticas", "Despejar resíduos domésticos na praia", "Usar redes de pesca sem permissão", "Ignorar sinais de proteção"], 1],
  ["Qual é um efeito do aquecimento global nos oceanos?", ["Aumento de gelo marinho", "Elevação do nível do mar e maior temperatura", "Diminuição da acidificação", "Menos eventos extremos", "Mais oxigênio dissolvido"], 1]
];

// Estado
const state = { questions: [], current: 0, score: 0 };

// Helper: Fisher-Yates para embaralhar arrays
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Prepara o quiz — garante que perguntas existam antes de renderizar
function prepareQuiz(){
  const bankSize = Array.isArray(QUESTION_BANK) ? QUESTION_BANK.length : 0;
  if(bankSize === 0){
    state.questions = [];
    return;
  }

  // Embaralha os índices das perguntas para selecionar 10 aleatórias
  const idxs = Array.from({length: bankSize}, (_, i) => i);
  shuffle(idxs);
  const selected = idxs.slice(0, Math.min(QUIZ_SIZE, bankSize));

  state.questions = selected.map(i => {
    const q = QUESTION_BANK[i];
    if(!q || !Array.isArray(q) || q.length < 3){
      return { text: 'Pergunta inválida', opts: ['','','','',''], correct: 0, user: null };
    }

    const originalOptions = Array.isArray(q[1]) ? q[1].slice(0,5) : ['', '', '', '', ''];
    const originalCorrectIdx = typeof q[2] === 'number' ? q[2] : 0;

    // Cria um array de objetos para embaralhar, mantendo o link com o índice original
    const optionsWithOriginalIndex = originalOptions.map((text, idx) => ({ text, originalIdx: idx }));
    
    // Embaralha as opções
    shuffle(optionsWithOriginalIndex);

    // Encontra o novo índice da resposta correta após o embaralhamento
    let newCorrectIdx = -1;
    const shuffledOptsText = optionsWithOriginalIndex.map((opt, idx) => {
      if (opt.originalIdx === originalCorrectIdx) {
        newCorrectIdx = idx;
      }
      return opt.text;
    });

    return { 
      text: String(q[0]||'Pergunta vazia'), 
      opts: shuffledOptsText, 
      correct: newCorrectIdx, 
      user: null 
    };
  });

  state.current = 0;
  state.score = 0;
  // update UI totals
  document.getElementById('total').textContent = state.questions.length.toString();
}

// Renderiza pergunta atual
function renderQuestion(index = state.current){
  const questionEl = document.getElementById('question');
  const optsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');

  if(!state.questions || state.questions.length === 0){
    questionEl.textContent = 'Nenhuma pergunta disponível.';
    optsEl.innerHTML = '<div class="meta">Banco de perguntas vazio. Verifique QUESTION_BANK.</div>';
    feedbackEl.style.display = 'none';
    document.getElementById('index').textContent = '0';
    document.getElementById('answered').textContent = '0';
    document.getElementById('score').textContent = '0';
    document.getElementById('bar').style.width = '0%';
    return;
  }

  if(index < 0) index = 0;
  if(index >= state.questions.length) index = state.questions.length - 1;
  state.current = index;

  const q = state.questions[state.current];
  if(!q){
    questionEl.textContent = 'Erro: pergunta indefinida.';
    optsEl.innerHTML = '';
    feedbackEl.style.display = 'none';
    return;
  }

  questionEl.textContent = q.text;
  optsEl.innerHTML = '';
  feedbackEl.style.display = 'none';
  feedbackEl.textContent = '';

  ['A','B','C','D','E'].forEach((label, idx) => {
    const div = document.createElement('div');
    div.className = 'option' + (q.user === idx ? ' selected' : '');
    div.setAttribute('data-idx', idx);
    div.innerHTML = `<div class="label">${label}</div><div style="flex:1">${q.opts[idx] || ''}</div>`;

    div.addEventListener('click', () => {
      // se já respondeu esta pergunta, não permitir alteração
      if(q.user !== null) return;
      q.user = idx;
      // mostrar feedback imediato
      const correctIdx = q.correct;
      if(idx === correctIdx){
        // acerto
        state.score += 1;
        feedbackEl.innerHTML = `<div class="correct-text">Correto! ✔</div>`;
      } else {
        // erro
        feedbackEl.innerHTML = `<div class="feedback">Errado ❌ — resposta correta: <strong>${['A','B','C','D','E'][correctIdx]}</strong> — ${q.opts[correctIdx]}</div>`;
      }

      // destacar alternativas: aplica classes
      const optionNodes = optsEl.querySelectorAll('.option');
      optionNodes.forEach(node => {
        const nodeIdx = Number(node.getAttribute('data-idx'));
        node.classList.remove('selected','correct','wrong');
        if(nodeIdx === correctIdx) node.classList.add('correct');
        if(nodeIdx === idx && idx !== correctIdx) node.classList.add('wrong');
      });

      // atualizar contadores e lista
      updateScorePreview();
      renderQList();

      // exibir feedback
      feedbackEl.style.display = 'block';
    });

    optsEl.appendChild(div);
  });

  // atualizar elementos de navegação/progresso
  document.getElementById('index').textContent = (state.current + 1).toString();
  updateProgress();
}

function updateProgress(){
  const total = state.questions && state.questions.length ? state.questions.length : 1;
  const percent = ((state.current + 1) / total) * 100;
  document.getElementById('bar').style.width = percent + '%';
}

function renderQList(){
  const list = document.getElementById('qList'); list.innerHTML = '';
  if(!state.questions || state.questions.length === 0){
    const empty = document.createElement('div'); empty.className = 'meta'; empty.textContent = 'Nenhuma pergunta para navegar.'; list.appendChild(empty); return;
  }
  state.questions.forEach((q, idx) => {
    const b = document.createElement('div');
    b.className = 'q-pill' + (q.user !== null ? ' answered' : '');
    b.textContent = (idx + 1).toString();
    b.title = q.user !== null ? 'Respondida' : 'Não respondida';
    b.addEventListener('click', () => { state.current = idx; renderQuestion(idx); });
    list.appendChild(b);
  });
  document.getElementById('answered').textContent = state.questions.reduce((acc,q)=> acc + (q.user !== null ? 1 : 0), 0).toString();
  document.getElementById('score').textContent = state.score.toString();
}

function updateScorePreview(){
  document.getElementById('answered').textContent = state.questions.reduce((acc,q)=> acc + (q.user !== null ? 1 : 0), 0).toString();
  document.getElementById('score').textContent = state.score.toString();
}

// controles
document.getElementById('prev').addEventListener('click', ()=>{
  if(!state.questions || state.questions.length === 0) return;
  if(state.current > 0){ state.current--; renderQuestion(state.current); }
});
document.getElementById('next').addEventListener('click', ()=>{
  if(!state.questions || state.questions.length === 0) return;
  if(state.current < state.questions.length - 1){ state.current++; renderQuestion(state.current); }
});

document.getElementById('restart').addEventListener('click', ()=>{
  if(!confirm('Reiniciar o quiz com nova seleção de perguntas?')) return;
  start();
});

// iniciar
function start(){
  // reset UI
  document.getElementById('after').style.display = 'none';
  document.getElementById('after').innerHTML = '';
  document.getElementById('feedback').style.display = 'none';
  document.getElementById('feedback').innerHTML = '';

  prepareQuiz();
  renderQList();
  renderQuestion(0);
  updateScorePreview();
}

// Start immediately when script loads
start();