/* script.js */
document.querySelector('.profile-pic').addEventListener('click', function() {
  // Redirect to user's profile page
  // Replace 'profile.html' with actual profile page URL
  window.location.href = '/tempalte/profile.html';
});
// Code for generating content for the buddies section
const buddiesContainer = document.querySelector('.buddies-container');

const buddiesData = [
{ name: 'Devanshi Chauhan', university: 'MPSTME', image: '/static/devanshi.png', text: 'Studious and fun loving', age: '21', status: 'Student', location: 'Kandivali' },
{ name: 'Khushi Patel', university: 'MPSTME', image: '/static/khushi.png', text: 'Most responsible person, loves going with the flow',age: '21', status: 'Student', location: 'Kandivali' },
{ name: 'Divya Bhendawadekar', university: 'MPSTME', image: '/static/divya.png', text: 'Always there for you, no matter what', age: '21', status: 'Student', location: 'Kandivali'},
{ name: 'Olashee Ranasingh', university: 'MPSTME', image: '/static/olashee.png', text: 'Loves trying out new foods and dishes', age: '21', status: 'Student', location: 'Kandivali' },
{ name: 'Prashil Vachhani', university: 'MPSTME', image: '/static/prashil.jpeg', text: 'Most calm headed person, always has a solution for everything', age: '21', status: 'Student', location: 'Kandivali' },
{ name: 'Dhrumil Burad', university: 'MPSTME', image: '/static/dhrumil.jpg', text: 'Binges all the newest tv shows and animes', age: '21', status: 'Student', location: 'Kandivali'},
{ name: 'Saachi Kaup', university: 'MPSTME', image: '/static/saachi.jpg', text: 'A Queen in Coding !', age: '21', status: 'Student', location: 'Kandivali'},
{ name: 'Shreya Govil', university: 'MPSTME', image: '/static/Shreya.jpg', text: 'Reach out for all your queries and questions', age: '21', status: 'Student', location: 'Kandivali'},
{ name: 'Mahima Arora', university: 'MPSTME', image: '/static/mahima.jpg', text: 'Fun to work with and dependable', age: '21', status: 'Student', location: 'Kandivali'},
{ name: 'Jyotir Jain', university: 'MPSTME', image: '/static/Jyotir.jpg', text: 'Loves anything and everything related to finance and tech', age: '21', status: 'Student', location: 'Kandivali'}
];

$.getJSON('/get-studentbuddy-list', data => {
  console.log('data', data);
  data.forEach(buddy => {
const buddyDiv = document.createElement('div');
buddyDiv.classList.add('buddy');

const image = document.createElement('img');
image.src = '/images/'+ buddy.image;
image.alt = buddy.name;

const nameHeading = document.createElement('h3');
nameHeading.textContent = buddy.name;

const universityText = document.createElement('h5');
universityText.textContent = buddy.description;

const textParagraph = document.createElement('p');
textParagraph.textContent = buddy.location;

 // Add click event listener to dynamically redirect to profile page with URL parameters
 buddyDiv.addEventListener('click', () => {
  const profilePageURL = `/home/studentbuddy_profile?id=${encodeURIComponent(buddy.id)}&name=${encodeURIComponent(buddy.name)}&description=${encodeURIComponent(buddy.description)}&image=${encodeURIComponent(buddy.image)}&age=${encodeURIComponent(buddy.age)}&status=${encodeURIComponent(buddy.status)}&location=${encodeURIComponent(buddy.location)}`;
  window.location.href = profilePageURL;
});

buddyDiv.appendChild(image);
buddyDiv.appendChild(nameHeading);
buddyDiv.appendChild(universityText);
buddyDiv.appendChild(textParagraph);

// Only on the sbprofile.html page, append age, status, and location to the buddyDiv
if (window.location.pathname.includes('sbprofile.html')) {
  const ageParagraph = document.createElement('p');
  ageParagraph.textContent = `Age: ${buddy.age}`;

  const statusParagraph = document.createElement('p');
  statusParagraph.textContent = `Status: ${buddy.status}`;

  const locationParagraph = document.createElement('p');
  locationParagraph.textContent = `Location: ${buddy.location}`;

  buddyDiv.appendChild(ageParagraph);
  buddyDiv.appendChild(statusParagraph);
  buddyDiv.appendChild(locationParagraph);
}

buddiesContainer.appendChild(buddyDiv);
  });
});
