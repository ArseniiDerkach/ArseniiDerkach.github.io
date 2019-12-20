$(document).ready(function(){
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
    window.addEventListener('scroll',()=>{
      const windowHeight = window.innerHeight;
      [...$('.animated-headline')].forEach((item,index)=>{
        const top = item.getBoundingClientRect().top;
        console.log(`${index}: ${top}`);
        if (top < windowHeight) {
          const diff = windowHeight - top;
          const progress = diff*2/windowHeight;
          const percent = progress > 1 ? 1 : progress;
          item.style.transform = `translateY(${100 - percent*100}px)`;
          item.style.opacity = `${percent}`;
        }
      })
      console.log(window.innerHeight);
    })
    $('.toggle-menu').click(function(){
      $(this).toggleClass('active');
      $('.header__menu').toggleClass('active');
    })
})
