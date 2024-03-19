const ganttChartServer1 = document.getElementById("ganttChartServer1");
const simulationForm = document.getElementById("simulation-form");
const resultsDiv = document.getElementById("results");

function interArrivalSelect() {
    meanI.classList.add("none-disp")
    varianceI.classList.add("none-disp")
    meanI.value = "mean"
    varianceI.value = "variance"
    if (iA.value)
        if (iA.value === "poisson" || iA.value === "exponential") {
            meanI.classList.remove("none-disp")
            // varianceI.className.add("none-disp")
        }
        else if (iA.value === "normal" || iA.value === "gamma") {
            meanI.classList.remove("none-disp")
            varianceI.classList.remove("none-disp")
        }
        else if (iA.value === "uniform") {
            meanI.classList.remove("none-disp")
            varianceI.classList.remove("none-disp")
            meanI.value = "min"
            varianceI.value = "max"
        }
}


function serviceTimeSelect() {
    meanS.classList.add("none-disp")
    varianceS.classList.add("none-disp")
    meanS.value = "mean"
    varianceS.value = "variance"
    if (sT.value)
        if (sT.value === "poisson" || sT.value === "exponential") {
            meanS.classList.remove("none-disp")
            // varianceI.className.add("none-disp")
        }
        else if (sT.value === "normal" || sT.value === "gamma") {
            meanS.classList.remove("none-disp")
            varianceS.classList.remove("none-disp")
        }
        else if (sT.value === "uniform") {
            meanS.classList.remove("none-disp")
            varianceS.classList.remove("none-disp")
            meanS.value = "min"
            varianceS.value = "max"
        }
    
}
function shaat(mean) {
    mean.value = ""
}

function generateNormal(mean, stdDev) {
    // console.log ("mean"+mean)
    
    console.log ("dev>>>>>>>"+stdDev)
    
    const std=Math.sqrt(stdDev)
    
    // console.log("std",std)
    var U1 = Math.random();
    var U2 = Math.random();
    var Z0 = Math.sqrt(-2 * Math.log(U1)) * Math.cos(2 * Math.PI * U2);
    var X0 = Z0 * std + mean;
    return X0;
}
// function generateNormal(mean, stdDev) {
//     console.log ("mean"+mean)
    
//     console.log ("dev"+stdDev)
    
//     const std=Math.sqrt(stdDev)
    
//     console.log("std",std)
//     var U1 = Math.random();
//     var U2 = Math.random();
//     var Z0 = Math.sqrt(-2 * Math.log(U1)) * Math.cos(2 * Math.PI * U2);
//     var X0 = Z0 * std + mean;
//     return X0;
// }
function generateNormalRandom(mean, stdDev) {
    const std= Math.sqrt(stdDev);
    const Z0 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    return mean + std * Z0;
}
function generateGamma(mean, variance) {
    var shape = Math.pow(mean, 2) / variance;
    var scale = variance / mean;
    if (shape >= 1) {
        const d = shape - 1 / 3;
        const c = 1 / Math.sqrt(9 * d);

        while (true) {
            const Z = generateNormalRandom(0, 1);
            const U = Math.random();

            const V = 1 + c * Z;
            const V3 = Math.pow(V, 3);
            if (V > 0 && Math.log(U) < (0.5 * Z * Z + d - d * V3 + d * Math.log(V3))) {
                return scale * d * V3;
            }
        }
    }
    else {
        const gammaShape = shape + 1;
        let gammaValue = 0;
        
        for (let i = 0; i < gammaShape; i++) {
            gammaValue -= Math.log(Math.random());
        }
        
        return scale * gammaValue;
    }

    // var d = shape - 1 / 3;
    // var c = 1 / Math.sqrt(9 * d);

    // while (true) {
    //     var Z, U, V, X;
    //     do {
    //         U = Math.random();
    //         V = 1 + c * (Math.random() - 0.5);
    //         V = V * V * V;
    //         Z = U - c;
    //         Z = Z / Math.sqrt(V);
    //         X = d * Z;
    //     } while (X <= -1 || Math.log(U) >= (X * (1 - X) + d * Math.log(X)));

    //     var V1 = Math.random();
    //     var V2 = Math.random();
    //     var W = Math.exp((X - 1) / d);

    //     if (X > 0) {
    //         if (V1 <= W) {
    //             return scale * X;
    //         }
    //     } else {
    //         if (V1 <= 1 - W) {
    //             return scale * X;
    //         }
    //     }

    //     if (V2 <= Math.exp(-0.5 * X)) {
    //         return scale * X;
    //     }
    // }
}
function generateUniform(min, max) {
    return Math.random() * (max - min) + min;
}
function randomNumberGenerator(distr, mean, variance) {
    let random_no=0;
    
    
    if (distr === "normal") {
        
            random_no = Math.ceil(generateNormal(mean, variance))
            while (random_no <= 0 ) {
                random_no = Math.ceil(generateNormal(mean,variance))
            }
            
        
        return random_no
    }
    else if (distr === "gamma") {
        
            random_no = Math.ceil(generateGamma(mean, variance))
            while ((random_no <= 0 )) {
                random_no = Math.ceil(generateGamma(mean, variance))
            }
            
        
        return random_no
    }
    else if (distr === "uniform") {
       
            random_no = Math.ceil(generateUniform(mean, variance))// wrong variable names but works fine
            while ((random_no <= 0 )) {
                random_no = Math.ceil(generateUniform(mean, variance))
            }
           
        
        return random_no
    }
} 
const resultsTable = $("#results-table").DataTable({
  searching: false,
  sorting: false,
  autoWidth: true,
});
let currentTimeServer1 = 0;

