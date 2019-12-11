$(document).ready(function(){
    $('.info__slider').slick({
        infinite: true,
        dots: true,
        arrows: false,
      });
    
    $('.about-us__slider').slick({
        infinite: true,
        slidesToShow: 3,
        arrow: true,
        prevArrow: $('.about-us__slider-prev'),
        nextArrow: $('.about-us__slider-next'),
        responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                arrow: false
              }
            }
          ]
      });
  });