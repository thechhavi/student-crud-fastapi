// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const studentModal = document.getElementById('studentModal');
const deleteModal = document.getElementById('deleteModal');
const studentForm = document.getElementById('studentForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');
const studentTableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const tableContainer = document.getElementById('tableContainer');

// State
let students = [];
let deleteId = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', init);

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
});

studentForm.addEventListener('submit', handleStudentSubmit);
searchInput.addEventListener('input', handleSearch);

// Add ripple effect
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple') || e.target.closest('.ripple')) {
        const btn = e.target.classList.contains('ripple') ? e.target : e.target.closest('.ripple');
        const x = e.clientX - btn.getBoundingClientRect().left;
        const y = e.clientY - btn.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple-effect';
        
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
});

function init() {
    fetchStudents();
}

// API Calls
async function fetchStudents() {
    showLoading();
    try {
        const response = await fetch('/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        students = await response.json();
        renderTable(students);
        updateDashboardStats();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleStudentSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        age: parseInt(document.getElementById('age').value)
    };
    
    showLoading();
    try {
        const url = id ? `/students/${id}` : '/students';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'An error occurred');
        }
        
        showToast(`Student ${id ? 'Updated' : 'Added'} Successfully`, 'success');
        closeStudentModal();
        fetchStudents();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function confirmDelete() {
    if (!deleteId) return;
    
    showLoading();
    try {
        const response = await fetch(`/students/${deleteId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete student');
        
        showToast('Student Deleted Successfully', 'success');
        closeDeleteModal();
        fetchStudents();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

// UI Functions
function renderTable(data) {
    studentTableBody.innerHTML = '';
    
    if (data.length === 0) {
        emptyState.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    
    data.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${student.id}</td>
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td><span class="badge">${student.course}</span></td>
            <td>${student.age}</td>
            <td>
                <button class="btn-icon edit" onclick="openEditModal(${student.id})" title="Edit">
                    <span class="material-icons-outlined">edit</span>
                </button>
                <button class="btn-icon delete" onclick="openDeleteModal(${student.id})" title="Delete">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });
}

function updateDashboardStats() {
    document.getElementById('totalStudentsCount').textContent = students.length;
    
    const courses = new Set(students.map(s => s.course.toLowerCase()));
    document.getElementById('totalCoursesCount').textContent = courses.size;
    
    const totalAge = students.reduce((sum, student) => sum + student.age, 0);
    const avgAge = students.length ? Math.round(totalAge / students.length) : 0;
    document.getElementById('avgAgeCount').textContent = avgAge;
    
    const recentCount = Math.min(students.length, 5);
    document.getElementById('recentlyAddedCount').textContent = recentCount > 0 ? `+${recentCount}` : '0';
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.course.toLowerCase().includes(term)
    );
    renderTable(filtered);
}

// Modals
function openAddStudentModal() {
    document.getElementById('modalTitle').textContent = 'Add Student';
    document.getElementById('saveBtn').textContent = 'Save Student';
    studentForm.reset();
    document.getElementById('studentId').value = '';
    studentModal.classList.add('active');
}

function openEditModal(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    document.getElementById('modalTitle').textContent = 'Update Student';
    document.getElementById('saveBtn').textContent = 'Update Student';
    
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('course').value = student.course;
    document.getElementById('age').value = student.age;
    
    studentModal.classList.add('active');
}

function closeStudentModal() {
    studentModal.classList.remove('active');
}

function openDeleteModal(id) {
    deleteId = id;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteId = null;
    deleteModal.classList.remove('active');
}

// Utils
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check_circle' : 'error';
    
    toast.innerHTML = `
        <span class="material-icons-outlined toast-icon">${icon}</span>
        <div class="toast-content">
            <p>${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showDashboard() {
    document.getElementById('searchInput').value = '';
    renderTable(students);
}

function showStudents() {
    document.getElementById('searchInput').focus();
}
