$(document).ready(function(){
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
      action12: 'Sell',
      edge2 : {
        value: 10.554,
        currency: 'ETH'
      },
      action23: 'Buy',
      edge3 : {
        value: 0.00001,
        currency: 'BTC'
      },
      action13: 'Sell',
      profit: '0.0001'
    }
    const spinnerData2 = {
      edge1 : {
        value: 0.00002,
        currency: 'BTC'
      },
      action12: 'Buy',
      edge2 : {
        value: 12.554,
        currency: 'ETH'
      },
      action23: 'Sell',
      edge3 : {
        value: 0.00002,
        currency: 'BTC'
      },
      action13: 'Buy',
      profit: '0.1'
    }

    let currentSpinnerStep = 0;

    function spinnerStep(data) {
      const spinner = document.querySelector('.promo__spinner');
      const edge1 = spinner.querySelector('.spinner__edge_1');
      const edge2 = spinner.querySelector('.spinner__edge_2');
      const edge3 = spinner.querySelector('.spinner__edge_3');
      const edges = [edge1,edge2,edge3];
      const action12 = spinner.querySelector('.spinner__action_1-2');
      const action23 = spinner.querySelector('.spinner__action_2-3');
      const action13 = spinner.querySelector('.spinner__action_1-3');
      edges.forEach((item,index)=>{
        setTimeout(()=>{
          item.querySelector('.spinner__edge-question').classList.add('hidden');
          setTimeout(()=>{
            item.querySelector('.spinner__edge-value').innerText = data[`edge${index+1}`].value;
            item.querySelector('.spinner__edge-currency').innerText = data[`edge${index+1}`].currency;
            [].slice.call(item.querySelectorAll('.spinner__edge-text'),0).forEach(item=>{
              item.classList.remove('hidden');
            })
            if (index === 2) {
              spinner.querySelector('.spinner__last-profit-value').innerText = `+${data.profit}$`;
              spinner.querySelector('.spinner__last-profit').classList.remove('hidden');
            }
          },400)
        },1000*(index+1))
      })
      setTimeout(()=>{
        currentSpinnerStep++;
        [].slice.call(spinner.querySelectorAll('.spinner__edge-text'),0).forEach(item=>{
          item.classList.add('hidden');
        });
        spinner.querySelector('.spinner__last-profit').classList.add('hidden');
        spinner.querySelector('.spinner__image').style.transform = `rotate(${currentSpinnerStep*120}deg)`;
        setTimeout(()=>{
          [].slice.call(spinner.querySelectorAll('.spinner__edge-question'),0).forEach(item=>{
            item.classList.remove('hidden');
          })
        },600)
      },13000)
    }
    spinnerStep(spinnerData1);
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
        counter = true
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
  

    function runRobot() {
      const teeth = [...$('.robot-tooth')];
      const heights = teeth.map(item=>$(item).data('tooth-height'));
      teeth.forEach((item,i)=>{
        const random = Math.random()*10 - 5;
        $(item).height(heights[i]+random);
      })
    }
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
    setInterval(runRobot,100);
    $('.toggle-menu').click(function(){
      $(this).toggleClass('active');
      $('.header__menu').toggleClass('active');
    })
})
