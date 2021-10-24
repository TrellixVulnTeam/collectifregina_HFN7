const galleryModal = function () {
    const modal = document.getElementById('modal');
  
    const img = document.querySelectorAll('.gallery__img');
    const modalImg = document.getElementById('img01');
    const captionText = document.getElementById('caption');
  
    img.forEach(function (item, id) {
      item.addEventListener('click', function () {
        modal.style.display = "block";
        newSrc = `/img/galerie/${item.id}-big.jpg`
        modalImg.setAttribute('src', newSrc);
        captionText.innerHTML = this.alt;
      })
    })
  }

  galleryModal();