const getData = async (url,mode = 'cors') =>{
  try {
  let response = await fetch(url, {mode});
  let data = await response.json();
  return data;
  } catch(err) {
    console.log(err);
  }
}

const filterLabels = labels => [...new Set(labels)];


$(document).ready(function(){

  // smooth scroll 

  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 100
    }, 500);
});

// smooth scroll end

// sound control

let soundMuted = false;

$('.sound-control').click((e)=>{
  console.log(e.currentTarget);
  const icons = [...e.currentTarget.querySelectorAll('.sound-icon')]
  icons.forEach(item=>item.classList.toggle('active'));
  const idx = icons.findIndex(item=>item.classList.contains('active'));
  soundMuted = !!idx;
})

// const url = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/msft-c.json';
const url = `${document.location.origin}/data.json`;
  // GRAPH
  const buildChart = async () => {
    const ctx = $('#graph');
    const times = [];
    const values1 = [];
    const values2 = [];
    const data = JSON.parse(await getData(url));
  // const data2 = JSON.parse(await getData('http://localhost:5500/data.json'));
  // const data = await getData('https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2019-12-05');
    // data2.forEach(([time,value])=>{
    //   values2.push(value);
    // })
  //   for (let key in data.bpi){
  //     if(data.bpi.hasOwnProperty(key)){
  //       times.push(moment(key, 'YYYY-MM-DD'));
  //       values1.push(data.bpi[key]);
  //     }
  //  }
  data.forEach(([time,value])=>{
    values1.push(value);
    times.push(moment(time));
  })

   const timeFormat = 'YYYY';

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: times.length > 3650 ? [...times.slice(3650)]: [...times],
        datasets: [{
            label: 'BTC',
            data: values1.length > 3650 ? [...values1.slice(3650)]: [...values1],
            fill: false,
            borderColor: 'rgba(196, 137, 50, 1)',
            borderWidth: 4,
            pointBorderColor: 'transparent',
            pointBackgroundColor: 'transparent'
        },
      //   {
      //     label: 'Robotrade',
      //     data: values2,
      //     fill: false,
      //     borderColor: 'rgba(120, 45, 120, 1)',
      //     borderWidth: 0,
      //     pointBorderColor: 'transparent',
      //     pointBackgroundColor: 'transparent'
      // },
    ]},
        options: {
          responsive: false,
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'month',
                tooltipFormat: 'll',
              }
            }]
          },
          tooltips: {
            mode: 'x',
            intersect:false,
            mode: 'nearest'
          },
          hover:{
              mode:'x',
              intersect: false
          },
          legend: {
            display: false
          }
          
      }
});
let counter = 0;
let obj1 = {};
let obj2 = {};
$("#graph").click(e=>{
  counter++;
  if (counter===1) {
    obj1 = {...myChart};
  }
  if (counter===2) {
    obj2 = {...myChart};
  }
})
$("#day").click(() =>{
  changeDates(myChart,'day').then((res)=>{
  });
  $('.graph-button').removeClass('active');
  $("#day").addClass('active');
});

$("#week").click(() =>{
  changeDates(myChart,'week').then((res)=>{
  });
  $('.graph-button').removeClass('active');
  $("#week").addClass('active');
});
$("#month").click(() =>{
  changeDates(myChart,'month').then((res)=>{
  });
  $('.graph-button').removeClass('active');
  $("#month").addClass('active');
});
$("#year").click(() =>{
  changeDates(myChart,'year').then((res)=>{
  });
  $('.graph-button').removeClass('active');
  $("#year").addClass('active');
});
$(".btc-toggle").click(function() {
  console.log($(this)[0].dataset);
  const tumbler = ($(this)[0].dataset['toggled']==='true') ? true : false;

  toggleChart(myChart,tumbler, 'BTC').then((res)=>{
    $(this)[0].dataset['toggled'] = ($(this)[0].dataset['toggled']==='true') ? 'false' : 'true';
  }, (err)=>console.log(err));
})
}





