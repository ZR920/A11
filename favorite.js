const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const ALL_USERS = BASE_URL + "/api/v1/users/"
const profilePanel = document.querySelector("#profile-panel")
const personData = JSON.parse(localStorage.getItem('favoritePeople'))
const gender = {
  female: '&nbsp;<i class="fas fa-venus"></i>',
  male: '&nbsp;<i class="fas fa-mars"></i>'
}
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-submit-input')
const modal = document.querySelector('#profile-modal')


function renderpersonData (data) {
  let profileContent = ""
  data.forEach((item) => {
    profileContent += `
      <div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top" alt="...">
            <div class="card-body p-0 text-center mb-2">
              <h5 class="card-title mt-2"><em>${item.name}</em></h5>
              <button class="btn btn-outline-danger btn-show-profile" data-toggle="modal" id="view-more" data-target="#profile-modal" data-id="${item.id}">More</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  profilePanel.innerHTML = profileContent
}

function showProfileModal (id) {
  const modalTitle = document.querySelector("#profile-modal-title")
  const modalImage = document.querySelector("#profile-modal-image")
  const modalData = document.querySelector("#profile-modal-info")
  const modalFooter = document.querySelector('.modal-footer')
  let infoData = ""

  axios.get(ALL_USERS + id).then((response) => {
    const data = response.data
    if (data.gender === "male") {
      modalTitle.innerHTML = `${data.name} ${data.surname}${gender.male}`
    } else {
      modalTitle.innerHTML = `${data.name} ${data.surname}${gender.female}`
    }
    modalImage.innerHTML = `<img src="${data.avatar}" alt="image-poster" class="modal-avatar"></img>`
    infoData = `
      <p>Birthday: ${data.birthday}</p>
      <p>Age: ${data.age}</p>
      <p>Region: ${data.region}</p>
      <p>E-mail: ${data.email}</p>`
    modalData.innerHTML = infoData
    modalFooter.innerHTML = `
    <button type="button" class="btn btn-danger font-weight-bolder" data-dismiss="modal" id="modal-remove-favorite" data-id=${data.id}>Remove favorite</button>
    <button type="button" class="btn btn-light font-weight-bolder" data-dismiss="modal" id="modal-close">Close</button>`
  })
}

function searchPerson () {
  const keyword = searchInput.value.trim().toLowerCase()
  filteredPeople = personData.filter(person => person.name.trim().toLowerCase().includes(keyword))
  if (filteredPeople.length === 0) {
    return alert('Cannot find movies with keyword: ' + keyword)
  }
  renderPaginator(filteredPeople.length)
  renderPersonData(getPersonByPage(1))
}

function removeFromFavorite(id) {
  if(!personData) return
  const personIndex = personData.findIndex((person) => person.id === id)
  if(personIndex === -1) return
  personData.splice(personIndex,1)
  localStorage.setItem('favoritePeople', JSON.stringify(personData))
  renderpersonData(personData)
}

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  if (searchInput.value.length === 0) return
  searchPerson()
})

searchInput.addEventListener('keyup', event => {
  if (event.keyCode === 8 || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
    searchPerson()
  }
})

profilePanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches("#view-more")) {
    showProfileModal(event.target.dataset.id)
  }
})

modal.addEventListener('click', function onModalClicked(event) {
  if (event.target.matches('#modal-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderpersonData(personData)