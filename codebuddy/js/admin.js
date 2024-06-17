import * as User from "./models/userModel.js";

document.addEventListener("DOMContentLoaded", function() {
    const openSendNotif = document.getElementById('send_message');  
    const messagePopup = document.getElementById('message_popup');  
    const deleteAccountBtn = document.getElementById('delete_account');
    const blockUserBtn = document.getElementById('block_user');
    const unblockUserBtn = document.getElementById('unblock_user');
    const messageForm = document.getElementById('messageForm');
    const messageContent = document.getElementById('messageContent');

    openSendNotif.addEventListener('click', function() { 
        messagePopup.style.display = 'block';
    }); 

    window.addEventListener('click', function(event) { 
        if (event.target == messagePopup) { 
            messagePopup.style.display = 'none';
        }
    }); 

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage();
    });

    // ADMIN 
    if (!User.isLogged() || !User.getUserLogged().isAdmin) { 
        alert('Acesso negado'); 
        window.location.href = '/codebuddy/index.html'; 
        return;
    }

    // Iniciar os users
    User.init();
    loadUsersToTable(); 

    deleteAccountBtn.addEventListener('click', deleteUser);
    blockUserBtn.addEventListener('click', blockUser);
    unblockUserBtn.addEventListener('click', unblockUser);
});

function loadUsersToTable() {
    const users = User.getUsers();
    const tableBody = document.querySelector('.tabela tbody');

    // Limpar linhas dos users
    tableBody.innerHTML = '';

    // Adicionar users a tabela
    users.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('data'); 

        const usernameCell = document.createElement('td');
        const selectRadio = document.createElement('input');
        selectRadio.type = 'radio';
        selectRadio.name = 'selectedUser';
        selectRadio.value = user.username;
        usernameCell.appendChild(selectRadio);
        const usernameText = document.createTextNode(user.username);
        usernameCell.appendChild(usernameText);
        row.appendChild(usernameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = user.email || 'N/A'; 
        row.appendChild(emailCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = user.isBlocked ? 'Bloqueado' : 'Ativo';
        row.appendChild(statusCell);

        const pointsCell = document.createElement('td');
        pointsCell.textContent = '0'; // Implementar a lógica dos pontos
        row.appendChild(pointsCell);

        tableBody.appendChild(row);
    }); 
}

function deleteUser() { 
    const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
    if (!selectedUser) {
        alert('Por favor, selecione um utilizador para apagar.');
        return;
    }

    const username = selectedUser.value;
    if (confirm(`Tem certeza de que deseja apagar o utilizador ${username}?`)) {
        User.deleteUser(username);
        loadUsersToTable();
    }
}

function blockUser() {
    const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
    if (!selectedUser) {
        alert('Por favor, selecione um utilizador para bloquear.');
        return;
    }

    const username = selectedUser.value;
    if (confirm(`Tem certeza de que deseja bloquear o utilizador ${username}?`)) {
        User.blockUser(username);
        loadUsersToTable();
    }
}

function unblockUser() {
    const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
    if (!selectedUser) {
        alert('Por favor, selecione um utilizador para desbloquear.');
        return;
    }

    const username = selectedUser.value;
    if (confirm(`Tem certeza de que deseja desbloquear o utilizador ${username}?`)) {
        User.unblockUser(username);
        loadUsersToTable();
    }
}

function sendMessage() {
    const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
    if (!selectedUser) {
        alert('Por favor, selecione um utilizador para enviar a mensagem.');
        return;
    }

    const username = selectedUser.value;
    const message = messageContent.value;

    if (message.trim() === '') {
        alert('Por favor, escreva uma mensagem.');
        return;
    }

    // Enviar mensagem 
    User.sendMessage(username, message);
    alert(`Mensagem enviada para ${username}: ${message}`);
    messageContent.value = ''; 
    messagePopup.style.display = 'none'; 
}