function updateScales(chart) {
  var xScale = chart.scales['x-axis-0'];
  var yScale = chart.scales['y-axis-0'];
  chart.options.scales = {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'll',
        }
      }]
  };
  chart.update();
  // need to update the reference
  xScale = chart.scales['x-axis-0'];
}

const toggleChart = async(chart,tumbler,label) => {
  const neededIndex = chart.data.datasets.findIndex((item)=>item.label === label);
  console.log(neededIndex);
  if (tumbler) { // if true => turn off chart
    chart.data.datasets[neededIndex].data = [];
    chart.update();
  } else {
    await changeDates(chart, 'year');
  }
  console.log(chart.data);
}

const changeDates = async(chart, units) =>{
  const data = JSON.parse(await getData(url));
  var xScale = chart.scales['x-axis-0'];
  const labels = [];
  const values = [];
  let multiplier;
  switch (units) {
    case 'year':
      multiplier = 365;
      break;
    case 'month':
      multiplier = 30;
      break;
    case 'week':
      multiplier = 7;
      break;
    case 'day':
      multiplier = 1;
      break;
  }
  chart.options.scales = {
    xAxes: [{
      type: 'time',
      time: {
        unit: units,
        tooltipFormat: 'll',
      }
    }]
};
data.forEach(([time,value])=>{
  labels.push(moment(time));
  values.push(value);
})
  chart.data.labels = (labels.length > 10*multiplier) ? [...labels.slice(10*multiplier)]: [...labels];
  chart.data.datasets[0].data = (values.length > 10*multiplier) ? [...values.slice(10*multiplier)] : [...values];
  chart.update();
}

$("#graph").on("mousemove", function(evt) {
  var element = $("#cursor"), 
  offsetLeft = element.offset().left,
  domElement = element.get(0),
  clientX = parseInt(evt.clientX - offsetLeft),
  ctx = element.get(0).getContext('2d');

  ctx.clearRect(0, 0, domElement.width, domElement.height),
      ctx.beginPath(),
      ctx.moveTo(clientX, 0),
      ctx.lineTo(clientX, domElement.height),
      ctx.setLineDash([10, 10]),
      ctx.strokeStyle = "#333",
      ctx.stroke()
});


