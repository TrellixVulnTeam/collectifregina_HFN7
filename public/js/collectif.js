const slider = function () {
    const membersPhotos = document.querySelectorAll('.collectif__item');
    const membersDescriptions = document.querySelectorAll('.collectif__description');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const backgroundPhoto = document.querySelector('.collectif__item-background')
    const maxSlide = membersPhotos.length;
    let curSlide = 0;
  
    // Functions
    
    const goToSlide = function (slide) {
      membersPhotos.forEach(
        (s, i) => {
          if (i == slide) {
            setTimeout(function () {
              $(s).css("display", "grid").hide().fadeIn(800);
              $(backgroundPhoto).css("display", "grid").hide().fadeIn(800);
            }, 600);
          } else {
            $(s).fadeOut(800);
            $(backgroundPhoto).fadeOut(800);
          }
        }
      );
      membersDescriptions.forEach(
        (s, i) => {
          if (i == slide) {
            setTimeout(function () {
              $(s).css("display", "grid").hide().fadeIn(800);
            }, 800);
          } else {
            $(s).fadeOut(800);
          }
        }
      );
      curSlide = slide;
    };
  
    // Next slide
    const nextSlide = function () {
      if (curSlide == maxSlide - 1) {
        curSlide = 0;
      } else {
        curSlide++;
      }
      // -100%, 0%, 100%, 200%
      goToSlide(curSlide);
      activateDot(curSlide);
    };
  
    const prevSlide = function () {
      if (curSlide == 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
    };
  
    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
  
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prevSlide();
      e.key === 'ArrowRight' && nextSlide();
    });
  };

  slider();