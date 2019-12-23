const getData = async (url) =>{
  let response = await fetch(url);
  let data = await response.json()
  return data;
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
  // GRAPH
  const buildChart = async () => {
    const ctx = $('#graph');
    const times = [];
    const values1 = [];
    const values2 = [];

  // const data2 = JSON.parse(await getData('http://localhost:5500/data.json'));
  const data = await getData('https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2019-12-05');
    // data2.forEach(([time,value])=>{
    //   values2.push(value);
    // })
    for (let key in data.bpi){
      if(data.bpi.hasOwnProperty(key)){
        times.push(moment(key, 'YYYY-MM-DD'));
        values1.push(data.bpi[key]);
      }
   }

   const timeFormat = 'YYYY';

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...times.slice(-3650)],
        datasets: [{
            label: 'BTC',
            data: [...values1.slice(-3650)],
            fill: false,
            borderColor: 'rgba(196, 137, 50, 1)',
            borderWidth: 0,
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
  console.dir(obj1);
  console.dir(obj2);
  document.querySelector('.placeholder-1').innerText = obj1;
  document.querySelector('.placeholder-2').innerText = obj2;
})
$("#day").click(() =>{
  console.log('clicked');
  changeDates(myChart,'day').then((res)=>{
    console.log('success');
  });
  $('.graph-button').removeClass('active');
  $("#day").addClass('active');
});

$("#week").click(() =>{
  console.log('clicked');
  changeDates(myChart,'week').then((res)=>{
    console.log('success');
  });
  $('.graph-button').removeClass('active');
  $("#week").addClass('active');
});
$("#month").click(() =>{
  console.log('clicked');
  changeDates(myChart,'month').then((res)=>{
    console.log('success');
  });
  $('.graph-button').removeClass('active');
  $("#month").addClass('active');
});
$("#year").click(() =>{
  console.log('clicked');
  changeDates(myChart,'year').then((res)=>{
    console.log('success');
  });
  $('.graph-button').removeClass('active');
  console.log($(this));
  $("#year").addClass('active');
});
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

const changeDates = async(chart, units) =>{
  const data = await getData('https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2019-12-05');
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
for (let key in data.bpi){
  if(data.bpi.hasOwnProperty(key)){
    labels.push(moment(key, 'YYYY-MM-DD'));
    values.push(data.bpi[key]);
  }
}
  chart.data.labels = [...labels.slice(-10*multiplier)];
  chart.data.datasets[0].data = [...values.slice(-10*multiplier)];
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
        },1000)
      },1000)
    },2000)
    $('.graph-slider').slick({
        dots: true,
        slidesToShow: 2,
        responsive: [
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 1
              }
            }
        ]
    });
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

    let currentSpinnerStep = 0;

    function spinnerStep(data) {
      const spinner = document.querySelector('.promo__spinner');
      const image = spinner.querySelector('.spinner__image');
      const verticeTexts = [...spinner.querySelectorAll('.vertice-text')];
      const vertices = [...spinner.querySelectorAll('.vertice')];
      const edgeTexts = [...spinner.querySelectorAll('.edge')];
      spinner.querySelector('.spinner__last-profit-value').innerText = `+${data.profit}$`;
      verticeTexts.forEach((item,index)=>{
        console.log(data[`edge${index+1}`]);
        item.querySelector('.vertice-text-value').innerText = data[`edge${index+1}`].value;
        item.querySelector('.vertice-text-currency').innerText = data[`edge${index+1}`].currency;
      })
      edgeTexts.forEach((item,index)=>{
        item.querySelector('.edge-text').innerText = data[`action${index+1}`];
      }) 
      vertices.forEach((item,index)=>{
        setTimeout(()=>{
          const question = item.querySelector('.vertice-text-question');
          const data = item.querySelector('.vertice-text-data');
          question.classList.add('hidden');
          setTimeout(()=>{
            data.classList.remove('hidden');
          },400);
        },1000*(index+1));
      });
      edgeTexts.forEach((item,index)=>{
        setTimeout(()=>{
          item.querySelector('.edge-text').classList.remove('hidden');
        },1000*(index+1)+500);
      });
      setTimeout(()=>{
        spinner.querySelector('.spinner__last-profit').classList.remove('hidden');
      },3500);
      setTimeout(()=>{
        currentSpinnerStep++;
        setTimeout(()=>{
          vertices.forEach((item)=>{
            const data = item.querySelector('.vertice-text-data');
            data.classList.add('hidden');
          });
          edgeTexts.forEach((item)=>{
            item.querySelector('.edge-text').classList.add('hidden');
          })
        },1000);
        
      setTimeout(()=>{
        verticeTexts.forEach((item)=>{
          item.style.transform = `rotate(-${120*currentSpinnerStep}deg)`;
        })
        image.style.transform = `rotate(${120*currentSpinnerStep}deg)`;
        edgeTexts.forEach((item,index)=>{
          item.querySelector('.edge-text').classList.remove('bottom');
          if (index === ((1+currentSpinnerStep)%3)) {
            item.querySelector('.edge-text').classList.add('bottom');
          }
        })
      },1500);
      setTimeout(()=>{
        vertices.forEach((item)=>{
            item.querySelector('.vertice-text-question').classList.remove('hidden');
        });
        edgeTexts.forEach((item,index)=>{
          item.querySelector('.edge-text').classList.remove('hidden');
          if (index === ((1+currentSpinnerStep)%3)) {
            item.querySelector('.edge-text').classList.add('bottom');
          }
        })
      },2000);
    },10000);
  }
    spinnerStep(spinnerData1);
    // spinnerStep(spinnerData1);
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


      if ($('.statistics')[0].getBoundingClientRect().top < windowHeight) {
        console.log($('.statistics')[0].getBoundingClientRect().top);
        [...$(".statistic__item")].forEach((item,index)=>{
          setTimeout(()=>{
            item.classList.remove('hidden');
          },(index+1)*250);
        })
        const triangleSm = $('.statistics .triangle-sm');
        const triangleLg = $('.statistics .triangle-lg');
        const offsetTop = windowHeight - $('.statistics')[0].getBoundingClientRect().top + windowHeight;
        const topSm = triangleSm.css('top');
        const topLg = triangleLg.css('top');
        console.log(topSm,topLg);
        const scrollProgress = offsetTop / (2 * windowHeight);
        triangleSm.css('top',`${windowHeight - scrollProgress * windowHeight/2}px`);
        triangleSm.css('bottom',`unset`);
        triangleLg.css('top',`${windowHeight - scrollProgress * windowHeight/2}px`);
        triangleLg.css('bottom',`unset`);
      }

      if (($('.history-diagram-item')[0].getBoundingClientRect().top < windowHeight) && (!counter)) {
        counter = true;
        $(".diargram-circle.volume-circle").removeClass('p0')
        $(".diargram-circle.volume-circle").addClass('p50');
        setTimeout(()=>{
          $(".diargram-circle.volume-circle").addClass('no-animation');
          $(".diargram-circle.volume-circle").addClass('p51');
          $(".diargram-circle.volume-circle").removeClass('p50');
        },1176);
        setTimeout(()=>{
          $(".diargram-circle.volume-circle").removeClass('p51');
          $(".diargram-circle.volume-circle").removeClass('no-animation');
          $(".diargram-circle.volume-circle").addClass('second-half');
          $(".diargram-circle.volume-circle").addClass('p85');
        },1190)
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
        const triangleSm = $('.register .triangle-sm');
        const triangleLg = $('.register .triangle-lg');
        const offsetTop = windowHeight - $('.register')[0].getBoundingClientRect().top + windowHeight;
        const topSm = triangleSm.css('top');
        const topLg = triangleLg.css('top');
        console.log(topSm,topLg);
        const scrollProgress = offsetTop / (2 * windowHeight);
        triangleSm.css('top',`${windowHeight + scrollProgress * windowHeight/2}px`);
        triangleSm.css('bottom',`unset`);
        triangleLg.css('top',`${windowHeight + scrollProgress * windowHeight/2}px`);
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
})