buildChart();



  // GRAPH END


  let counter = false;
    setTimeout(function(){
      $(".preloader").removeClass('preloader');
    },400);
    setTimeout(()=>{
      $('.promo__sign-up-heading.loading').removeClass('loading');
      setTimeout(()=>{
        $('.promo__form .email').removeClass('loading');
        setTimeout(()=>{
          $('.promo__form .btn').removeClass('loading');
        },400)
      },400)
    },800);


    $('.graph-slider').slick({
        dots: true,
        slidesToShow: 2,
        responsive: [
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 1
              }
            }
        ]
    });



    const interval = 1000;
    let expected = Date.now() + interval;
    
    const sliderTimeStep = () => {
      const dt = Date.now() - expected;
      let timeStep;
        if (dt > interval) {
          timeStep = Math.round(dt);
        } else {
          timeStep = interval;
        }
        expected += interval;
        [...document.querySelectorAll('.graph__item-time-value')].forEach(item=>{
          let currentTime = item.innerHTML.split(':').map(item=>parseInt(item)).map((item,index)=>item*(60**(1-index))).reduce((a,b)=>a+b);
          currentTime+=(timeStep/1000);
          item.innerText = `${Math.floor(currentTime/60)}:${currentTime % 60 > 9 ? currentTime % 60 : `0${currentTime % 60}`}min`;
        })
      setTimeout(sliderTimeStep, Math.max(0, interval - dt));
      
    }
    setTimeout(sliderTimeStep, interval);


    const newSliderData = {
      edge1: 'Waves COMMUNITY',
      edge2: 'Pioner Komsomol',
      edge3: 'ETH',
      profit: '0.001',
      time: Date.now() - 3000
    }
    const newSliderData1 = {
      edge1: 'Waves COMMUNITY',
      edge2: 'Pioner Komsomol',
      edge3: 'ETH',
      profit: '0.001',
      time: Date.now() + 8000
    }

    const fillSlide = (data) => {
      const slider = document.querySelector('.graph-slider');
      const slide = document.querySelector('.graph__item-inner');
      let counter = 0;
      [...slider.querySelectorAll(".graph__item")].forEach(item=>{
        if (!item.classList.contains('slick-cloned')) {
          counter++;
        }
      })
      const slideAmount = counter;
      const newSlide = document.createElement('div');
      newSlide.classList.add('graph__item');
      const newInner = slide.cloneNode(true);
      newSlide.appendChild(newInner);
      [...newSlide.querySelectorAll('.graph__item-edge')].forEach((item,index)=>{
        item.classList.add('hidden');
      });
      [...newSlide.querySelectorAll('.graph__item-edge a')].forEach((item,index)=>{
        item.innerText = data[`edge${index+1}`];
      })
      const ago = parseInt((Date.now() - new Date(data.time))/1000);
      // newSlide.querySelector('.graph__item-time').innerText = ago > 60 ? `${Math.floor(ago/60)}:${ago % 60 > 9 ? ago % 60 : `0${ago % 60}`}min` : `${ago}sec`;
      newSlide.querySelector('.graph__item-time-value').innerText = `${Math.floor(ago/60)}:${ago % 60 > 9 ? ago % 60 : `0${ago % 60}`}min`;
      newSlide.querySelector('.graph__item-profit-value').innerText = `$${data.profit}`;
      [...newSlide.querySelectorAll('.graph__item-edge')].forEach((item,index)=>{
        setTimeout(()=>{
          item.classList.remove('hidden');
        },(index+1)*400)
      });
      if (slideAmount >= 10) {
        $('.graph-slider').slick('slickRemove',9);
        $('.graph-slider').slick('slickAdd',newSlide,0,true);
      } else {
        $('.graph-slider').slick('slickAdd',newSlide,0,true);
      }

    }
    
    setTimeout(()=>fillSlide(newSliderData),2000);
    setTimeout(()=>fillSlide(newSliderData1),8000);
    setTimeout(()=>fillSlide(newSliderData),10000);
    setTimeout(()=>fillSlide(newSliderData),12000);
    setTimeout(()=>fillSlide(newSliderData),22000);
    setTimeout(()=>fillSlide(newSliderData),32000);
    setTimeout(()=>fillSlide(newSliderData),40000);
    setTimeout(()=>fillSlide(newSliderData),45000);

    const spinnerData1 = {
      edge1 : {
        value: 0.00001,
        currency: 'BTC'
      },
      action1: 'sell',
      edge2 : {
        value: 10.554,
        currency: 'ETH'
      },
      action2: 'buy',
      edge3 : {
        value: 0.00001,
        currency: 'BTC'
      },
      action3: 'sell',
      profit: '0.0001'
    }
    const spinnerData2 = {
      edge1 : {
        value: 0.00002,
        currency: 'BTC'
      },
      action1: 'buy',
      edge2 : {
        value: 12.554,
        currency: 'ETH'
      },
      action2: 'sell',
      edge3 : {
        value: 0.00002,
        currency: 'BTC'
      },
      action3: 'buy',
      profit: '0.1'
    }


    // // var initial = 30000;
    // // var count = initial;
    // let counter; //10 will  run it every 100th of a second

    

    // displayCount(initial);

    

    function spinnerStep(data) {
      const spinner = document.querySelector('.promo__spinner');
      const image = spinner.querySelector('.spinner__image');
      const verticeTexts = [...spinner.querySelectorAll('.vertice-text')];
      const vertices = [...spinner.querySelectorAll('.vertice')];
      const edgeTexts = [...spinner.querySelectorAll('.edge')];
      const timeLeftContainer = spinner.querySelector('.spinner__last-time');
      const timeLeftItem = timeLeftContainer.querySelector('.spinner__last-time-value');
      const lastProfitContainer = spinner.querySelector('.spinner__last-profit');
      timeLeftContainer.classList.remove('hidden');
      let timeLeft = 250;
      timeLeftItem.innerHTML = '';
      const lastTime = Date.now();
      spinner.classList.add('new-deal');
      if (!soundMuted) {
        document.getElementById("new-deal-notification").play();
      }
      setTimeout(()=>{
        spinner.classList.remove('new-deal');
      },1000);

      const timer = () => {
        if (timeLeft <= 0) {
            clearInterval(counter);
            return;
        }
        timeLeft--;
        displayCount(timeLeft);
    }
    let counter;

    const displayCount = (timeLeft)=> {
        var res = timeLeft / 100;
        timeLeftItem.innerHTML = res.toPrecision(timeLeft.toString().length) + " secs";
    }
    
      // pre-init 
      image.style.transitionDuration = '';
      spinner.querySelector('.spinner__last-profit-value').innerText = `+${data.profit}$`;
      verticeTexts.forEach((item,index)=>{
        item.querySelector('.vertice-text-value').innerText = data[`edge${index+1}`].value;
        item.querySelector('.vertice-text-currency').innerText = data[`edge${index+1}`].currency;
      })
      edgeTexts.forEach((item,index)=>{
        item.querySelector('.edge-text').innerText = data[`action${index+1}`];
      }) 
      // pre-init end
      // start vertice animation(each 1000ms will trigger 400ms animation to change question to vertice data)
      vertices.forEach((item,index)=>{
        setTimeout(()=>{
          if (!index) {
            counter = setInterval(timer, 10);
          };
          const question = item.querySelector('.vertice-text-question');
          const data = item.querySelector('.vertice-text-data');
          question.classList.add('hidden');
          setTimeout(()=>{
            data.classList.remove('hidden');
          },400);
        },1000*(index+1));
      });
      // show edge action(buy/sell)
      edgeTexts.forEach((item,index)=>{
        setTimeout(()=>{
          item.querySelector('.edge-text').classList.remove('hidden');
        },1000*(index+1)+500);
      });
      // at the end of vertice animation show last profit instead of timer
      setTimeout(()=>{
        clearInterval(counter);
        timeLeftContainer.classList.add('hidden');
        spinner.querySelector('.spinner__last-profit').classList.remove('hidden');
        spinner.classList.add('spinner-shaking');
        let blinkingtext = setInterval(()=>{
          const shownBlink = document.querySelector('.blinking-item.blinking-item-show');
          const allBlinkingItems = [...document.querySelectorAll('.blinking-item')];
          const idx = allBlinkingItems.findIndex(item=>item==shownBlink);
          const nextIdx = (idx+1)%3;
          allBlinkingItems.forEach(item=>item.classList.remove('blinking-item-show'));
          if (allBlinkingItems[nextIdx].classList.contains('time')){
            const timePassed = Date.now() - lastTime;
            allBlinkingItems[nextIdx].querySelector('.spinner__last-profit-value').innerText = `${parseInt(timePassed/60000)}:${parseInt(timePassed/1000)>10?parseInt(timePassed/1000):'0'+parseInt(timePassed/1000)}`
          }
          allBlinkingItems[nextIdx].classList.add('blinking-item-show');
          
          
        },1000)
      },3500);
      // after 10000ms spin the spinner(move to 360 deg, after disable transition and move to 0, to remove counters), hide all texts, show question marks after spin end
      setTimeout(()=>{
        spinner.classList.remove('spinner-shaking');
        setTimeout(()=>{
          spinner.querySelector('.spinner__last-profit').classList.add('hidden');
          vertices.forEach((item)=>{
            const data = item.querySelector('.vertice-text-data');
            data.classList.add('hidden');
          });
          edgeTexts.forEach((item)=>{
            item.querySelector('.edge-text').classList.add('hidden');
          })
        },1000);
        
      setTimeout(()=>{
        image.style.transform = `rotate(360deg)`;
      },1500);
      setTimeout(()=>{
        vertices.forEach((item)=>{
            item.querySelector('.vertice-text-question').classList.remove('hidden');
        });
        image.style.transitionDuration = '0s';
        setTimeout(()=>{
          image.style.transform = '';
          lastProfitContainer.classList.add('hidden');
        },100);
      },3000);
    },10000);
  }
  spinnerStep(spinnerData1);
  setInterval(()=>spinnerStep(spinnerData1),15000);
    window.addEventListener('scroll',()=>{
      const windowHeight = window.innerHeight;
      [...$('.animated-headline')].forEach((item,index)=>{
        const top = item.getBoundingClientRect().top;
        if (top < windowHeight) {
          const diff = windowHeight - top;
          const progress = diff*2/windowHeight;
          const percent = progress > 1 ? 1 : progress;
          item.style.transform = `translateY(${(1-Math.sin(Math.acos(1-percent)))*100}px)`;
          item.style.opacity = `${percent}`;
        }
      })


      if ($('.statistics__items')[0].getBoundingClientRect().top < windowHeight) {
        
        [...$(".statistic__item")].forEach((item,index)=>{
          setTimeout(()=>{
            item.classList.remove('hidden');
          },(index+1)*250);
        })
      }
      if ($(".statistics")[0].getBoundingClientRect().top < windowHeight) {
        const height = $('.statistics')[0].getBoundingClientRect().height;
        const triangleSm = $('.statistics .triangle-sm');
        const triangleLg = $('.statistics .triangle-lg');
        const offsetTop = height - $('.statistics')[0].getBoundingClientRect().top + height;
        const topSm = triangleSm.css('top');
        const topLg = triangleLg.css('top');
        const scrollProgress = offsetTop / (2 * height);
        triangleSm.css('top',`${height - scrollProgress * height/2}px`);
        triangleSm.css('bottom',`unset`);
        triangleLg.css('top',`${height - scrollProgress * height/2}px`);
        triangleLg.css('bottom',`unset`);
      }

      if (($('.history-diagram-item')[0].getBoundingClientRect().top < windowHeight) && (!counter)) {
        counter = true;
        $(".diargram-circle.volume-circle").removeClass('p0')
        $(".diargram-circle.volume-circle").addClass('p50');
        setTimeout(()=>{
          $(".diargram-circle.volume-circle").addClass('no-animation');
          $(".diargram-circle.volume-circle").addClass('p51');
          $(".diargram-circle.volume-circle").removeClass('p49');
        },1176);
        setTimeout(()=>{
          $(".diargram-circle.volume-circle").removeClass('p51');
          $(".diargram-circle.volume-circle").removeClass('no-animation');
          $(".diargram-circle.volume-circle").addClass('second-half');
          $(".diargram-circle.volume-circle").addClass('p85');
        },1200);
        $(".diargram-circle.transaction-circle").removeClass('p0')
        $(".diargram-circle.transaction-circle").addClass('p45')
        $(".diargram-circle.asset-circle").removeClass('p0')
        $(".diargram-circle.asset-circle").addClass('p30')
        $('.countable').each(function () {
          var $this = $(this);
          if ($this.hasClass('volume')) {
            jQuery({ Counter: 0 }).animate({ Counter: ($this.text().slice(1).split(' ').join('')) }, {
              duration: 2000,
              easing: 'swing',
              step: function () {
                $this.text(`$${(Math.ceil(this.Counter)+'').toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`);
              }
            });
          } else
          if ($this.hasClass('transactions')) {
            jQuery({ Counter: 0 }).animate({ Counter: ($this.text().split(' ').join('')) }, {
              duration: 2000,
              easing: 'swing',
              step: function () {
                $this.text(`${(Math.ceil(this.Counter)+'').toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`);
              }
            });
          } else
          if ($this.hasClass('bankroll-value')) {
            jQuery({ Counter: 0 }).animate({ Counter: (parseInt($this.text())) }, {
              duration: 2000,
              easing: 'swing',
              step: function () {
                $this.text(`${(Math.ceil(this.Counter))}%`);
              }
            });
          }
          else {
            jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
              duration: 2000,
              easing: 'swing',
              step: function () {
                $this.text(Math.ceil(this.Counter));
              }
            });
          }
          
        });
      }

      if ($('.register')[0].getBoundingClientRect().top < windowHeight) {
        const height = $('.register')[0].getBoundingClientRect().height;
        const triangleSm = $('.register .triangle-sm');
        const triangleLg = $('.register .triangle-lg');
        const offsetTop = height - $('.register')[0].getBoundingClientRect().top + height;
        const topSm = triangleSm.css('top');
        const topLg = triangleLg.css('top');
        const scrollProgress = offsetTop / (2 * height);
        triangleSm.css('top',`${height/2 - scrollProgress * height/2}px`);
        triangleSm.css('bottom',`unset`);
        triangleLg.css('top',`${height/2 - scrollProgress * height/2}px`);
        triangleLg.css('bottom',`unset`);
       }
      
    })

    const placeholderTableData = [
      {
        value: 120,
        date: '10:15 at 20/10/2019'
      },
      {
        value: 1000,
        date: '10:16 at 20/10/2019'
      },
      {
        value: 2000,
        date: '10:18 at 20/10/2019'
      },
      {
        value: 100,
        date: '10:20 at 20/10/2019'
      },
      {
        value: 250,
        date: '10:22 at 20/10/2019'
      },
      {
        value: 500,
        date: '10:24 at 20/10/2019'
      },
    ]
    function updateTable(type) {
      const list = $(`.${type}-history`)[0];
      const items = [...list.querySelectorAll('.history__list-item')];
      const lastItem = items.pop();
      const newItem = lastItem.cloneNode(true);
      const newItemData = placeholderTableData.shift();
      setTimeout(()=>{
        newItem.style.opacity = '0';
      },100);
      setTimeout(()=>{
        newItem.querySelector('.history__item-value').innerText = `$${newItemData.value}`;
        newItem.querySelector('.history__item-date').innerText = `$${newItemData.date}`;
        list.insertBefore(newItem,items[0]);
      },500);
      setTimeout(()=>{
        newItem.style.opacity = '1';
        lastItem.parentElement.removeChild(lastItem);
      },550);
    }
    setInterval(()=>{placeholderTableData.length ? updateTable('deposit'): ''},2500);
    setInterval(()=>{placeholderTableData.length ? updateTable('cashout'): ''},2500);
    $('.toggle-menu').click(function(){
      $(this).toggleClass('active');
      $('.header__menu').toggleClass('active');
    })

    function runRobot() {
      const teeth = [...$('.robot-tooth')];
      const heights = teeth.map(item=>$(item).data('tooth-height'));
      teeth.forEach((item,i)=>{
        const random = Math.random()*10 - 5;
        $(item).height(heights[i]+random);
      })
    }

    setInterval(runRobot,100);
});

// terminal 

[...document.querySelectorAll('.terminal__button')].forEach(item=>{
  item.addEventListener('click',e=>{
    e.preventDefault();
  })
})

setInterval(()=>{
  const bash = document.querySelector('.terminal__bash');
  const terminalLine = document.createElement('div');
  terminalLine.classList.add('details');
  terminalLine.innerHTML = '2020-01-10 11:23 +03:00: Fetched 34 out of 34 responses in 0.107 seconds, 422 operations out of 426, cycle: 0.012 s., total time: 0.12 s';
  bash.appendChild(terminalLine);
  bash.scrollTop = bash.scrollHeight - bash.clientHeight;
},1000)

// 