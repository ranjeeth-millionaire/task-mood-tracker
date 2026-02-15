// ==================== VARIABLES ====================
// Get references to HTML elements we'll interact with
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const moodButtons = document.querySelectorAll('.mood-btn');
const showDataBtn = document.getElementById('showDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const dataDisplay = document.getElementById('dataDisplay');
const moodData = document.getElementById('moodData');
const tasksData = document.getElementById('tasksData');
const rawData = document.getElementById('rawData');

// Array to store all tasks
let tasks = [];
// Variable to store selected mood
let selectedMood = null;

// ==================== LOAD DATA ON PAGE LOAD ====================
// When page loads, get data from localStorage
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    displayTasks();
    updateEmptyState();
});

// ==================== MOOD SELECTOR ====================
// Add click event to each mood button
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'active' class from all buttons
        moodButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add 'active' class to clicked button
        button.classList.add('active');
        
        // Save the selected mood
        selectedMood = button.getAttribute('data-mood');
        
        // Save to localStorage
        saveMood();
    });
});

// ==================== ADD TASK ====================
// When "Add Task" button is clicked
addTaskBtn.addEventListener('click', addTask);

// Also add task when Enter key is pressed in input
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Check if input is not empty
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Create task object
    const task = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    // Add task to array
    tasks.push(task);

    // Clear input field
    taskInput.value = '';

    // Update display
    displayTasks();
    updateEmptyState();

    // Save to localStorage
    saveTasks();
}

// ==================== DISPLAY TASKS ====================
// Function to show all tasks on screen
function displayTasks() {
    // Clear current list
    taskList.innerHTML = '';

    // Loop through each task and create HTML
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Create task HTML structure
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})">
            </div>
            <span class="task-text ${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>
            <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
                ✕
            </button>
        `;

        // Add to list
        taskList.appendChild(li);
    });
}

// ==================== TOGGLE TASK COMPLETION ====================
// Function to mark task as completed or not completed
function toggleTask(id) {
    // Find the task by ID
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        // Toggle completed status
        task.completed = !task.completed;
        
        // Update display
        displayTasks();
        
        // Save changes
        saveTasks();
    }
}

// ==================== DELETE TASK ====================
// Function to delete a task
function deleteTask(id) {
    // Filter out the task with matching ID
    tasks = tasks.filter(t => t.id !== id);
    
    // Update display
    displayTasks();
    updateEmptyState();
    
    // Save changes
    saveTasks();
}

// ==================== EMPTY STATE ====================
// Show or hide "no tasks" message
function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// ==================== LOCALSTORAGE - SAVE ====================
// Save tasks to browser storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Save mood to browser storage
function saveMood() {
    localStorage.setItem('mood', selectedMood);
}

// ==================== LOCALSTORAGE - LOAD ====================
// Load saved data from browser storage
function loadData() {
    // Load tasks
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    // Load mood
    const savedMood = localStorage.getItem('mood');
    if (savedMood) {
        selectedMood = savedMood;
        // Set the active button
        const moodBtn = document.querySelector(`[data-mood="${savedMood}"]`);
        if (moodBtn) {
            moodBtn.classList.add('active');
        }
    }
}

// ==================== DATA VIEWER ====================
// Show saved data button
showDataBtn.addEventListener('click', () => {
    // Toggle display
    if (dataDisplay.style.display === 'none') {
        displaySavedData();
        dataDisplay.style.display = 'block';
        showDataBtn.textContent = '🔼 Hide Saved Data';
    } else {
        dataDisplay.style.display = 'none';
        showDataBtn.textContent = '📊 Show Saved Data';
    }
});

// Clear all data button
clearDataBtn.addEventListener('click', () => {
    // Ask for confirmation
    const confirmed = confirm('⚠️ Are you sure you want to delete ALL your data? This cannot be undone!');
    
    if (confirmed) {
        // Clear localStorage
        localStorage.clear();
        
        // Reset variables
        tasks = [];
        selectedMood = null;
        
        // Update display
        displayTasks();
        updateEmptyState();
        
        // Remove active mood
        moodButtons.forEach(btn => btn.classList.remove('active'));
        
        // Hide data display
        dataDisplay.style.display = 'none';
        showDataBtn.textContent = '📊 Show Saved Data';
        
        alert('✅ All data has been cleared!');
    }
});

// Function to display saved data in readable format
function displaySavedData() {
    // ========== MOOD DATA ==========
    if (selectedMood) {
        const moodEmojis = {
            'amazing': '😄',
            'good': '🙂',
            'okay': '😐',
            'bad': '😔',
            'terrible': '😢'
        };
        
        moodData.innerHTML = `
            <div class="mood-display">
                <span class="mood-emoji">${moodEmojis[selectedMood]}</span>
                <span class="mood-text">${selectedMood}</span>
            </div>
        `;
    } else {
        moodData.innerHTML = '<div class="no-data">No mood selected yet</div>';
    }

    // ========== TASKS DATA ==========
    if (tasks.length > 0) {
        let tasksHTML = '';
        
        tasks.forEach((task, index) => {
            const date = new Date(task.createdAt);
            const formattedDate = date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const badge = task.completed 
                ? '<span class="completed-badge">✓ DONE</span>' 
                : '<span class="pending-badge">⏳ PENDING</span>';
            
            tasksHTML += `
                <div class="task-info">
                    <strong>Task ${index + 1}:</strong> ${task.text} ${badge}<br>
                    <small style="color: var(--text-light);">
                        Created: ${formattedDate} | ID: ${task.id}
                    </small>
                </div>
            `;
        });
        
        tasksData.innerHTML = tasksHTML;
    } else {
        tasksData.innerHTML = '<div class="no-data">No tasks saved yet</div>';
    }

    // ========== RAW JSON DATA ==========
    const allData = {
        mood: selectedMood,
        tasks: tasks,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        pendingTasks: tasks.filter(t => !t.completed).length
    };
    
    // Format JSON nicely with 2-space indentation
    rawData.textContent = JSON.stringify(allData, null, 2);
}
