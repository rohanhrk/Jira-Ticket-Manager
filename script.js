'use strict';//stop code while something wrong in code
// a=10;
let filterOptions = document.querySelectorAll(".filter-colors__container");
let modalFilters = document.querySelectorAll(".modal_filters");
let mainContainer = document.querySelector(".main-container");
let modalContainer = document.querySelector(".modal_container");
let addBtn = document.querySelector(".add");
let removeBtn = document.querySelector(".remove");
let descBox = document.querySelector(".desc-box");
let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let flag = false;
let deleteState = false;
let cColor = colors[colors.length - 1];
let taskArr = [];

//  reload -> according to state re-render the ui 
if (localStorage.getItem("allTasks")) {
    taskArr = JSON.parse(localStorage.getItem("allTasks"));
    for (let i = 0; i < taskArr.length; i++) {
        let { task, color, id } = taskArr[i];
        createTicket(task, color, id);
    }
}

//clink in '+' button => modal container visible
addBtn.addEventListener("click", function () {
    if (flag == false) {
        modalContainer.style.display = "flex";
        // mainContainer.style.filter = "blur(1px)";
    } else {
        modalContainer.style.display = "none";
        // mainContainer.style.filter = "blur(0px)";
    }
    flag = !flag;//flag negated
});
//modal filter => click in any color => add border
for (let i = 0; i < modalFilters.length; i++) {
    modalFilters[i].addEventListener("click", function () {
        modalFilters.forEach(function (modalFilter) {
            // classList remove-> 
            modalFilter.classList.remove("border");
        })
        modalFilters[i].classList.add("border");
        cColor = modalFilters[i].classList[1];
    })
}
// text area 
descBox.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        let task = descBox.value;//store text in task
        console.log("task is ", task, "cColor ", cColor);

        // tiket create 
        createTicket(task, cColor);

        //  clean up 
        cColor = colors[colors.length - 1];//by defaul border create in black color
        modalContainer.style.display = "none";//invisibe modal container
        flag = false;
        descBox.value = "";//empty description box
    }
})

//create ticket function
function createTicket(task, cColor, myid) {
    let ticketContainer = document.createElement("div");//create div
    ticketContainer.setAttribute("class", "ticket-container");//set class = "ticket-container"
    let id = myid || shortid();
    ticketContainer.innerHTML = `<div class="ticket-color ${cColor}"></div>
       <div class="ticket_sub-container">
             <h3 class="ticket-id">#${id}</h3>
             <div class="ticket-desc">${task}</div>
        </div>`;

    mainContainer.appendChild(ticketContainer);//append ticket container in main container
    let colorStripElement = ticketContainer.querySelector(".ticket-color");
    if (!myid) {
        // 1. 
        taskArr.push({
            color: cColor,
            id: id,
            task: task
        })
        localStorage.setItem("allTasks", JSON.stringify(taskArr));
    }
    handleColorChange(colorStripElement);
    handleDeleteContainer(ticketContainer);
}

// after click change color of ticket 
function handleColorChange(colorStripElement) {
    colorStripElement.addEventListener("click", function () {
        // delete state 
        let classes = colorStripElement.classList;
        let initColor = classes[1];
        let idx = colors.indexOf(initColor);
        let newidx = (idx + 1) % 4;
        let newColor = colors[newidx];
        colorStripElement.classList.remove(initColor);
        colorStripElement.classList.add(newColor);
        //  change color in  localstorage on tap
        changeColorInStore(colorStripElement, newColor);
    })
}

//cilck 'X' button => change bacground color of remove button
removeBtn.addEventListener("click", function () {
    if (deleteState == false) {
        removeBtn.style.backgroundColor = "grey";
    } else {
        removeBtn.style.backgroundColor = "rgba(0, 2, 0, 0.200)";
    }
    deleteState = !deleteState;
});
//logic of delete ticket container
function handleDeleteContainer(ticketContainer) {
    ticketContainer.addEventListener("click", function () {
        if (deleteState == true) {
            //  local storage
            let elem = ticketContainer.querySelector(".ticket-id");
            let toBeDeletedId = elem.innerText.slice(1);
            // console.log(toBeDeletedId);
            let idx = taskArr.findIndex(function (ticket) {
                return ticket.id == toBeDeletedId;
            })
            // console.log(idx);
            taskArr.splice(idx, 1);//remove from local storage
            localStorage.setItem("allTasks", JSON.stringify(taskArr));//update local storage
            ticketContainer.remove();// remove from UI
        }
    });

}
function changeColorInStore(colorStripElement, newColor) {
    //  ticket sub container 
    let ticketSubcontainerElem = colorStripElement.parentNode.children[1];
    // unique id element
    let idElem = ticketSubcontainerElem.children[0];
    //  id -> # 
    let id = idElem.innerText.slice(1);
    //  idx
    let idx = taskArr.findIndex(function (ticket) {
        return ticket.id == id;
    })
    // color change 
    taskArr[idx].color = newColor;
    localStorage.setItem("allTasks", JSON.stringify(taskArr));
}