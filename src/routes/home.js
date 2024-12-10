const router = require('express').Router();
const User = require('../config');

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(User.getItem('tasks'));
    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task))
    }
    displayTasks();
    updateStats();
})

let tasks = [];

const savedTasks = () => {
    User.setItem("tasks", JSON.stringify(tasks));
}


const addTask = () => {
    const taskInput = document.getElementById("taskInput").value;
    const taskDescription = document.getElementById("Description").value;
    const taskDate = document.getElementById("dueDate").value;
    const taskDueDate = new Date(taskDate).toDateString();

    if (!taskInput) {
        alert("Task cannot be empty");
        return;
    }
    
    if (taskInput.trim() === "") {
        alert("Task cannot be empty");
        return;
    }
    
    const task = {
        title: taskInput,
        description: taskDescription,
        dueDate: taskDueDate,
        completed: false
    };

    if (taskDescription) {
        task.description = taskDescription;
    } else {
        task.description = "";
    }

    if (taskDate) {
        task.dueDate = taskDueDate;
    } else {
        task.dueDate = null;
    }

    tasks.push(task);
    displayTasks();
    clearInput();
    updateStats();
    savedTasks();

}

const clearInput = () => {
    document.getElementById("taskInput").value = "";
    document.getElementById("Description").value = "";
}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    displayTasks();
    clearInput();
    updateStats();
    savedTasks();
}

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput").value = tasks[index].title;
    const taskDescription = document.getElementById("Description").value = tasks[index].description;
    const taskDate = document.getElementById("dueDate").value = tasks[index].dueDate;
    document.getElementById("Description").focus();
    document.getElementById("taskInput").focus();
    togglePopup(taskInput, taskDescription);
    tasks.splice(index, 1);
    displayTasks();
    updateStats();
    savedTasks();
}

const toggleTaskComplete = (index) => {
    tasks[index].completed =!tasks[index].completed;
    displayTasks();
    updateStats();
    savedTasks();
}


const displayTasks = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                  <input type="checkbox" class="checkbox" ${task.completed? 'checked' : ''}>
                  <div class="taskbox">
                    <h3 id="title">${task.title}</h3>
                    <p id="description">${task.description}</p>
                    <p id="dueDate">${task.dueDate? `Due: ${task.dueDate}` : ''}</p>
                  </div>
                </div>
                <div class="icons">
                    <img src="images/edit2.png" onClick="editTask(${index})"/>
                    <img src="images/delete2.png" onClick="deleteTask(${index})"/>
                </div>
            </div>
        `;

        listItem.addEventListener('change', ()=> toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
}

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressBarFiller = (completedTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progressBarFiller');
    progressBar.style.width = `${progressBarFiller}%`;

    document.getElementById('completed-tasks').innerText = `${completedTasks} / ${totalTasks}`;

    if (tasks.length && completedTasks === totalTasks) {
        blastConfetti();
        document.getElementById("congrats").innerText = `Congratulations! Completed your tasks for the day!`;
    } else {
        document.getElementById("congrats").innerText = "";
    }
    
};


// Middleware for parsing JSON request bodies
document.getElementById("newTask").addEventListener("click", function(e) {
    e.preventDefault();

    addTask();
})

function myDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  function togglePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}

const blastConfetti = () => {
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
}

// All tasks

function allTasksBtn() {
    allTasks();
}

const allTasks = () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    displayTasks();
    updateStats();
    savedTasks = tasks;
}

// Filter tasks based on due date

function todayTasksBtn() {
    todayTasks();
}

const todayTasks = () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const todayTasks = tasks.filter(task => task.dueDate === null ||  task.dueDate === new Date().toDateString());
    tasks = todayTasks;
    displayTasks();
    updateStats();
    savedTasks = todayTasks;
}

function upcomingTasksBtn() {
    upcomingTasks();
}

const upcomingTasks = () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const upcomingTasks = tasks.filter(task => task.dueDate > new Date().toDateString());
    tasks = upcomingTasks;
    displayTasks();
    updateStats();
}

// Filter tasks based on completed status

function completedTasksBtn() {
    completedTasks();
}

const completedTasks = () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const completedTasks = tasks.filter(task => task.completed);
    tasks = completedTasks;
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="taskComplete">
                <div class="task-completed">
                    <h3 id="title">${task.title}</h3>
                    <p id="description">${task.description}</p>
                    <p id="dueDate">${task.dueDate? `Due: ${task.dueDate}` : ''}</p>
                </div>
            </div>
        `;

        taskList.appendChild(listItem);
    });
    updateStats();
    savedTasks = completedTasks; completed
}

function overdueTasksBtn() {
    overdueTasks();
}

const overdueTasks = () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const overdueTasks = tasks.filter(task => task.dueDate < new Date().toDateString() && task.completed === false);
    tasks = overdueTasks;
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                  <input type="checkbox" class="checkbox" ${task.completed? 'checked' : ''}>
                  <div class="taskbox">
                    <h3 id="title">${task.title}</h3>
                    <p id="description">${task.description}</p>
                    <p id="dueDate">${task.dueDate? `Due: ${task.dueDate}` : ''}</p>
                  </div>
                </div>
                <div class="icons">
                    <img src="images/edit2.png" onClick="editTask(${index})"/>
                    <img src="images/delete2.png" onClick="deleteTask(${index})"/>
                </div>
            </div>
        `;

        listItem.addEventListener('change', ()=> toggleTaskComplete(index));
        taskList.appendChild(listItem);
    })
    updateStats();
}