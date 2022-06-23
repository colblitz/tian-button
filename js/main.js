console.log("start");

const add = (x,y) =>
  x + y
  
const sum = xs =>
  xs.reduce(add, 0)

const average = xs =>
  xs[0] === undefined ? NaN : sum(xs) / xs.length

const delta = ([x,...xs]) =>
  xs.reduce(([acc, last], x) => [[...acc, x-last], x], [[], x]) [0]

const roundTo1Decimal = x => Math.round(x * 10) / 10

function updateTimes(all_times) {
  // number of times, 5am-5am
  var threshold = new Date(Math.floor(((new Date()).getTime() - 1000 * 60 * 60 * 9) / 86400000) * 86400000 + 1000 * 60 * 60 * 9);    
  var num = 0;
  for (let time of all_times) {
    if (time > threshold) {
      num += 1;
    }
  }
  document.getElementById('stat1').textContent = num;

  // average time between times, past 24 
  var threshold = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24);
  var new_times = [];
  for (let time of all_times) {
    if (time > threshold) {
      new_times.push(time.getTime());
    }
  }
  var avg = average(delta(new_times)) / (1000 * 60);
  document.getElementById('stat2').textContent = "" + roundTo1Decimal(avg) + " min";

  // average number of times per day in past 7 days
  var counts = {};
  var threshold1 = new Date(Math.floor(((new Date()).getTime() - 1000 * 60 * 60 * 9) / 86400000) * 86400000 + 1000 * 60 * 60 * 9);
  var threshold2 = new Date(Math.floor(((new Date()).getTime() - 1000 * 60 * 60 * 9) / 86400000) * 86400000 + 1000 * 60 * 60 * 9 + 1000 * 60 * 60 * 24);

  for (var i = 0; i < 7; i++) {
    counts[i] = 0;
    for (let time of all_times) {
      if (time > threshold1 && threshold2 > time) {
        counts[i] += 1;
      }
    }
    threshold1 = new Date(threshold1.getTime() - 1000 * 60 * 60 * 24);
    threshold2 = new Date(threshold2.getTime() - 1000 * 60 * 60 * 24);
  }
  document.getElementById('stat3').textContent = roundTo1Decimal(average(Object.values(counts)));

  // average time between times, past 7 days
  var threshold = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7);
  var new_times = [];
  for (let time of all_times) {
    if (time > threshold) {
      new_times.push(time.getTime());
    }
  }
  var avg = average(delta(new_times)) / (1000 * 60);
  document.getElementById('stat4').textContent = "" + roundTo1Decimal(avg) + " min";
  
  // Update list of times
  var times = document.getElementById('times');
  while (times.firstChild) {
    times.removeChild(times.firstChild);
  }

  all_times.reverse().forEach(function(time) {
    var item = document.createElement('div');
    item.textContent = time.toLocaleString();
    times.appendChild(item);
  });
  // for (let time of all_times) {
  //   var item = document.createElement('div');
  //   item.textContent = time.toLocaleString();
  //   times.appendChild(item);
  // }
}

function resetTimes() {
  if (confirm("Are you sure you want to reset?") == true) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/resettimes", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({}));
    updateTimes([]);
  }
}

function buttonClicked() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/buttonclicked", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({}));

  xhr.onload = function() {
    var data = JSON.parse(this.responseText);
    var all_times = data.times.split(",").map(x => new Date(x));
    updateTimes(all_times);
  };
}

function initialLoad() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/initial", true);
  xhr.send(null);
  xhr.onload = function() {
    var data = JSON.parse(this.responseText);
    var all_times = data.times.split(",").map(x => new Date(x));
    updateTimes(all_times);
  };
}