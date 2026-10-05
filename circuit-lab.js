'use strict';
(() => {
  const root=document.getElementById('circuit-lab');
  root.innerHTML=`
    <div class="lab-heading"><p class="eyebrow">INSIDE THE TESTER</p><h3>Follow the energy. Explore the components.</h3><p class="muted">An interactive teaching model: four batteries power two RGB LEDs and a buzzer through a switch. Electron motion is slowed down for visibility.</p></div>
    <div class="lab-controls">
      <label><input id="lab-power" type="checkbox" checked> SPST power switch</label>
      <label>Battery wiring <select id="lab-pack"><option value="2s2p">2 series × 2 parallel (4 cells)</option><option value="4s">4 in series</option><option value="4p">4 in parallel</option></select></label>
      <label>Circuit <select id="lab-circuit"><option value="demo">Explore: closed path</option><option value="break">Explore: broken path</option><option value="test">Selected quiz test</option></select></label>
      <label>Animate <select id="lab-direction"><option value="electron">Electrons: − → +</option><option value="conventional">Conventional current: + → −</option></select></label>
    </div>
    <div class="lab-schematic"><svg id="lab-svg" viewBox="0 0 1000 570" role="img" aria-label="Four-cell battery supply, switch, 3.3 volt converter, common cathode and common anode RGB LEDs with one resistor per color, and active buzzer"></svg></div>
    <p id="lab-status" class="lab-status" role="status"></p>
    <div class="lab-instruments">
      <fieldset><legend>Common cathode · HIGH = ON</legend><p>Common → GND (−)</p><div class="color-controls" id="cc-controls"></div><output id="cc-reading"></output></fieldset>
      <fieldset><legend>Common anode · LOW = ON</legend><p>Common → VCC (+3.3 V)</p><div class="color-controls" id="ca-controls"></div><output id="ca-reading"></output></fieldset>
      <fieldset><legend>Current-limiting resistors</legend><label>Each color resistor <input id="lab-resistance" type="range" min="100" max="1000" step="10" value="220"><output id="lab-ohms">220 Ω</output></label><p id="lab-current"></p><p>One resistor per color pin, six in total. Higher Ω → less current → dimmer light.</p></fieldset>
      <fieldset><legend>Buzzer experiment</legend><label>Type <select id="lab-buzzer"><option value="active">Active · oscillator inside</option><option value="passive">Passive piezo · external signal</option></select></label><label>Input <select id="lab-drive"><option value="dc">Constant DC</option><option value="pwm">Repeating waveform</option></select></label><label>Waveform frequency <select id="lab-frequency"><option value="500">500 Hz</option><option value="1000" selected>1,000 Hz</option><option value="2000">2,000 Hz</option></select></label><label><input id="lab-audio" type="checkbox"> Hear demonstration</label><svg id="lab-waveform" viewBox="0 0 320 75" role="img" aria-label="Electrical drive waveform"></svg><p id="lab-buzzer-note"></p><p id="lab-buzzer-chain"></p></fieldset>
    </div>
    <div class="lab-lessons">
      <details open><summary>Four batteries: series vs parallel</summary><p>Each model cell is 1.5 V, 2,000 mAh. The default pack has two series strings connected in parallel: B1 + B2 and B3 + B4. Within each string, + connects to the next −. Across strings, + joins + and − joins −.</p><div class="table-scroll"><table><thead><tr><th>Wiring</th><th>Voltage</th><th>Capacity</th><th>Current difference</th></tr></thead><tbody><tr><td>2 series × 2 parallel</td><td>3 V</td><td>4,000 mAh</td><td>Two matched strings share load current.</td></tr><tr><td>4 series</td><td>6 V</td><td>2,000 mAh</td><td>Same current through every cell; voltage adds.</td></tr><tr><td>4 parallel</td><td>1.5 V</td><td>8,000 mAh</td><td>Cells share load current; voltage stays the same.</td></tr></tbody></table></div><p id="pack-reading"></p><p>Series adds voltage, not amp-hour capacity. Parallel adds capacity and can increase available current capability; it does not force extra current into a load. At a fixed resistance, I = V/R. With matched parallel branches, each supplies a share of the load. The ideal DC–DC converter here supplies 3.3 V to the LEDs; actual battery current also depends on converter efficiency and load power.</p><p class="muted">This idealized model uses identical cells and omits cell imbalance, internal resistance and protection circuits. It is a learning diagram, not a battery assembly guide.</p></details>
      <details open><summary>Electrons, VCC / GND and LED polarity</summary><p>Red wires carry VCC (+3.3 V); black wires carry GND (the 0 V reference). In an external metal wire, electrons drift from the battery's negative terminal toward its positive terminal. Conventional current points the opposite way. The animation changes direction when you choose a different convention.</p><p><strong>Battery during discharge:</strong> negative electrode (−) = anode; positive electrode (+) = cathode. <strong>Forward-lit LED:</strong> anode is at a higher potential (+), cathode at a lower potential (−). These names describe different devices and must not be swapped on an LED.</p><p>An RGB LED contains three semiconductor LEDs. The common cathode joins all three cathodes: connect Common to GND and drive a color pin HIGH. The common anode joins all three anodes: connect Common to 3.3 V and pull a color pin LOW. Each color branch needs its own resistor.</p><p>Electrical energy becomes mainly light and heat in the LED. Charge keeps circulating; electrons are not consumed. Semiconductor conduction involves both electrons and holes, so the moving dots illustrate wire electron drift rather than the microscopic motion inside an LED.</p></details>
      <details><summary>Why resistors limit current and get warm</summary><p>Voltage pushes current; resistance limits current. For each LED branch, approximate current is I = (3.3 V − LED forward voltage)/R. Moving the resistance slider changes modeled current and brightness. Forward voltages here are illustrative: red 1.8 V, green 2.2 V and blue 2.8 V.</p><p>Think of a narrow section of a water pipe, or a crowded hallway: movement is harder. A resistor does not use up electrons. It impedes their organized motion and transfers electrical energy to the material as heat. Without a suitable resistor, an LED may draw excessive current, overheat and fail.</p><p>For a uniform material, R = ρL/A. A longer path, smaller conducting cross-section or higher-resistivity material gives greater resistance. Some resistor designs use a spiral cut in a resistive film to lengthen the path. Heat power is P = I²R; enough power makes the resistor warm.</p></details>
      <details><summary>Six kinds of switches</summary><p>A switch controls the current path. Poles count separate circuits; throws count selectable paths. Some switches latch, while push buttons return when released.</p><div class="table-scroll"><table><thead><tr><th>Type</th><th>Meaning</th><th>Action</th><th>Example</th></tr></thead><tbody><tr><td>SPST</td><td>Single pole, single throw</td><td>One circuit ON / OFF</td><td>Power or light switch</td></tr><tr><td>SPDT</td><td>Single pole, double throw</td><td>One input selects either output</td><td>Select LED A or B</td></tr><tr><td>DPST</td><td>Double pole, single throw</td><td>Two circuits ON / OFF together</td><td>Disconnect + and − together</td></tr><tr><td>DPDT</td><td>Double pole, double throw</td><td>Two circuits each select two paths</td><td>Reverse a DC motor</td></tr><tr><td>Push button (NO)</td><td>Normally open</td><td>OFF at rest; ON while pressed</td><td>Doorbell</td></tr><tr><td>Push button (NC)</td><td>Normally closed</td><td>ON at rest; OFF while pressed</td><td>Stop / interlock circuit</td></tr></tbody></table></div><p>The power switch above is SPST. Turning it off opens the supply path and stops this model's light, sound and flow.</p></details>
      <details><summary>Active vs passive buzzer</summary><p>Both convert electrical energy into sound. An active buzzer contains a tone-generating oscillator, a driver and a sound-producing element (often piezoelectric). DC power → oscillator → driver → vibrating element → continuous beep. A passive piezo buzzer needs an external repeating signal.</p><div class="table-scroll"><table><thead><tr><th>Feature</th><th>Active</th><th>Passive piezo</th></tr></thead><tbody><tr><td>Internal oscillator</td><td>Yes</td><td>No</td></tr><tr><td>Constant DC</td><td>Continuous sound</td><td>Usually a connection / disconnection click</td></tr><tr><td>ESP32 control</td><td>ON / OFF through a suitable driver</td><td>Waveform / PWM through a suitable driver</td></tr><tr><td>Pitch control</td><td>Usually fixed</td><td>Set by waveform frequency</td></tr><tr><td>Melodies</td><td>Usually not</td><td>Yes, within operating range</td></tr><tr><td>Teaching use</td><td>Simple alarm</td><td>Frequency, pitch, waves and music</td></tr></tbody></table></div><p>Active: + → rated supply, − → GND; this model assumes a 3.3 V compatible device. Passive: HIGH / LOW / HIGH / LOW repeatedly bends the element. 500 Hz sounds lower than 1,000 Hz; 2,000 Hz sounds higher. Audible demonstrations synthesize the effect in your browser; they do not reproduce a particular component.</p></details>
      <details><summary>Inside a piezo disc: voltage → motion → sound</summary><div class="piezo-demo" aria-label="Animated piezo ceramic bonded to a metal disc"><div class="piezo-disc"><span>Piezo ceramic</span><span>Metal disc</span></div><div class="air-waves">)))</div></div><p>A piezo ceramic layer is bonded to a thin metal disc. The inverse piezoelectric effect means applied voltage changes the ceramic's dimensions very slightly. Since the bonded layers deform differently, the disc bends. An alternating electrical drive repeatedly changes that deformation, so the disc vibrates and pushes and pulls nearby air.</p><p>Electrical waveform → ceramic deformation → disc bending → vibration → compressions and rarefactions in the air → sound at your ear. The housing helps couple vibration to air, and driving near resonance can produce more sound, like pushing a swing at the right rhythm.</p><p>Constant DC makes a passive disc deform once and remain there. A changing signal keeps it moving. The slow drawing is illustrative; actual vibration can occur thousands of times per second.</p></details>
    </div>
    <section class="lab-faq" aria-labelledby="faq-title">
      <p class="eyebrow">ASK YOUR TEACHER</p><h3 id="faq-title">Questions you might ask next</h3>
      <p class="muted">Tap a student's question to read the teacher's answer. Try the suggested experiment in the model above.</p>
      <details><summary>Student: Why do four batteries give only 3 V here?</summary><p><strong>Teacher:</strong> Each cell is 1.5 V. Two cells in series give 3 V. The second identical series pair is connected in parallel with the first, so voltage stays 3 V while capacity doubles to 4,000 mAh. Four cells in one series string would give 6 V.</p><p class="faq-try">Try it: change Battery wiring between the three arrangements and compare voltage and capacity.</p></details>
      <details><summary>Student: Does parallel wiring automatically double the current?</summary><p><strong>Teacher:</strong> No. The load determines the current it draws. Parallel branches can share that current and provide more capacity. For the same voltage and resistance, I = V/R stays the same. In this ideal model, two matched parallel strings each supply half the load current.</p></details>
      <details><summary>Student: Is 4,000 mAh the same as 4,000 mA?</summary><p><strong>Teacher:</strong> No. Milliamps (mA) measure current now. Milliamp-hours (mAh) measure charge capacity over time. Ideally, 4,000 mAh could supply 400 mA for 10 hours. Real runtime depends on the cells, load, temperature and converter losses.</p></details>
      <details><summary>Student: Where does the 3.3 V come from if the pack is 3 V?</summary><p><strong>Teacher:</strong> The DC–DC converter changes the pack voltage to a regulated 3.3 V supply. It can raise or lower voltage in this model. It does not create energy: raising voltage requires more input current for the same output power, and real converters also lose some energy as heat.</p></details>
      <details><summary>Student: Why is the battery's negative terminal an anode, but the LED's anode positive?</summary><p><strong>Teacher:</strong> The names apply to different processes. In a discharging battery, the negative electrode is the anode and the positive electrode is the cathode. In a forward-lit LED, the anode is at a higher voltage than the cathode. Use the LED's own polarity labels when connecting it; do not copy the battery's electrode names onto the LED.</p></details>
      <details><summary>Student: Do electrons and current really move in opposite directions?</summary><p><strong>Teacher:</strong> In metal wires, electrons drift from the negative terminal toward the positive terminal. Conventional current is defined in the direction a positive charge would move, so its arrow points the other way. Both descriptions refer to the same circuit. Inside semiconductors, electrons and holes both participate.</p><p class="faq-try">Try it: change Animate from Electrons to Conventional current and watch the dots reverse.</p></details>
      <details><summary>Student: Does GND mean there is no electricity there?</summary><p><strong>Teacher:</strong> No. GND is our chosen 0 V reference, and the return wire can carry current. A voltage tells us the difference between two points. Here, VCC is 3.3 V above GND. GND in a battery circuit is not necessarily connected to the Earth.</p></details>
      <details><summary>Student: Does the LED or resistor use up electrons?</summary><p><strong>Teacher:</strong> No. Charge keeps moving around a closed circuit. The battery supplies energy, the LED transfers some of it into light and heat, and the resistor transfers energy into heat. Energy is transferred; electrons are not consumed.</p></details>
      <details><summary>Student: Why does one RGB LED turn on with HIGH and the other with LOW?</summary><p><strong>Teacher:</strong> A common cathode is already connected to GND, so driving a color pin HIGH creates a voltage across that color LED. A common anode is already connected to VCC, so pulling a color pin LOW creates the voltage across it. HIGH and LOW describe the color pin's voltage, not a universal ON or OFF instruction.</p><p class="faq-try">Try it: select the same color on both LEDs and compare the HIGH / LOW readings.</p></details>
      <details><summary>Student: Why are there six resistors instead of just one?</summary><p><strong>Teacher:</strong> Each RGB package contains three color LEDs, and each color needs its own current control. Two packages therefore need six resistors. One shared resistor makes the colors affect each other's current, especially when multiple colors are on. Different colors also have different forward voltages.</p></details>
      <details><summary>Student: Why does a bigger resistor make the LED dimmer?</summary><p><strong>Teacher:</strong> With the same supply and LED, increasing resistance reduces current: I ≈ (VCC − LED forward voltage)/R. Less current generally means less light. The model shows estimated current; an actual LED's brightness also depends on its design.</p><p class="faq-try">Try it: move the resistance slider from 220 Ω toward 1,000 Ω. Watch the current reading and brightness decrease.</p></details>
      <details><summary>Student: Why can a resistor get warm if it does not consume electrons?</summary><p><strong>Teacher:</strong> Moving charges transfer energy to the resistive material. That energy becomes heat. The heating power is P = I²R. A longer, thinner path or a material with higher resistivity has more resistance; some film resistors use a spiral path to make the route longer.</p></details>
      <details><summary>Student: What is the difference between a switch and a broken wire?</summary><p><strong>Teacher:</strong> Both can interrupt the current path. A switch gives you a controlled way to open and close that path. The SPST switch here controls one circuit. A normally open push button closes only while pressed; a normally closed one opens while pressed.</p><p class="faq-try">Try it: turn the power switch OFF, then ON. Compare that with Explore: broken path.</p></details>
      <details><summary>Student: Why does the active buzzer beep on DC while the passive one only clicks?</summary><p><strong>Teacher:</strong> The active buzzer has an oscillator inside. Steady DC powers that oscillator, which repeatedly drives its sound element. A passive piezo has no oscillator: DC bends it once, producing at most a brief click. A repeating waveform keeps it vibrating and produces a tone.</p><p class="faq-try">Try it: choose Passive piezo, compare Constant DC with Repeating waveform, and optionally enable Hear demonstration.</p></details>
      <details><summary>Student: Does a higher frequency mean a louder sound?</summary><p><strong>Teacher:</strong> Higher frequency generally means higher pitch, not automatically greater loudness. Loudness depends on drive strength, the device, its housing and resonance. The passive-buzzer demonstration changes frequency while keeping the synthesized signal level the same.</p><p class="faq-try">Try it: compare 500 Hz, 1,000 Hz and 2,000 Hz in passive waveform mode.</p></details>
      <details><summary>Student: How can such a tiny piezo movement make a sound?</summary><p><strong>Teacher:</strong> The bonded ceramic and metal disc bend repeatedly, pushing and pulling nearby air. Your ear detects those pressure changes. The housing and resonance help transfer vibration into sound. The animation is slowed down so you can see a motion that normally happens thousands of times per second.</p></details>
      <details><summary>Student: Why does a later correct question pass even after an earlier broken wire?</summary><p><strong>Teacher:</strong> Clicking a question tests only its incoming wire, from the previous question to that question. A correct answer makes that local connection pass. The total-result animation checks the whole route from the origin, so an earlier revealed answer still breaks the complete circuit. These are two different test scopes.</p></details>
      <details><summary>Student: Does viewing an answer really break a physical wire?</summary><p><strong>Teacher:</strong> No. That is a learning rule in this quiz: a revealed answer is drawn as a broken connection and does not count as correct. In a real circuit, continuity depends on whether there is an electrically conducting path. Restart the quiz to practise again without revealing the answer.</p></details>
    </section>
    <p class="lab-sources">Learn more: <a href="https://data.energizer.com/pdfs/seriesvs.para.pdf" target="_blank" rel="noopener">Energizer: series / parallel</a> · <a href="https://learn.adafruit.com/adafruit-arduino-lesson-3-rgb-leds?view=all" target="_blank" rel="noopener">Adafruit: RGB LEDs</a> · <a href="https://www.murata.com/products/sound/library/basic/circuit" target="_blank" rel="noopener">Murata: piezo drive circuits</a></p>`;
  const el=id=>document.getElementById(id);
  const ns='http://www.w3.org/2000/svg';
  const svg=el('lab-svg');
  let quizPass=false,quizLabel='No quiz connection selected',context,oscillator,gain,lastAudioKey='';
  function add(tag,attrs,text){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;svg.append(n);return n;}
  function line(d,color='#26382f',width=3){return add('path',{d,fill:'none',stroke:color,'stroke-width':width,'stroke-linejoin':'round'});}
  function text(x,y,value,size=13,color='#334c3b'){return add('text',{x,y,fill:color,'font-size':size,'font-family':'system-ui'},value);}
  function box(x,y,w,h,fill='#fffefa'){return add('rect',{x,y,width:w,height:h,rx:9,fill,stroke:'#b9cbb1'});}
  for(const type of ['cc','ca'])for(const color of ['R','G','B']){
    const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.id=`${type}-${color}`;input.checked=color==='R';label.append(input,document.createTextNode(color));el(`${type}-controls`).append(label);
  }
  function stopAudio(){if(oscillator){oscillator.stop();oscillator.disconnect();oscillator=null;}lastAudioKey='';}
  function audio(sounding,kind,drive,freq,allowed){
    if(!allowed || !el('lab-audio').checked){stopAudio();return;}
    const key=`${kind}-${drive}-${freq}-${sounding}`;
    if(key===lastAudioKey)return;
    stopAudio();lastAudioKey=key;
    try{
      context ||= new (window.AudioContext||window.webkitAudioContext)();context.resume();
      if(sounding){oscillator=context.createOscillator();gain=context.createGain();oscillator.type='sine';oscillator.frequency.value=kind==='active'?2200:freq;gain.gain.value=.035;oscillator.connect(gain);gain.connect(context.destination);oscillator.start();}
      else if(kind==='passive'&&drive==='dc'){const click=context.createOscillator(),volume=context.createGain();click.frequency.value=180;volume.gain.setValueAtTime(.04,context.currentTime);volume.gain.exponentialRampToValueAtTime(.001,context.currentTime+.035);click.connect(volume);volume.connect(context.destination);click.start();click.stop(context.currentTime+.04);}
    }catch{el('lab-buzzer-note').textContent+=' Audio unavailable in this browser.';}
  }
  function render(){
    const power=el('lab-power').checked,mode=el('lab-circuit').value;
    const closed=mode==='demo'||(mode==='test'&&quizPass),running=power&&closed;
    const pack=el('lab-pack').value,voltage=pack==='4s'?6:pack==='4p'?1.5:3,capacity=pack==='4s'?2000:pack==='4p'?8000:4000;
    if(el('lab-buzzer').value==='active')el('lab-drive').value='dc';
    const resistance=Number(el('lab-resistance').value),kind=el('lab-buzzer').value,drive=el('lab-drive').value,freq=Number(el('lab-frequency').value);
    const sounding=running&&(kind==='active'||drive==='pwm');
    el('lab-drive').disabled=kind==='active';el('lab-frequency').disabled=kind==='active'||drive==='dc';
    window.circuitLabPowerOff=!power;
    root.classList.toggle('lab-running',running);root.classList.toggle('lab-sounding',sounding);
    el('lab-ohms').textContent=`${resistance} Ω`;
    el('pack-reading').textContent=`Selected pack: ${voltage} V, ${capacity.toLocaleString()} mAh. A separate illustrative 100 Ω load would draw ${(voltage/100*1000).toFixed(0)} mA (${pack==='4s'?'same current in all 4 cells':pack==='4p'?'one quarter from each matched cell':'half from each matched series string'}).`;
    el('lab-status').textContent=!power?'Power OFF: the SPST switch is open. No sustained light, sound or current.':!closed?`Open circuit: ${mode==='test'?quizLabel:'demonstration wire is broken'}. No sustained current through the loads.`:`Power ON · ${voltage} V battery pack → regulated 3.3 V VCC · ${el('lab-direction').value==='electron'?'electron drift − → +':'conventional current + → −'}.`;
    el('lab-current').textContent=`At 3.3 V, estimated red current = (3.3 − 1.8)/${resistance} = ${(1500/resistance).toFixed(1)} mA per ON branch. Resistor heat ≈ ${(2.25/resistance*1000).toFixed(1)} mW.`;
    el('lab-buzzer-note').textContent=!running?'No supply: buzzer silent.':kind==='active'?'DC supply powers the internal oscillator → fixed ~2.2 kHz tone. External waveform gating does not directly set its pitch.':drive==='dc'?'Steady DC: one brief click, then silence; the disc stays deflected.':`External ${freq.toLocaleString()} Hz waveform → repeated bending → tone. Higher frequency means higher pitch.`;
    const waveform=el('lab-waveform');
    const oscillating=running&&(kind==='active'||drive==='pwm');
    const wavePath=oscillating?'M 10 50 H 25 V 20 H 45 V 50 H 65 V 20 H 85 V 50 H 105 V 20 H 125 V 50 H 145 V 20 H 165 V 50 H 185 V 20 H 205 V 50 H 225 V 20 H 245 V 50 H 265 V 20 H 285 V 50 H 310':`M 10 ${running?20:50} H 310`;
    waveform.innerHTML=`<path d="M 10 55 H 310" stroke="#bbcbb2"/><path d="${wavePath}" fill="none" stroke="#216c50" stroke-width="3"/><text x="10" y="72" font-size="10" fill="#607b52">${!running?'No drive':kind==='active'?'Internal oscillator ~2.2 kHz':drive==='dc'?'Steady DC · no repeated vibration':`External ${freq} Hz waveform`} · time →</text>`;
    el('lab-buzzer-chain').textContent=kind==='active'?'DC → internal oscillator → driver → piezo → air-pressure waves':'External signal → driver → piezo → air-pressure waves';
    svg.replaceChildren();box(5,5,990,560,'#f0f3e8');
    text(25,30,`FOUR-CELL SUPPLY · ${voltage} V · ${capacity.toLocaleString()} mAh`,15);
    function cell(x,y,n){box(x,y,64,42,'#e4e9c9');text(x+4,y+26,'−',16);text(x+50,y+26,'+',16);text(x+19,y+16,`B${n}`,12);text(x+16,y+34,'1.5 V',9);}
    if(pack==='2s2p'){
      [70,140].forEach((y,i)=>{cell(55,y,i*2+1);cell(160,y,i*2+2);line(`M 119 ${y+21} H 160`);line(`M 55 ${y+21} H 30`,'#263238');line(`M 224 ${y+21} H 255`,'#d44d46');});
      line('M 30 91 V 500 H 945','#263238');line('M 255 91 V 161 M 255 91 H 320','#d44d46');text(45,205,'2 series cells per string',12);text(45,224,'2 strings in parallel',12);
    }else if(pack==='4s'){
      for(let i=0;i<4;i++){cell(35+i*68,90,i+1);if(i<3)line(`M ${99+i*68} 111 H ${103+i*68}`);}
      line('M 35 111 H 20 V 500 H 945','#263238');line('M 303 111 H 320 V 91','#d44d46');text(45,205,'4 cells in one series string',12);
    }else{
      for(let i=0;i<4;i++){cell(100,60+i*55,i+1);line(`M 100 ${81+i*55} H 35`,'#263238');line(`M 164 ${81+i*55} H 255`,'#d44d46');}
      line('M 35 81 V 500 H 945','#263238');line('M 255 81 V 246 M 255 91 H 320','#d44d46');text(45,315,'4 parallel cells',12);
    }
    text(25,480,'− GND / battery negative',12);text(240,60,'+ battery positive',12,'#b93d35');
    line('M 320 91 H 335','#d44d46');add('circle',{cx:335,cy:91,r:4,fill:'#d44d46'});add('circle',{cx:380,cy:91,r:4,fill:'#d44d46'});line(`M 335 91 L 380 ${power?91:63}`,'#d44d46');line('M 380 91 H 405','#d44d46');text(315,45,`SPST · ${power?'ON':'OFF'}`,12);
    box(405,65,115,65);text(416,86,'DC–DC',14);text(416,104,'3.3 V output',12);text(416,120,'ideal converter',9);line('M 462 130 V 500','#263238');line('M 520 91 H 560 M 605 91 H 945 V 130 M 605 91 V 140 H 900','#d44d46');text(540,74,'VCC +3.3 V · RED',13,'#b93d35');text(555,524,'GND 0 V · BLACK',13);
    const bridge='M 560 91 H 605';
    if(closed)line(bridge,'#d44d46');else {line('M 560 91 H 576 M 591 91 H 605','#d44d46');text(577,83,'×',19,'#b93d35');}
    const channelColors=['#e44747','#48ba64','#5099ed'];
    for(const [type,cx] of [['cc',620],['ca',825]]){
      const channels=['R','G','B'].map(c=>el(`${type}-${c}`).checked);
      const rgb=channels.map((on,i)=>on&&running?[255,220,255][i]:0);
      const ledColor=running&&channels.some(Boolean)?`rgb(${rgb.join(',')})`:'#a9b5a0';
      box(cx-94,145,184,270);text(cx-84,169,type==='cc'?'COMMON CATHODE':'COMMON ANODE',12);
      add('circle',{cx,cy:210,r:27,fill:ledColor,opacity:running?Math.max(.18,Math.min(1,220/resistance)):1,stroke:'#627b60','stroke-width':2});
      if(running&&channels.some(Boolean))add('circle',{cx,cy:210,r:34,fill:'none',stroke:ledColor,'stroke-width':5,opacity:.35});
      const commonsY=type==='cc'?500:91;
      line(`M ${cx+65} 210 V ${commonsY}`,type==='cc'?'#263238':'#d44d46');line(`M ${cx+27} 210 H ${cx+65}`,type==='cc'?'#263238':'#d44d46');
      text(cx-82,256,type==='cc'?'Common → GND':'Common → +3.3 V',12);
      ['R','G','B'].forEach((c,j)=>{
        const x=cx-58+j*45;line(`M ${cx} 237 L ${x} 270 V 292`,channelColors[j]);box(x-9,292,18,45,'#e5c99a');text(x-6,312,'R',10);text(x-13,353,`${resistance}Ω`,9);line(`M ${x} 337 V 375`,channelColors[j]);
        text(x-13,393,`${c}:${channels[j]?(type==='cc'?'H':'L'):(type==='cc'?'L':'H')}`,10);
        // Model driver outputs switch each color between VCC and GND.
        const high=type==='cc'?channels[j]:!channels[j];
        line(`M ${x} 375 H ${cx-105-j*7} V ${high?140:500}`,high?'#d44d46':'#263238',1.5);
        if(high)line(`M ${cx-105-j*7} 140 H 900`,'#d44d46',1.5);
        if(running&&channels[j]){
          const currentPath=type==='cc'?`M ${cx-105-j*7} 140 V 375 H ${x} V 270 L ${cx} 237 M ${cx+27} 210 H ${cx+65} V 500`:`M ${cx+65} 91 V 210 H ${cx+27} M ${cx} 237 L ${x} 270 V 375 H ${cx-105-j*7} V 500`;
          add('path',{d:currentPath,fill:'none',stroke:channelColors[j],'stroke-width':3,class:`lab-flow ${el('lab-direction').value==='electron'?'electrons':''}`});
        }
      });
      el(`${type}-reading`).textContent=['R','G','B'].map((c,j)=>`${c}: ${channels[j]?(type==='cc'?'HIGH':'LOW'):(type==='cc'?'LOW':'HIGH')} · ${running&&channels[j]?((3.3-[1.8,2.2,2.8][j])*1000/resistance).toFixed(1)+' mA':'OFF'}`).join(' / ');
    }
    line('M 945 130 V 270','#d44d46');add('circle',{cx:945,cy:310,r:34,fill:'#35483d'});text(923,302,'+',16,'#fff');text(923,320,kind==='active'?'ACTIVE':'PIEZO',10,'#fff');line('M 945 344 V 500','#263238');text(910,373,'Buzzer',12);
    if(sounding){add('path',{d:'M 967 283 Q 992 310 967 337',fill:'none',stroke:'#be663d','stroke-width':3,class:'sound-wave'});}
    const activeLoad=sounding||['cc','ca'].some(type=>['R','G','B'].some(c=>el(`${type}-${c}`).checked));
    if(running&&activeLoad){
      const batteryPath=pack==='4s'?'M 303 111 H 320 V 91 H 405 M 462 500 H 20 V 111 H 35':pack==='4p'?'M 255 91 H 405 M 462 500 H 35 V 81 H 100':'M 255 91 H 405 M 462 500 H 30 V 91 H 55';
      add('path',{d:`${batteryPath} M 520 91 H 900 ${sounding?'M 900 91 H 945 V 270 M 945 344 V 500 H 462':''}`,fill:'none',stroke:'#e3a135','stroke-width':3,class:`lab-flow ${el('lab-direction').value==='electron'?'electrons':''}`});
    }
    text(25,548,'Simplified wiring · HIGH = VCC, LOW = GND · animation speed is illustrative',11);
    audio(sounding,kind,drive,freq,running);
  }
  root.addEventListener('change',render);el('lab-resistance').addEventListener('input',render);
  window.addEventListener('continuity-test',event=>{quizPass=event.detail.pass;quizLabel=event.detail.label;el('lab-circuit').value='test';render();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();else render();});
  window.addEventListener('pagehide',stopAudio);
  render();
})();