function factorial(n) {
  return Array.from({ length: n }, (_, index) => index + 1).reduce(
    (acc, curr) => acc * curr,
    1
  );
}

function poissonProbability(lambda, k) {
  const e = Math.E;
  const numerator = Math.pow(lambda, k) * Math.pow(e, -lambda);
  const denominator = factorial(k);
  return numerator / denominator;
}






var arrival = [];
var service = [];
simulationForm.addEventListener("submit", function (event) {
  event.preventDefault();

//   const interarrivalMean = parseFloat(
//     document.getElementById("interarrival-mean").value
//   );
//   const serviceMean = parseFloat(document.getElementById("service-mean").value);

  resultsTable.clear().draw();
  resultsDiv.classList.remove("hidden");
  simulationForm.classList.add("hidden");

  let currentTime = 0;
  let arrivalTime = 0;
  let i = 0;
  let j = 0;
  var avgservice=0;
  var avginterarrival=0;
  var avgturnaround=0;
  var avgwait=0;
  var avgres=0;

  let customers = 0;
  let cust=[];
  let TAT=[];
  let WT=[];
  let ARR=[];
  let interarrivalTime = 0;
  let util=0
  let sT = document.getElementById("sT");
  let meanS = document.getElementById("meanS");
  let varianceS = document.getElementById("varianceS");
  let iA = document.getElementById("iA");
  let meanI = document.getElementById("meanI")
  let varianceI = document.getElementById("varianceI")
  let nA = document.getElementById("arrivals");
  let total_rand = parseInt(nA.value)
  let interArrivalMean = parseInt(meanI.value)
  let interArrivalVariance = parseInt(varianceI.value)
  let interArrival_dist = iA.value;
  let serviceTime_dist = sT.value;
  let serviceTimeMean = Number(meanS.value);
const distval1= document.getElementById("distribution1").innerHTML=interArrival_dist;
const distval2= document.getElementById("distribution2").innerHTML=serviceTime_dist;
    const serviceTimeVariance = Number(varianceS.value);
    const abcd= serviceTimeVariance;
    let serviceTime= 0;
    for (let i = 0; i < total_rand; i++) {
    
    let time = 0;
    arrivalTime += interarrivalTime;
    arrival.push(arrivalTime);
    
    serviceTime = randomNumberGenerator(serviceTime_dist, serviceTimeMean, abcd);
    
    // console.log(serviceTime)
    service.push(serviceTime);
    if (currentTime < arrivalTime) {
      time = arrivalTime - currentTime;
    }
    const startTime = currentTime + time;
    const endTime = startTime + serviceTime;
    const TurnTime = endTime - arrivalTime;
    const waitTime = TurnTime - serviceTime;
    const resTime = startTime - arrivalTime;
    avgservice+=serviceTime;
    avginterarrival+=interarrivalTime;
    avgturnaround+=TurnTime;
    avgwait+=waitTime;
    avgres+=resTime;
    util=endTime;
    cust.push(customers);
    TAT.push(TurnTime)
    WT.push(waitTime)
    ARR.push(arrivalTime)
    customers += 1;
    resultsTable.row
      .add([
        customers,
        interarrivalTime,
        arrivalTime,
        serviceTime,
        startTime,
        endTime,
        TurnTime,
        waitTime,
        resTime,
      ])
      .draw(false);

    interarrivalTime = randomNumberGenerator(interArrival_dist,interArrivalMean,interArrivalVariance);
    currentTime = endTime;
    
    
  }

//   console.log(util);
//   console.log(service);
//   console.log(arrival);
  const idle= (util-avgservice)/util;
  const util1=avgservice/util;


  avgservice=avgservice/customers;
  avginterarrival=avginterarrival/customers;
  avgturnaround=avgturnaround/customers;
  avgwait=avgwait/customers;
  avgres=avgres/customers;
  const avgser=document.getElementById("avgservice").innerHTML=avgservice.toFixed(4);
  const avgint=document.getElementById("avginter").innerHTML=avginterarrival.toFixed(4);
  const avgtat=document.getElementById("avgturn").innerHTML=avgturnaround.toFixed(4);
  const avgwt=document.getElementById("avgwait").innerHTML=avgwait.toFixed(4);
  const avgrt=document.getElementById("avgres").innerHTML=avgres.toFixed(4);
  const avgutil=document.getElementById("utilization").innerHTML=util1.toFixed(4);
  const avgidle=document.getElementById("idle").innerHTML=idle.toFixed(4);
  
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cust,
      datasets: [{
        label: 'TAT vs Customers',
        data: TAT,
        borderWidth: 1,
        backgroundColor: ['#2daab8']
      }]
    },
    options: {
      maintainAspectRatio: false, // Set to false to allow custom width and height
      aspectRatio: 1, 
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  const ctx1 = document.getElementById('myChart1');

  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: cust,
      datasets: [{
        label: 'WT vs Customers',
        data: WT,
        borderWidth: 1,
        backgroundColor: ['#2daab8']
      }]
    },
    options: {
      maintainAspectRatio: false, // Set to false to allow custom width and height
      aspectRatio: 1, 
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  const ctx2 = document.getElementById('myChart2');

  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: cust,
      datasets: [{
        label: 'Arrival vs Customers',
        data: ARR,
        borderWidth: 1,
        backgroundColor: ['#2daab8']
      }]
    },
    options: {
      maintainAspectRatio: false, // Set to false to allow custom width and height
      aspectRatio: 1, 
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  const ctx3 = document.getElementById('myChart3');

  new Chart(ctx3, {
    type: 'doughnut',
    data: {
      labels: ["Server utilization "+util1.toFixed(4), "idle "+idle.toFixed(4)],
      datasets: [{
        label: 'Server utilization',
        data: [util1,idle],
        borderWidth: 1,
        backgroundColor: [
          'rgb(54, 162, 235)',
          'red',
        ]
      }]
    },
    options: {
      maintainAspectRatio: false, // Set to false to allow custom width and height
      aspectRatio: 1, 
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


  const ganttChart = document.getElementById("ganttChart");

  let current_time = arrival[0];
  for (let i = 0; i < arrival.length; i++) {
    if (i > 0) {
      if (current_time < arrival[i]) {
        // Add idle bar if there is idle time
        const idleTime = arrival[i] - current_time;
        const idleBar = document.createElement("div");
        idleBar.className = "idle-bar";
        idleBar.style.width = `100px`;
        idleBar.textContent = `Idle`;

        ganttChart.appendChild(idleBar);
        current_time = arrival[i];
      }
    }

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = `100px`;
    //   bar.style.backgroundColor = getRandomColor();
    bar.textContent = `P${i + 1}`;

    const startTime = document.createElement("div");
    startTime.className = "time start-time";
    startTime.textContent = `${current_time}`;

    const endTime = document.createElement("div");
    endTime.className = "time end-time";
    endTime.textContent = `${current_time + service[i]}`;

    bar.appendChild(startTime);
    bar.appendChild(endTime);

    current_time += service[i];

    ganttChart.appendChild(bar);
  }
  
  
})

;

