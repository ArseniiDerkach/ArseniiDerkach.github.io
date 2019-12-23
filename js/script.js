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
