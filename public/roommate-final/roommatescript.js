// Code for generating content for the buddies section
const buddiesContainer = document.querySelector('.buddies-container');

$.getJSON('/find-roommate-list', data => {
    console.log('data', data);
    data.forEach(buddy => {
        const buddyDiv = document.createElement('div');
        buddyDiv.classList.add('buddy');

        const image = document.createElement('img');
        image.src = '/images/'+buddy.image;
        image.alt = buddy.name;

        const nameHeading = document.createElement('h3');
        nameHeading.textContent = buddy.name;

        const universityText = document.createElement('h5');
        universityText.textContent = buddy.university;

        const eatingParagraph = document.createElement('p');
        eatingParagraph.textContent = buddy['eating-preferences'];

        // Add click event listener to dynamically redirect to profile page with URL parameters
        buddyDiv.addEventListener('click', () => {
            const profilePageURL = `/home/roommateprofile?id=${encodeURIComponent(buddy.id)}&name=${encodeURIComponent(buddy.name)}&university=${encodeURIComponent(buddy.university)}&eating=${encodeURIComponent(buddy['eating-preferences'])}&image=${encodeURIComponent(buddy.image)}&age=${encodeURIComponent(buddy.age)}&status=${encodeURIComponent(buddy.status)}&location=${encodeURIComponent(buddy.location)}&sleepingHabits=${encodeURIComponent(buddy['sleeping-habits'])}&hobbies=${encodeURIComponent(buddy.hobbies)}`;
            window.location.href = profilePageURL;
        });

        buddyDiv.appendChild(image);
        buddyDiv.appendChild(nameHeading);
        buddyDiv.appendChild(universityText);
        buddyDiv.appendChild(eatingParagraph);

        // Only on the sbprofile.html page, append age, status, and location to the buddyDiv
        if (window.location.pathname.includes('roommateprofile.html')) {
            const ageParagraph = document.createElement('p');
            ageParagraph.textContent = `Age: ${buddy.age}`;

            const statusParagraph = document.createElement('p');
            statusParagraph.textContent = `Status: ${buddy.status}`;

            const locationParagraph = document.createElement('p');
            locationParagraph.textContent = `Location: ${buddy.location}`;

            const sleepingHabitsParagraph = document.createElement('p');
            sleepingHabitsParagraph.textContent = `Sleeping Habits: ${buddy.sleepingHabits}`;

            const hobbiesParagraph = document.createElement('p');
            hobbiesParagraph.textContent = `Hobbies: ${buddy.hobbies}`;

            buddyDiv.appendChild(ageParagraph);
            buddyDiv.appendChild(statusParagraph);
            buddyDiv.appendChild(locationParagraph);
            buddyDiv.appendChild(sleepingHabitsParagraph);
            buddyDiv.appendChild(hobbiesParagraph);
        }

        buddiesContainer.appendChild(buddyDiv);
    });
});
