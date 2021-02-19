
const search = document.getElementById('search');
const matchedEvents = document.getElementById('matched-events');

const searchEvents = async searchText => {
  const res = await fetch('http://localhost:3000/events');
    console.log(res.json());
    

  let matches = users.filter(user => {
      const regex = new RegExp(`^${searchText}`,'gi');
      return user.firstName.match(regex);
  });
  if(searchText.length == 0){
      matches = [];
  }
  outputHtlm(matches);
}

searchEvents();