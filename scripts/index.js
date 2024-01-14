
const setSessionStorage = (key, value) => {
    sessionStorage.setItem(key,JSON.stringify(value))
}

fetch("../json/pet-list.json")
.then((res) => {
  return res.json()
})
.then((obj) => {
    setSessionStorage("originalObj", obj)
    setSessionStorage("sortedObj", obj)
})

let speciesSession = JSON.parse(sessionStorage.getItem("species"))
let originalObjSession = JSON.parse(sessionStorage.getItem("originalObj"))
let sortedObj = JSON.parse(sessionStorage.getItem("sortedObj"))




const load = () =>{
    reset()
    let speciesSession = JSON.parse(sessionStorage.getItem("species"))
    let sortedObjSession = JSON.parse(sessionStorage.getItem("sortedObj"))
    if(speciesSession==null || speciesSession==""){
        if(sortedObjSession==null || sortedObjSession==""){
            originalObjSession.forEach(element => {
                createCard(element)
            })
        }else{
            sortedObjSession.forEach(element => {
                createCard(element)
            })
        }
    }else{
        if(sortedObjSession==null || sortedObjSession==""){
            originalObjSession.forEach(element => {
                if(speciesSession.includes(element.species)){
                    createCard(element)
                }
            }); 
        }else {
            sortedObjSession.forEach(element => {
                if(speciesSession.includes(element.species)){
                    createCard(element)
                }
            })
        }
        
    }
}

const createCard = (obj) => {
    // let box = document.createElement("div");
    // let p = document.createElement("p")
    // let span = document.createElement("span")

    // p.innerText = item.fname
    // span.innerText= item.species

    // // box추가
    // box.className = "box"
    // box.append(p,span)
    // document.querySelector("#container").append(box)

    let colBox = document.createElement("div");
    let gender = obj.gender=="male" ? '<i class="fa-solid fa-mars"></i>' :'<i class="fa-solid fa-venus"></i>';
    
    colBox.innerHTML= ` <div class="col">
                            <div class="card h-100">
                                <img src="${obj.img}" class="card-img-top" alt="${obj.name}">
                                <i class="fa-regular fa-heart"></i>
                                <div class="card-body">
                                    <h5 class="card-title">${obj.name} ${gender}</h5>
                                    <span>${obj.breed} | ${obj.age} years</span>
                                    <p class="card-text"><i class="fa-solid fa-location-dot"></i> ${obj.distance}km</p>
                                </div>
                            </div>
                        </div>`
    document.querySelector("#container").append(colBox)
}



const reset = () => {
    document.querySelector("#container").innerHTML = ""
}

const clear = () => {
    sessionStorage.removeItem("species")
    sessionStorage.removeItem("sortedObj")
    load()
}


const categorySearch = (e) =>{
    let clikedSpecies = e.target.dataset.species
    // If there is data in session storage
    if(speciesSession!=null ){
        // When user clidked "All"
        if(clikedSpecies==""){
            speciesSession=[]
            document.querySelectorAll(".species") .forEach(element => {
                speciesSession.push(element.dataset.species)
            });
            speciesSession.shift()
            setSessionStorage("species",speciesSession)
        }else{
            // If there is no species in the session storage as same as species that user slicked
            // It means new species should be added
            if(!speciesSession.includes(clikedSpecies)){
                speciesSession.push(clikedSpecies)
                setSessionStorage("species",speciesSession)
            
            // Remove category from session storage
            // If there is already species in session storage 
            // That category should be removed from session storage
            }else{
                speciesSession = speciesSession.filter(species => {
                    return species != clikedSpecies
                })
                
                setSessionStorage("species",speciesSession)
            }
        }
    // If there is no data in session storage
    }else{
        // Make new array adding species value that user clicked
        speciesSession = [clikedSpecies]
        setSessionStorage("species",speciesSession)
    }
    load();

}

const search = (e) => {
    reset()
    let inputValue = e.target.value.toUpperCase()
    obj.forEach(item => {
        let petName = item.fname.toUpperCase()
        if(petName.indexOf(inputValue)>-1){
           createCard(item)
        }
    });
}
// 

const sort = (e) => {
    switch (e.target.dataset.sort) {
        case "ascending":
            ascendingSort(sortedObj)
            e.target.dataset.sort = "descending";
            e.target.innerText = "Z-A"

        break;
        case "descending":
            descendingSort(sortedObj)
            e.target.dataset.sort = "ascending";
            e.target.innerText = "A-Z"
        break;
    }
    load()
}

const ascendingSort = (object) =>{
        object.sort((a,b) =>{
            // Regardless of letter case
            const nameA = (a.name).toUpperCase();
            const nameB = (b.name).toUpperCase();

            if(nameA > nameB) return 1;
            if(nameA < nameB) return -1;
            if(nameA === nameB) return 0;
        })
    setSessionStorage("sortedObj", object)
}

const descendingSort = (object) =>{
        object.sort((a,b) =>{
            // Regardless of letter case
            const nameA = (a.name).toUpperCase();
            const nameB = (b.name).toUpperCase();

            if(nameA < nameB) return 1;
            if(nameA > nameB) return -1;
            if(nameA === nameB) return 0;
        })
    setSessionStorage("sortedObj", object)
}


window.addEventListener("load", load)
document.querySelector("#clear").addEventListener("click",clear)
