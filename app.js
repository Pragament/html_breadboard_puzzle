'use strict';
const $ = id => document.getElementById(id);
let allQuestions = [], questions = [], results = [], index = 0, revealed = false, completed = false, audioContext, selectedQuestion = null, totalResult = false;
const ns = 'http://www.w3.org/2000/svg';
function svgElement(tag, attrs, text) {
  const element = document.createElementNS(ns, tag);
  Object.entries(attrs).forEach(([key,value]) => element.setAttribute(key,value));
  if (text !== undefined) element.textContent = text;
  $('board').append(element);
  return element;
}
function start() {
  questions = allQuestions.filter(q => q.classLevel === Number($('class-select').value));
  results = questions.map(() => ({ answered:false, revealed:false, correct:false }));
  index = 0; selectedQuestion = null; totalResult = false;
  $('led').className = 'led'; $('test-status').textContent = 'Select a question';
  renderQuestion(); renderBoard(); renderList();
}
function renderQuestion() {
  revealed = false; completed = false;
  $('feedback').textContent = ''; $('explanation').hidden = true; $('next').hidden = true;
  $('answer-form').reset(); $('answer-form').hidden = false; $('submit').disabled = false;
  $('column').disabled = false; $('row').disabled = false; $('reveal').hidden = false;
  if (index >= questions.length) {
    $('progress').textContent = `${questions.length} / ${questions.length}`;
    $('quiz-title').textContent = 'Circuit complete!'; $('topic').textContent = 'Practice finished';
    $('puzzles').textContent = `You made ${results.filter(r=>r.correct).length} correct connections out of ${questions.length}. Test each connection below, or restart to try again.`;
    $('answer-form').hidden = true; $('reveal').hidden = true; return;
  }
  const q = questions[index];
  $('progress').textContent = `${index+1} / ${questions.length}`;
  $('quiz-title').textContent = `Connection ${index+1}`; $('topic').textContent = q.topic;
  $('puzzles').replaceChildren();
  for (const [axis,label] of [['column','COLUMN PUZZLE · X'],['row','ROW PUZZLE · Y']]) {
    const div=document.createElement('div'); div.className='puzzle';
    const strong=document.createElement('strong'); strong.textContent=label;
    div.append(strong,document.createTextNode(q[axis].prompt)); $('puzzles').append(div);
  }
}
function showExplanation() {
  const q = questions[index]; $('explanation').replaceChildren();
  for (const [axis,label] of [['column','Column'],['row','Row']]) {
    const p = document.createElement('p'); p.textContent=`${label}: ${q[axis].answer}. ${q[axis].explanation}`; $('explanation').append(p);
  }
  $('explanation').hidden=false;
}
$('reveal').addEventListener('click',()=> {
  if (completed || index >= questions.length) return;
  revealed=true; results[index].revealed=true; showExplanation();
  $('feedback').textContent='Answer revealed. Enter both coordinates to connect and continue. This connection will fail continuity.';
  $('reveal').hidden=true; renderBoard(); renderList();
});
$('answer-form').addEventListener('submit',event=> {
  event.preventDefault(); if(completed || index>=questions.length) return;
  const q=questions[index];
  const x=Number($('column').value), y=Number($('row').value);
  if(!Number.isFinite(x)||!Number.isFinite(y)) return;
  if(x!==q.column.answer || y!==q.row.answer) {
    $('feedback').textContent='Those coordinates don’t connect yet. Check both calculations and try again.'; return;
  }
  completed=true; results[index]={answered:true,revealed,correct:!revealed};
  $('feedback').textContent=revealed ? 'Connection plotted using the revealed answer. Continuity will fail.' : 'Correct! Your new connection is ready for a continuity test.';
  $('column').disabled=true; $('row').disabled=true; $('submit').disabled=true; $('reveal').hidden=true;
  showExplanation(); $('next').hidden=false; $('next').textContent=index===questions.length-1 ? 'See results →' : 'Next question →';
  renderBoard(); renderList();
});
$('next').addEventListener('click',()=>{index++;renderQuestion();if(index>=questions.length)showTotalResult();});
$('total-result').addEventListener('click',showTotalResult);
function showTotalResult() {
  if(!results.every(r=>r.answered))return;
  totalResult=true; selectedQuestion=null; renderBoard(); renderList();
  const pass=results.every(r=>r.correct);
  $('led').className=`led ${pass?'pass':'fail'}`;
  $('test-status').textContent=`Total result: ${pass?'PASS · complete circuit':'FAIL · circuit has broken wires'}`;
  $('board').closest('.board-card').scrollIntoView({block:'nearest',behavior:'instant'});
  buzz(pass);
}
$('class-select').addEventListener('change',start); $('restart').addEventListener('click',start);
$('gap').addEventListener('input',()=>{$('gap-value').textContent=`${$('gap').value} px`;renderBoard();});
// Split an orthogonal wire around its midpoint, leaving a real visible gap.
function wireGeometry(points, broken) {
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
  const total=lengths.reduce((a,b)=>a+b,0);
  const at=distance=> {
    let remaining=distance;
    for(let i=0;i<lengths.length;i++) {
      if(lengths[i]>0 && remaining<=lengths[i]) {
        const ratio=remaining/lengths[i];
        return points[i].map((v,j)=>v+(points[i+1][j]-v)*ratio);
      }
      remaining-=lengths[i];
    }
    return points[points.length-1];
  };
  const slice=(start,end)=> {
    const vertices=[at(start)]; let distance=0;
    lengths.forEach((length,i)=>{distance+=length;if(distance>start && distance<end)vertices.push(points[i+1]);});
    vertices.push(at(end));
    return vertices.map((p,i)=>`${i?'L':'M'} ${p[0]} ${p[1]}`).join(' ');
  };
  const halfGap=Math.min(12,total/3),middle=total/2;
  return {path:broken?`${slice(0,middle-halfGap)} ${slice(middle+halfGap,total)}`:slice(0,total),beforeBreak:slice(0,middle-halfGap),breakPoint:at(middle)};
}
function renderBoard() {
  const gap=Number($('gap').value), pad=40;
  const xs=questions.map(q=>q.column.answer), ys=questions.map(q=>q.row.answer);
  const xmin=Math.min(-10,...xs), xmax=Math.max(10,...xs), ymin=Math.min(-10,...ys), ymax=Math.max(10,...ys);
  const width=(xmax-xmin)*gap+2*pad,height=(ymax-ymin)*gap+2*pad;
  const px=x=>pad+(x-xmin)*gap, py=y=>pad+(ymax-y)*gap;
  $('board').replaceChildren(); $('board').setAttribute('width',width); $('board').setAttribute('height',height); $('board').setAttribute('viewBox',`0 0 ${width} ${height}`);
  for(let x=xmin;x<=xmax;x++) svgElement('line',{x1:px(x),x2:px(x),y1:pad,y2:height-pad,stroke:'#dce4d3','stroke-width':1});
  for(let y=ymin;y<=ymax;y++) svgElement('line',{x1:pad,x2:width-pad,y1:py(y),y2:py(y),stroke:'#dce4d3','stroke-width':1});
  svgElement('line',{x1:pad-15,x2:width-pad+15,y1:py(0),y2:py(0),stroke:'#809476','stroke-width':2});
  svgElement('line',{x1:px(0),x2:px(0),y1:pad-15,y2:height-pad+15,stroke:'#809476','stroke-width':2});
  for(let x=xmin;x<=xmax;x++)for(let y=ymin;y<=ymax;y++)svgElement('circle',{cx:px(x),cy:py(y),r:2.8,fill:'#a7b49a'});
  for(let x=xmin;x<=xmax;x++)svgElement('text',{x:px(x),y:py(0)+15,fill:'#5e7157','font-size':10,'text-anchor':'middle'},x);
  for(let y=ymin;y<=ymax;y++)if(y!==0)svgElement('text',{x:px(0)-9,y:py(y)+3,fill:'#5e7157','font-size':10,'text-anchor':'end'},y);
  svgElement('text',{x:width-15,y:py(0)-8,fill:'#436b40','font-size':12},'x'); svgElement('text',{x:px(0)+10,y:20,fill:'#436b40','font-size':12},'y');
  let previous={x:0,y:0}, flowing=true, firstBreak=null;
  results.forEach((r,i)=> {
    const inTest=i===selectedQuestion;
    if(!r.answered && !r.revealed) {
      if(inTest && firstBreak===null) { firstBreak=i; flowing=false; }
      return;
    }
    const q=questions[i], x=q.column.answer,y=q.row.answer,color=r.correct?'#216c50':'#be663d';
    const points=[[px(previous.x),py(previous.y)],[px(x),py(previous.y)],[px(x),py(y)]];
    const wire=wireGeometry(points,r.revealed);
    svgElement('path',{d:wire.path,fill:'none',stroke:color,'stroke-width':3.5,'stroke-linejoin':'round',opacity:selectedQuestion===null&&!totalResult?.8:.3,'data-wire':i});
    if(inTest) {
      svgElement('path',{d:r.revealed?wire.beforeBreak:wire.path,fill:'none',stroke:'#f0b429','stroke-width':5,'stroke-linejoin':'round',class:'current-flow','data-flow':i});
    }
    if(totalResult) {
      if(r.revealed)flowing=false;
      svgElement('path',{d:wire.path,fill:'none',stroke:flowing?'#f0b429':'#d85e42','stroke-width':5,'stroke-linejoin':'round',class:'result-trace',pathLength:1,style:`animation-delay:${i*.8}s`,'data-result-trace':i});
      if(r.revealed && firstBreak===null)firstBreak=i;
    }
    if(r.revealed) {
      if(inTest && firstBreak===null) {firstBreak=i; flowing=false;}
      svgElement('circle',{cx:wire.breakPoint[0],cy:wire.breakPoint[1],r:9,fill:'#fffefa',stroke:'#be663d','stroke-width':2,'data-break':i});
      svgElement('text',{x:wire.breakPoint[0],y:wire.breakPoint[1]+4,fill:'#be663d','font-size':13,'text-anchor':'middle'},'×');
    }
    const point=svgElement('circle',{cx:px(x),cy:py(y),r:7,fill:color,stroke:'#fffefa','stroke-width':2});
    const title=document.createElementNS(ns,'title');title.textContent=`Question ${i+1}: (${x}, ${y}) · ${r.correct?'correct':'revealed · broken wire'}`;point.append(title);
    if(i===selectedQuestion)svgElement('circle',{cx:px(x),cy:py(y),r:13,fill:'none',stroke:'#e4a126','stroke-width':3,'data-selected':'true'});
    svgElement('text',{x:px(x)+10,y:py(y)-10,fill:color,'font-size':12,'font-weight':700},`Q${i+1}`);previous={x,y};
  });
  svgElement('circle',{cx:px(0),cy:py(0),r:5,fill:'#344e36',stroke:'#fff','stroke-width':1,'data-origin':'true'});
  $('score').textContent=`${results.filter(r=>r.correct).length} correct`;
  const answered=results.filter(r=>r.answered).length;
  if(totalResult) {
    $('board-status').textContent=`Total quiz result: tracing (0, 0) → Q${questions.length}. ${firstBreak===null?'All connections pass.':`Current breaks before Q${firstBreak+1}; red traces show the remaining disconnected route.`}`;
  } else if(selectedQuestion!==null) {
    const source=selectedQuestion===0?'(0, 0)':`Q${selectedQuestion}`;
    $('board-status').textContent=firstBreak===null?`Current flows from ${source} to Q${selectedQuestion+1}.`:`Testing ${source} → Q${selectedQuestion+1}: ${results[selectedQuestion].revealed?'current stops at the broken wire':'unanswered · open circuit'}.`;
  } else {
    $('board-status').textContent=answered?`${answered} connection${answered===1?'':'s'} plotted. Wires start at (0, 0) and join each solved coordinate in order.`:'Solve your first question to lay a wire.';
  }
}
function buzz(pass) {
  if(!$('sound').checked)return;
  try {
    audioContext ||= new (window.AudioContext||window.webkitAudioContext)(); audioContext.resume();
    const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
    oscillator.type=pass?'sine':'sawtooth';oscillator.frequency.value=pass?880:160;
    gain.gain.setValueAtTime(.09,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.3);
    oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+.32);
  } catch { /* Visual tester remains available when audio is unsupported. */ }
}
function renderList() {
  $('total-result').disabled=!results.length || !results.every(r=>r.answered);
  if(selectedQuestion!==null) {
    const selected=results[selectedQuestion],pass=selected.correct&&!selected.revealed;
    $('led').className=`led ${pass?'pass':'fail'}`;
    $('test-status').textContent=pass?`Q${selectedQuestion+1}: PASS · continuity`:`Q${selectedQuestion+1}: FAIL · ${selected.revealed?'answer revealed':'not answered'}`;
  }
  $('question-list').replaceChildren();
  questions.forEach((q,i)=> {
    const r=results[i],button=document.createElement('button');button.className=`question-test${i===selectedQuestion?' selected':''}`;button.setAttribute('aria-pressed',i===selectedQuestion);
    button.textContent=`Q${i+1} · ${q.topic}`;
    const small=document.createElement('small');small.textContent=r.revealed?'Answer revealed · continuity fails':r.correct?'Correct · ready to test':'Unanswered · open circuit';button.append(small);
    button.addEventListener('click',()=> {
      selectedQuestion=i; totalResult=false; renderBoard(); renderList();
      const target=Array.from($('board').querySelectorAll('[data-break]')).find(node=>Number(node.getAttribute('data-break'))===i) || $('board').querySelector('[data-selected]') || $('board').querySelector('[data-origin]');
      if(target) {
        const scroll=$('board').parentElement;
        scroll.scrollLeft=Number(target.getAttribute('cx'))-scroll.clientWidth/2;
        scroll.scrollTop=Number(target.getAttribute('cy'))-scroll.clientHeight/2;
      }
      $('board').closest('.board-card').scrollIntoView({block:'nearest',behavior:'instant'});
      buzz(r.correct&&!r.revealed);
    }); $('question-list').append(button);
  });
}
async function init() {
  try {
    const response=await fetch('data/questions.json');if(!response.ok)throw new Error('Question file could not be loaded');
    allQuestions=await response.json();
    for(let level=4;level<=10;level++){const option=document.createElement('option');option.value=level;option.textContent=`Class ${level}`;$('class-select').append(option);}
    start();
  } catch(error) {$('quiz-title').textContent='Unable to load questions';$('feedback').textContent='Please serve this folder over HTTP (or GitHub Pages) and reload.';$('answer-form').hidden=true;$('reveal').hidden=true;console.error(error);}
}
init();
