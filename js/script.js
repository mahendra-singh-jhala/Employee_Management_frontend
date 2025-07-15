let employees = [];
let filters = {};
let currentPage = 1;

// get the employees list
function renderEmployees() {
    const container = document.getElementById("employeeList");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const pageSize = parseInt(document.getElementById("pageSize").value) || 10;

    console.log(search)
    let filtered = employees.filter(emp => {
        return (
            (!filters.name || emp.firstName.toLowerCase().includes(filters.name)) &&
            (!filters.department || emp.department.toLowerCase().includes(filters.department)) &&
            (!filters.role || emp.role.toLowerCase().includes(filters.role)) &&
            (emp.firstName.toLowerCase().includes(search) || emp.email.toLowerCase().includes(search))
        )
    })

    const start = (currentPage - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)

    container.innerHTML = paginated.map(emp => `
        <div class="employee-card">
            <ul>
                <li><strong>${emp.firstName} ${emp.lastName}</strong></li>
                <li><strong>Email : </strong> ${emp.email}</li>
                <li><strong>Depertment : </strong> ${emp.department}</li>
                <li><strong>Role : </strong> ${emp.role}</li>  
            </ul>
            <div class="btn">
                <button onclick="editEmployee('${emp.id}')" id="editBtn">Edit</button>
                <button onclick="deleteEmployee('${emp.id}')" id="deleteBtn">Delete</button>
            </div>     
        </div>
    `).join('');
}

// Listen for user input
document.getElementById("searchInput").addEventListener("input", renderEmployees);

// show filter
function showFilter() {
    document.getElementById("filterSidebar").classList.toggle("hidden");
}

// apply filter
function applyFilters() {
    filters = {
        name: document.getElementById("filterName").value.toLowerCase(),
        department: document.getElementById("filterDepartment").value.toLowerCase(),
        role: document.getElementById("filterRole").value.toLowerCase(),
    };
    renderEmployees()
}

// clear filters
function clearFilters() {
    filters = {};
    document.getElementById("filterName").value = '',
        document.getElementById("filterDepartment").value = '',
        document.getElementById("filterRole").value = ''
    renderEmployees()
}

// sort Employee
function sortEmployees() {
    const sortBy = document.getElementById("sortSelect").value;
    employees.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    renderEmployees();
}


// Add an employee row to the form
function addEmployeeRow(data = {}) {
    const container = document.getElementById("employeeRows");
    const rowId = Date.now();
    const row = document.createElement("div");
    row.className = "employee-row";
    row.dataset.rowId = rowId;

    row.innerHTML = `
        <input type="text" placeholder="First Name" class="firstName" value="${data.firstName || ''}" required />
        <input type="text" placeholder="Last Name" class="lastName" value="${data.lastName || ''}" required />
        <input type="email" placeholder="Email" class="email" value="${data.email || ''}" required />
        <input type="text" placeholder="Department" class="department" value="${data.department || ''}" required />
        <input type="text" placeholder="Role" class="role" value="${data.role || ''}" required />
        <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(row);
}

// Show form and reset rows
function showForm(edit = false) {
    document.getElementById("formModal").classList.remove("hidden");
    document.getElementById("formTitle").innerText = edit ? "Edit Employee" : "Add Employee";
    document.getElementById("employeeRows").innerHTML = "";

    if (!edit) {
        document.getElementById("employeeForm").dataset.editId = ""; 
        addEmployeeRow();
    }
}


// Form submission for multiple employees
function submitForm(e) {
    e.preventDefault();
    const rows = document.querySelectorAll("#employeeRows .employee-row");
    let hasError = false;
    const newEmployees = [];

    rows.forEach(row => {
        const firstName = row.querySelector(".firstName").value.trim();
        const lastName = row.querySelector(".lastName").value.trim();
        const email = row.querySelector(".email").value.trim();
        const department = row.querySelector(".department").value.trim();
        const role = row.querySelector(".role").value.trim();

        if (!firstName || !lastName || !email || !department || !role) {
            hasError = true;
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            hasError = true;
            document.getElementById("formError").innerText = `Invalid email: ${email}`;
            return;
        }

        const employee = {
            id: document.getElementById("employeeForm").dataset.editId || (Date.now().toString() + Math.random().toString()),
            firstName,
            lastName,
            email,
            department,
            role
        };

        newEmployees.push(employee);
    });

    if (hasError) return;

    const editId = document.getElementById("employeeForm").dataset.editId;
    if (editId) {
        employees = employees.map(emp => emp.id === editId ? newEmployees[0] : emp);
    } else {
        employees = employees.concat(newEmployees);
    }

    delete document.getElementById("employeeForm").dataset.editId;
    closeForm();
    renderEmployees();
}

// edit form 
function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    showForm(true);
    addEmployeeRow(emp);
    document.getElementById("employeeForm").dataset.editId = emp.id;
}


// delete employee
function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        employees = employees.filter(e => e.id !== id);
        renderEmployees();
    }
}

// close form
function closeForm() {
    document.getElementById("employeeForm").reset();
    document.getElementById("formModal").classList.add("hidden");
    document.getElementById("formError").innerText = "";
}

// Initial demo data
employees = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', department: 'IT', role: 'Developer' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', department: 'HR', role: 'Manager' }
];

renderEmployees();