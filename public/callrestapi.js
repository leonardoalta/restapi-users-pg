const API_URL = '/api/users';
let usersData = [];

// Muestra alert Bootstrap
function showMessage(msg, type='success'){
  document.getElementById('resultMessage').innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show">
      ${msg}
      <button class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

// Limpia formulario y vuelve a modo crear
function clearForm(){
  document.getElementById('userForm').reset();
  document.getElementById('userId').value = '';
  document.getElementById('saveBtn').textContent = 'Enviar';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

// Rellena la tabla con acciones
function renderTable(users){
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.age}</td>
      <td>${u.comments}</td>
      <td>${new Date(u.createdAt).toLocaleString()}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editUser(${u.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">Borrar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// GET
async function getUsers(){
  try {
    const res = await fetch(API_URL);
    const { users } = await res.json();
    usersData = users;
    renderTable(users);
  } catch(e){
    showMessage('Error al cargar usuarios','danger');
  }
}

// POST
async function postUser(){
  const payload = {
    name:     document.getElementById('name').value,
    email:    document.getElementById('email').value,
    age:      +document.getElementById('age').value || 0,
    comments: document.getElementById('comments').value
  };
  const res = await fetch(API_URL, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(res.statusText);
  showMessage('Usuario creado');
  clearForm();
  getUsers();
}

// PUT
async function updateUser(id){
  const payload = {
    name:     document.getElementById('name').value,
    email:    document.getElementById('email').value,
    age:      +document.getElementById('age').value || 0,
    comments: document.getElementById('comments').value
  };
  const res = await fetch(`${API_URL}/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(res.statusText);
  showMessage('Usuario actualizado');
  clearForm();
  getUsers();
}

// DELETE
async function deleteUser(id){
  if (!confirm('¿Eliminar usuario?')) return;
  const res = await fetch(`${API_URL}/${id}`, { method:'DELETE' });
  if (res.status!==204) throw new Error(res.statusText);
  showMessage('Usuario borrado','warning');
  getUsers();
}

// Carga datos en el formulario para editar
function editUser(id){
  const u = usersData.find(x=>x.id===id);
  if (!u) return;
  document.getElementById('userId').value   = u.id;
  document.getElementById('name').value     = u.name;
  document.getElementById('email').value    = u.email;
  document.getElementById('age').value      = u.age;
  document.getElementById('comments').value = u.comments;
  document.getElementById('saveBtn').textContent = 'Actualizar';
  document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

// Maneja submit (crear o actualizar)
async function saveUser(evt){
  evt.preventDefault();
  const id = document.getElementById('userId').value;
  if (id) await updateUser(id);
  else    await postUser();
}

// Inicialización
window.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('userForm').addEventListener('submit', saveUser);
  document.getElementById('cancelEditBtn').addEventListener('click', clearForm);
  document.getElementById('loadUsersBtn').addEventListener('click', getUsers);
  getUsers();
});

