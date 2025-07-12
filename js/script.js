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

// show form add & edit employeee
function showForm(edit = false) {
    document.getElementById("formModal").classList.remove("hidden");
    document.getElementById("formTitle").innerText = edit ? "Edit Employee" : "Add Employee";

}

// close form
function closeForm() {
    document.getElementById("employeeForm").reset();
    document.getElementById("formModal").classList.add("hidden");
    document.getElementById("formError").innerText = "";
}

// sort Employee
function sortEmployees() {
    const sortBy = document.getElementById("sortSelect").value;
    employees.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    renderEmployees();
}

// form submition
function submitForm(e) {
    e.preventDefault();
    const id = document.getElementById("employeeId").value || Date.now().toString();
    const employee = {
        id,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        role: document.getElementById("role").value.trim()
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
        document.getElementById("formError").innerText = "Invalid email format.";
        return;
    }

    const index = employees.findIndex(emp => emp.id === id);
    if (index > -1) {
        employees[index] = employee;
    } else {
        employees.push(employee);
    }

    closeForm();
    renderEmployees();

}

// edit form 
function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById("employeeId").value = emp.id;
    document.getElementById("firstName").value = emp.firstName;
    document.getElementById("lastName").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("role").value = emp.role;

    showForm(true);
}

// delete employee
function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        employees = employees.filter(e => e.id !== id);
        renderEmployees();
    }
}

// Initial demo data
employees = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', department: 'IT', role: 'Developer' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', department: 'HR', role: 'Manager' }
];

renderEmployees();