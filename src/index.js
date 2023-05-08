let pokemonCardsDiv = document.querySelector('.pokemon-cards')

// Fetch the data
fetch('http://localhost:3000/pokemon')
  .then((resp) => resp.json())
  .then(pokemonObjects => {
    pokemonObjects.forEach(pokemon => renderPokemon(pokemon))
  })

// Render (display) that data
function renderPokemon(pokemon) {
  // create a div to hold our pokemon info
  let div = document.createElement('div')
  div.setAttribute("id", `pokemon-${pokemon.id}`)
  div.classList.add('pokemon-card')

  // create an img element and add src
  let img = document.createElement('img')
  img.src = pokemon.imageURL
  div.appendChild(img)

  // create an h1 to show the name
  let name = document.createElement('h1')
  name.textContent = pokemon.name
  div.appendChild(name)

  // create a p to show the type / likes
  let p = document.createElement('p')
  p.textContent = pokemon.type
  div.append(p)

  let likes = document.createElement('p')
  likes.textContent = pokemon.likes
  div.append(likes)
  
  // create our button for LIKES
  let likeBtn = document.createElement('button')
  likeBtn.textContent = 'Like'
  // Attach event listener for our PATCH request
  likeBtn.addEventListener('click', () => {
    // optimistic rendering 
    // - making the update before we have the updated data from the server
    // likes.textContent = parseInt(likes.textContent) + 1

    fetch(`http://localhost:3000/pokemon/${pokemon.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: parseInt(likes.textContent) + 1
      })
    })
      .then(resp => resp.json())
      .then(pokemon => {
        console.log(pokemon)
        // pessimistic rendering - waiting until we definitely have the data
        likes.textContent = pokemon.likes
      })
  })
  
  // create our button for DELETE
  let deleteBtn = document.createElement('button')
  deleteBtn.textContent = 'Delete'
  // Attach event listener for our DELETE request
  deleteBtn.addEventListener('click', () => handleDelete(pokemon))
  
  // create div to hold buttons
  let buttonsDiv = document.createElement('div')
  buttonsDiv.classList.add('btns-div')
  buttonsDiv.append(likeBtn)
  buttonsDiv.append(deleteBtn)
  div.append(buttonsDiv)

  // append our new card to the DOM
  pokemonCardsDiv.appendChild(div)
}

function handleDelete(pokemon) {
  // if (window.confirm('Are you sure you want to delete this pokemon?')) {
    
  // }

  // first we want to send our delete request
  fetch(`http://localhost:3000/pokemon/${pokemon.id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        // then we know it successfully deleted here
        document.querySelector(`#pokemon-${pokemon.id}`).remove()
      }
    })

}