const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const colMatchList = document.getElementById('colMatch-list');

const searchUsers = async searchText => {
    const res = await fetch('http://localhost:3000/events');
    const users = await res.json();
    
    console.log(users);

    let matches = users.filter(user => {
        const regex = new RegExp(`^${searchText}`,'gi');
        return user.eventName.match(regex);
    });
    if(searchText.length == 0){
        matches = [];
    }
    outputHtlm(matches);
}

const outputHtlm = matches => {
    if(matches.length > 0){
        const html = matches.map(match => `
        <div class="match-list">
            <div>
                <a href= '/cities/${match.city}/${match._id}'>${match.eventName}</a>
                <p>${match.description.slice(0,15)}...</p>
            </div>
        </div>
        `).join('');

        matchList.innerHTML = html;
    }else{
        const html = '';
        matchList.innerHTML = html
    }
}


search.addEventListener('input', ()=>searchUsers(search.value));
// collegeSearch.addEventListener('input', ()=>searchCollegeEvents(search.value));
