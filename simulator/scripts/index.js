const ganttChartServer1 = document.getElementById("ganttChartServer1");
const simulationForm = document.getElementById("simulation-form");
const resultsDiv = document.getElementById("results");

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

  const interarrivalMean = parseFloat(
    document.getElementById("interarrival-mean").value
  );
  const serviceMean = parseFloat(document.getElementById("service-mean").value);

  resultsTable.clear().draw();
  resultsDiv.classList.remove("hidden");
  simulationForm.classList.add("hidden");

  let currentTime = 0;
  let arrivalTime = 0;
  let i = 0;
  let j = 0;
  var avgservice = 0;
  var avginterarrival = 0;
  var avgturnaround = 0;
  var avgwait = 0;
  var avgres = 0;

  let customers = 0;
  let cust = [];
  let TAT = [];
  let WT = [];
  let ARR = [];
  let interarrivalTime = 0;
  let util = 0;

  while (i < 1) {
    j = poissonProbability(interarrivalMean, customers);
    let time = 0;
    arrivalTime += interarrivalTime;
    arrival.push(arrivalTime);
    let serviceTime = Math.round(-serviceMean * Math.log(Math.random()));

    if (serviceTime == 0) {
      serviceTime = Math.round(serviceMean);
    }
    service.push(serviceTime);
    if (currentTime < arrivalTime) {
      time = arrivalTime - currentTime;
    }
    const startTime = currentTime + time;
    const endTime = startTime + serviceTime;
    const TurnTime = endTime - arrivalTime;
    const waitTime = TurnTime - serviceTime;
    const resTime = startTime - arrivalTime;
    avgservice += serviceTime;
    avginterarrival += interarrivalTime;
    avgturnaround += TurnTime;
    avgwait += waitTime;
    avgres += resTime;
    util = endTime;
    cust.push(customers);
    TAT.push(TurnTime);
    WT.push(waitTime);
    ARR.push(arrivalTime);
    customers += 1;

    // Round i to 4 decimal places

    resultsTable.row
      .add([
        customers,
        Math.round(i * 10000) / 10000,
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

    interarrivalTime = Math.round(-interarrivalMean * Math.log(Math.random()));
    currentTime = endTime;

    i += j;
    i = Math.round(i * 10000) / 10000;
    if (i == 0.9999) {
      i = 1;
    }
  }

  console.log(util);
  const idle = (util - avgservice) / util;
  const util1 = avgservice / util;

  avgservice = avgservice / customers;
  avginterarrival = avginterarrival / customers;
  avgturnaround = avgturnaround / customers;
  avgwait = avgwait / customers;
  avgres = avgres / customers;
  const avgser = (document.getElementById("avgservice").innerHTML =
    avgservice.toFixed(4));
  const avgint = (document.getElementById("avginter").innerHTML =
    avginterarrival.toFixed(4));
  const avgtat = (document.getElementById("avgturn").innerHTML =
    avgturnaround.toFixed(4));
  const avgwt = (document.getElementById("avgwait").innerHTML =
    avgwait.toFixed(4));
  const avgrt = (document.getElementById("avgres").innerHTML =
    avgres.toFixed(4));
  const avgutil = (document.getElementById("utilization").innerHTML =
    util1.toFixed(4));
  const avgidle = (document.getElementById("idle").innerHTML = idle.toFixed(4));



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
});






const ctx = document.getElementById("myChart");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: cust,
    datasets: [
      {
        label: "TAT vs Customers",
        data: TAT,
        borderWidth: 1,
        backgroundColor: ["#2daab8"],
      },
    ],
  },
  options: {
    maintainAspectRatio: false, // Set to false to allow custom width and height
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
const ctx1 = document.getElementById("myChart1");

new Chart(ctx1, {
  type: "bar",
  data: {
    labels: cust,
    datasets: [
      {
        label: "WT vs Customers",
        data: WT,
        borderWidth: 1,
        backgroundColor: ["#2daab8"],
      },
    ],
  },
  options: {
    maintainAspectRatio: false, // Set to false to allow custom width and height
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
const ctx2 = document.getElementById("myChart2");

new Chart(ctx2, {
  type: "line",
  data: {
    labels: cust,
    datasets: [
      {
        label: "Arrival vs Customers",
        data: ARR,
        borderWidth: 1,
        backgroundColor: ["#2daab8"],
      },
    ],
  },
  options: {
    maintainAspectRatio: false, // Set to false to allow custom width and height
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
const ctx3 = document.getElementById("myChart3");

new Chart(ctx3, {
  type: "doughnut",
  data: {
    labels: [
      "Server utilization " + util1.toFixed(4),
      "idle " + idle.toFixed(4),
    ],
    datasets: [
      {
        label: "Server utilization",
        data: [util1, idle],
        borderWidth: 1,
        backgroundColor: ["rgb(54, 162, 235)", "red"],
      },
    ],
  },
  options: {
    maintainAspectRatio: false, // Set to false to allow custom width and height
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

  // while (i < 1) {
  //   j = poissonProbability(interarrivalMean, customers);
  //   let time = 0;
  //   arrivalTime += interarrivalTime;
  //   arrival.push(arrivalTime);
  //   let serviceTime = Math.round(-serviceMean * Math.log(Math.random()));

  //   if (serviceTime==0){
  //     serviceTime = Math.round(serviceMean);
  //   }
  //   service.push(serviceTime);
  //   if (currentTime < arrivalTime) {
  //     time = arrivalTime - currentTime;
  //   }
  //   const startTime = currentTime + time;
  //   const endTime = startTime + serviceTime;
  //   const TurnTime = endTime - arrivalTime;
  //   const waitTime = TurnTime - serviceTime;
  //   const resTime = startTime - arrivalTime;
  //   avgservice+=serviceTime;
  //   avginterarrival+=interarrivalTime;
  //   avgturnaround+=TurnTime;
  //   avgwait+=waitTime;
  //   avgres+=resTime;
  //   util=endTime;
  //   cust.push(customers);
  //   TAT.push(TurnTime)
  //   WT.push(waitTime)
  //   ARR.push(arrivalTime)
  //   customers += 1;
  //   resultsTable.row
  //     .add([
  //       customers,
  //       i,
  //       interarrivalTime,
  //       arrivalTime,
  //       serviceTime,
  //       startTime,
  //       endTime,
  //       TurnTime,
  //       waitTime,
  //       resTime,
  //     ])
  //     .draw(false);

  //   interarrivalTime = Math.round(-interarrivalMean * Math.log(Math.random()));
  //   currentTime = endTime;

  //   i += j;
  // }
