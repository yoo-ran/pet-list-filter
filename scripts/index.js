
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
            console.log(document.querySelectorAll(".species"))
            document.querySelectorAll(".species").forEach(btn=>{
                if(speciesSession.includes(btn.dataset.species)){
                    console.log(btn);
                    btn.classList.add("clickedBtn")
                }
            })
        }
        
    }
}

const createCard = (obj) => {
    let colBox = document.createElement("div");
    let gender = obj.gender=="male" ? '<i class="fa-solid fa-mars"></i>' :'<i class="fa-solid fa-venus"></i>';
    
    colBox.innerHTML= ` <div class="col card-col">
                            <div class="card h-100">
                                <img src="${obj.img}" class="card-img-top" alt="${obj.name}">
                                <i class="fa-regular fa-heart"></i>
                                <div class="card-body">
                                    <h4 class="card-title">${obj.name} ${gender}</h4>
                                    <p class="card-text breedText">${obj.breed} | ${obj.age} years</p>
                                    <p class="card-text distanceText"><i class="fa-solid fa-location-dot"></i> ${obj.distance}km</p>
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
    document.querySelector("#search").value ="";
    load()
}


const categorySearch = (e) =>{
    let clikedSpecies = e.target.dataset.species
    let speciesSession = JSON.parse(sessionStorage.getItem("species"))
    console.log(e.target.classList);
    e.target.classList.toggle("clickedBtn")
    // If there is data in session storage
    if(speciesSession!=null ){
        // When user clidked "All"
        if(clikedSpecies==""){
            speciesSession=[]
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
    let speciesSessionNull = [];
    document.querySelectorAll(".species").forEach(species =>{
        speciesSessionNull.push(species.dataset.species)
    })
    speciesSessionNull.shift()
    let speciesSession = JSON.parse(sessionStorage.getItem("species"))==null ? speciesSessionNull : JSON.parse(sessionStorage.getItem("species"))
    
    let inputValue = e.target.value.toUpperCase();
    sortedObj.forEach(item => {
        for(let i=0;i<speciesSession.length;i++){
            if(item.species==speciesSession[i]){
                let petName = item.name.toUpperCase()
                if(petName.indexOf(inputValue)>-1){
                   createCard(item)
                }
            }
        }
    });
}
// 

const sort = (e) => {
    switch (e.target.dataset.sort) {
        case "ascending":
            ascendingSort(sortedObj)
            e.target.dataset.sort = "descending";
            e.target.innerText = "Z-A";
            e.target.classList.replace("ascending","descending")
        break;
        case "descending":
            descendingSort(sortedObj)
            e.target.dataset.sort = "ascending";
            e.target.innerText = "A-Z";
            e.target.classList.replace("descending","ascending")

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
