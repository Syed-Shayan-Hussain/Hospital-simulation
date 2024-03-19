const ganttChartServer1 = document.getElementById("ganttChartServer1");
const simulationForm1 = document.getElementById("simulation-form1");
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

function lists(a,b){
  let c=[];
  for (let i = 0; i < a.length; i++) {
    c.push(b[a[i]]);
  }
  return c;
}
    



























var arrival = [];
var service = [];
simulationForm1.addEventListener("submit", function (event) {
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
  var avgservice=0;
  var avginterarrival=0;
  var avgturnaround=0;
  var avgwait=0;
  var avgres=0;

  let customers = 0;
  let CP=[];
  let cust=[];
  let TAT=[];
  let WT=[];
  let ARR=[];
  let interarrivalTime = 0;

  let util=0
  while (i < 1) {
    j = poissonProbability(interarrivalMean, customers).toFixed(4);
    let time = 0;
    arrivalTime += interarrivalTime;
    arrival.push(arrivalTime);
    var serviceTime = Math.round(-serviceMean * Math.log(Math.random()));
    if (serviceTime==0){
      serviceTime=Math.round(serviceMean);
    }
    service.push(serviceTime);
    if (currentTime < arrivalTime) {
      time = arrivalTime - currentTime;
    }
    // const startTime = currentTime + time;
    // const endTime = startTime + serviceTime;
    // const TurnTime = endTime - arrivalTime;
    // const waitTime = TurnTime - serviceTime;
    // const resTime = startTime - arrivalTime;
    // avgservice+=serviceTime;
    // avginterarrival+=interarrivalTime;
    // avgturnaround+=TurnTime;
    // avgwait+=waitTime;
    // avgres+=resTime;
    // util=endTime;
    cust.push(customers);
    // TAT.push(TurnTime)
    // WT.push(waitTime)
    ARR.push(interarrivalTime)
    j = Math.round(j * 10000) / 10000;
    
    CP.push(i)

    interarrivalTime = Math.round(-interarrivalMean * Math.log(Math.random()));
    customers += 1;
    i += j;
    i = Math.round(i * 10000) / 10000;
    if (i==0.9999){
      i=1;
      console.log('2')
    }
    
  }
  
  const ganttChartServer1 = document.getElementById('ganttChartServer1');
  const ganttChartServer2 = document.getElementById('ganttChartServer2');

  let currentTimeServer1 = 0;
  let currentTimeServer2 = 0;
  let serv=[];
  let serv1=[];
  let serv2=[];
  let serv1cust=[];
  let serv2cust=[];

  var servidle1=0;
  var servidle2=0; 
  var servutil1=0;
  var servutil2=0;
  let individualcustomers=0; 
  for (let i = 0; i < arrival.length; i++) {
      let server = (currentTimeServer1 <= currentTimeServer2) ? 1 : 2;

      const currentTime = (server === 1) ? currentTimeServer1 : currentTimeServer2;
      
      if (currentTime < arrival[i]) {
          // Add idle bar if there is idle time
          const idleTime = arrival[i] - currentTime;
          const idleBar = document.createElement('div');
          idleBar.className = 'idle-bar';
          //idleBar.style.width = `${idleTime * 30}px`;
          idleBar.textContent = `Idle`;

          const startTime = document.createElement('div');
          startTime.className = 'time start-time';
          startTime.textContent = `${currentTime}`;

          const endTime = document.createElement('div');
          endTime.className = 'time end-time';
          endTime.textContent = `${arrival[i]}`;

          idleBar.appendChild(startTime);
          idleBar.appendChild(endTime);

          if (server === 1) {
              ganttChartServer1.appendChild(idleBar);
              currentTimeServer1 = arrival[i];
              servidle1+=idleTime;
            
          } else {
              ganttChartServer2.appendChild(idleBar);
              currentTimeServer2 = arrival[i];
              servidle2+=idleTime;
              
          }
      }
   
      
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.textContent = `P${i + 1} `;

      const startTime = document.createElement('div');
      startTime.className = 'time start-time';
      startTime.textContent = `${Math.max(currentTime, arrival[i])}`;
      let st=Math.max(currentTime, arrival[i])
      const endTime = document.createElement('div');
      endTime.className = 'time end-time';
      endTime.textContent = `${Math.max(currentTime, arrival[i]) + service[i]}`;
      let en=Math.max(currentTime, arrival[i]) + service[i]
      bar.appendChild(startTime.cloneNode(true));
      bar.appendChild(endTime.cloneNode(true));

      if (server === 1) {
          currentTimeServer1 = Math.max(currentTimeServer1, arrival[i]) + service[i];
          ganttChartServer1.appendChild(bar);
          serv.push(st);
          serv.push(en);
          serv1.push(st);
          serv1.push(en);
          servutil1= en;
          serv1cust.push(individualcustomers);
          individualcustomers+=1;

          
      } else {
          currentTimeServer2 = Math.max(currentTimeServer2, arrival[i]) + service[i];
          ganttChartServer2.appendChild(bar);
          serv.push(st)
          serv.push(en)
          serv2.push(st)
          serv2.push(en)
          servutil2= en;
          serv2cust.push(individualcustomers);
          individualcustomers+=1;
      }
  }

  let en=1
  let st=0
  console.log("2 "+serv1cust);
  console.log("2 "+serv2cust);

  for (let i = 0; i < arrival.length; i++) {
    interarrivalTime=ARR[i];
    customers=cust[i]
    arrivalTime=arrival[i];
    serviceTime=service[i];
    const prob=CP[i];
    const startTime = serv[st];
    const endTime = serv[en];
    st+=2
    en+=2
    const TurnTime = endTime - arrivalTime;
    const waitTime = TurnTime - serviceTime;
    const resTime = startTime - arrivalTime;
    avgservice+=serviceTime;
    avginterarrival+=interarrivalTime;
    avgturnaround+=TurnTime;
    avgwait+=waitTime;
    avgres+=resTime;
    util=endTime;
    TAT.push(TurnTime)
    WT.push(waitTime)
    resultsTable.row
      .add([
        customers,
        Math.round(prob * 10000) / 10000,
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

    
    ;
  }
  
  const inTAT1= lists(serv1cust,TAT);
  const inTAT2= lists(serv2cust,TAT);
  const inWT1= lists(serv1cust,WT);
  const inWT2= lists(serv2cust,WT);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  const sum = service.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const endvalue=[servutil1,servutil2]
  
 
  const idle= (util-avgservice)/util;
  
  
  servutil1-=servidle1;
  servutil2-=servidle2;
 
  const util1=servutil1/sum;
  const util2=servutil2/sum;

  

  

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
  const avgidle=document.getElementById("idle").innerHTML=util2.toFixed(4);
  
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: serv1cust,
      datasets: [{
        label: 'Server 1 (TAT vs Customers)',
        data: inTAT1,
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
      labels: serv2cust,
      datasets: [{
        label: 'Server 2 (TAT vs Customers)',
        data: inTAT2,
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
    type: 'bar',
    data: {
      labels: serv1cust,
      datasets: [{
        label: 'Server 1 (WT vs Customers)',
        data: inWT1,
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
    type: 'bar',
    data: {
      labels: serv2cust,
      datasets: [{
        label: 'Server 2 (WT vs Customers)',
        data: inWT2,
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
  const ctx4 = document.getElementById('myChart4');

  new Chart(ctx4, {
    type: 'line',
    data: {
      labels: cust,
      datasets: [{
        label: 'Arrival vs Customers',
        data: arrival,
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
  const ctx5 = document.getElementById('myChart5');

  new Chart(ctx5, {
    type: 'doughnut',
    data: {
      labels: ["Server 1 utilization "+util1.toFixed(4), "server 2 utilization"+util2.toFixed(4)],
      datasets: [{
        label: 'Server utilization',
        data: [util1,util2],
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





})

