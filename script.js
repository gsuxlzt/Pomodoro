document.addEventListener("DOMContentLoaded", function() {
  let variables = {
    //DOM related variables
    //for the timer effect
    maskFull: document.getElementById('maskFull'),
    fill1: document.getElementsByClassName('fill')[0],
    fill2: document.getElementsByClassName('fill')[1],
    fillFix: document.getElementById('fillFix'),
    //for the display
    workTime: document.getElementById('workTime'),
    breakTime: document.getElementById('breakTime'),
    timeUpdate: document.getElementById('currentTime'),
    updatedTime: workTime.getAttribute('data-time') * 60,
    statDisp: "",
    //for the buttons
    startBtn: document.getElementById('start'),
    resetBtn: document.getElementById('reset'),
    changer: document.getElementsByClassName("timeChanger"),
    //DOM related variables end
    // timer related variables
    isWorking: true,
    changeC: 0,
    changeR: 0,
    currentTimer: "",
    r: 0,
    g: 100,
    b: 0,
    rotation: 0
  }

  //function for checking if the time to be displayed is the break time or the work time
  let checkWork = () => {
    return variables.isWorking ? variables.workTime.getAttribute('data-time') * 60 : variables.breakTime.getAttribute('data-time') * 60;
  }

  //timer function
  let timer = () => {
    updateTime(variables.updatedTime);
    variables.changeC = variables.changeC === 0 ? parseFloat(100 / variables.updatedTime.toFixed(2)) : variables.changeC;
    variables.changeR = variables.changeR === 0 ? parseFloat((180 / variables.updatedTime).toFixed(2)) : variables.changeR;
    changeCSS(variables.rotation, variables.r, variables.g, variables.b);
    variables.r = variables.r === 100 ? variables.r : variables.r + variables.changeC;
    variables.g = variables.g === 0 ? variables.g : variables.g - variables.changeC;
    variables.updatedTime--;
    variables.rotation > 180 ? changeTimer() : variables.rotation += variables.changeR;
  }

  //changes the timer from work to break and vice versa
  let changeTimer = () => {
    stopTimer();
    variables.isWorking = !variables.isWorking;
    variables.startBtn.setAttribute('data-current', 'start');
    variables.startBtn.innerHTML = "START";
    variables.startBtn.style.backgroundColor = '#4CAF50';
    variables.resetBtn.disabled = false;
    addDisplay();
    reset();
  }

  //function for changing the css properties  
  let changeCSS = (rotation, r, g, b) => {
    const toTransform = ['-webkit-transform', '-ms-transform', 'transform'];
    const animationArray = [variables.maskFull, variables.fill1, variables.fill2];
    const colorArray = [variables.fill1, variables.fill2, variables.fillFix];
    let fillRotation = variables.rotation;
    let fixRotation = variables.rotation * 2;

    colorArray.forEach((clr) => {
      clr.style['backgroundColor'] = `rgb(${r}%,${g}%,${b}%)`
    });
    toTransform.forEach((style) => {
      animationArray.forEach((animation) =>
        animation.style[style] = `rotate(${fillRotation}deg)`);
      variables.fillFix.style[style] = `rotate(${fixRotation}deg)`;
    });
  }

  //function for changing the work and break times
  let timeChange = function() {
    let operator = this.getAttribute("data-id");
    let workChange = variables.workTime.getAttribute('data-time');
    let breakChange = variables.breakTime.getAttribute('data-time');
    switch (operator) {
      case 'workPlus':
        workChange == 60 ? workChange = 60 : workChange++;
        break;
      case 'workMinus':
        workChange == 1 ? workChange = 1 : workChange--;
        break;
      case 'breakPlus':
        breakChange == 60 ? breakChange = 60 : breakChange++;
        break;
      case 'breakMinus':
        breakChange == 1 ? breakChange = 1 : breakChange--;
        break;
    }
    variables.workTime.setAttribute('data-time', workChange);
    variables.breakTime.setAttribute('data-time', breakChange);
    variables.updatedTime = checkWork();
    updateTime(variables.updatedTime);
  }

  //function for updating the time in the display
  let updateTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = minutes < 10 ? "0" + minutes.toString() : minutes;
    seconds = seconds < 10 ? "0" + seconds.toString() : seconds;
    variables.timeUpdate.innerHTML = `${minutes}:${seconds}`;
    document.getElementById('workTime').innerHTML = variables.workTime.getAttribute('data-time');
    document.getElementById('breakTime').innerHTML = variables.breakTime.getAttribute('data-time');

  }

  //pause function
  let stopTimer = () => {
    clearInterval(variables.currentTimer);
  }

  //function to reset timer
  let reset = () => {
    variables.rotation = 0;
    variables.r = 0;
    variables.g = 100;
    variables.changeC = 0;
    variables.changeR = 0;
    variables.updatedTime = checkWork();
    updateTime(variables.updatedTime);
    changeCSS(0, 0, 100, 0);
    for (var i = 0; i < variables.changer.length; i++) {
      variables.changer[i].disabled = false;
    }
  }

  //function for start and pause
  function startPause() {
    let text = this.getAttribute('data-current');
    if (text === "start") {
      variables.currentTimer = setInterval(timer, 1000);
      this.setAttribute('data-current', 'pause');
      this.innerHTML = 'PAUSE';
      this.style.backgroundColor = '#f44336';
      variables.resetBtn.disabled = true;
    } else if (text === "pause") {
      stopTimer();
      this.setAttribute('data-current', 'start');
      this.innerHTML = 'START';
      this.style.backgroundColor = '#4CAF50';
      variables.resetBtn.disabled = false;
    }
    for (var i = 0; i < variables.changer.length; i++) {
      variables.changer[i].disabled = true;
    }
  }
  
  //function for adding the text display
  let addDisplay = () => {
    if (variables.isWorking) {
      variables.statDisp.style.left = '10%';
      variables.statDisp.innerHTML = '<h1>Start Working!</h1>';
    } else {
      variables.statDisp.style.left = '15%';
      variables.statDisp.innerHTML = '<h1>Take a Break!</h1>';
    }
    variables.statDisp.style.display = 'block';

  }

  //first function to call
  function loadAll() {
    updateTime(variables.updatedTime);
    let status = document.getElementById('status');
    variables.statDisp = status;
    for (var i = 0; i < variables.changer.length; i++) {
      variables.changer[i].addEventListener('click', timeChange, false);
    }
    variables.startBtn.addEventListener('click', function() {
      addDisplay();
      startPause.call(this);
    });
    variables.resetBtn.addEventListener('click', reset);
  }

  loadAll();
});