/* script.js */
document.querySelector('.profile-pic').addEventListener('click', function() {
    // Redirect to user's profile page
    // Replace 'profile.html' with actual profile page URL
    window.location.href = 'profile.html';
  });

document.addEventListener("DOMContentLoaded", function() {
    const articleContainer = document.querySelector('.article1container');
    
    const article1Data = [
      { image: '/static/viewchecklist.png', text: 'Viewing Checklist', link: 'viewingchecklist.html' },
      { image: '/static/viewchecklist.png', text: 'Viewing Checklist', link: 'viewingchecklist.html' },
      { image: '/static/viewchecklist.png', text: 'Viewing Checklist', link: 'viewingchecklist.html' },
      { image: '/static/viewchecklist.png', text: 'Viewing Checklist', link: 'viewingchecklist.html' },
    ];
    
    article1Data.forEach(article1 => {
      const articleDiv = document.createElement('div');
      articleDiv.classList.add('article1');
    
      const image = document.createElement('img');
      image.src = article1.image;
      image.alt = article1.text;
      image.style.maxWidth = '100px'; // Adjust the size as needed
      image.style.maxHeight = '100px'; // Adjust the size as needed
    
      const nameHeading = document.createElement('h3');
      nameHeading.textContent = article1.text;
    
      const textAnchor = document.createElement('a');
      textAnchor.textContent = 'Read more';
      textAnchor.href = article1.link;
    
      articleDiv.appendChild(image);
      articleDiv.appendChild(nameHeading);
      articleDiv.appendChild(textAnchor);
    
      articleContainer.appendChild(articleDiv);
    });
  });
  
  