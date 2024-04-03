function toggleImages(trigger) {
    var totalimage = document.getElementById('totalimage').value
    // alert(totalimage)
    var additionalImages = trigger.previousElementSibling;
    if (additionalImages.style.display === 'none') {
      additionalImages.style.display = 'block';
      trigger.innerText = 'Hide additional images';
    } else {
      additionalImages.style.display = 'none';
      trigger.innerText = totalimage + ' more image';
    }
  }