/**
 * funções abaixo serão alteradas ou substituídas pelo uso de htmx
 */
$(document).ready(function() {
           
    // Seletor de itens do chat
    $('.chat-item').click(function() {
        $('.chat-item').removeClass('active');
        $(this).addClass('active');
        changeChat($(this).data('contact'));
    });

    // Configuração do botão de envio de mensagem
    $('#message-input').keypress(function(e) {
        if (e.which == 13) {
            sendMessage();
            return false;
        }
    });

    // Rolagem automática da área de mensagens
    const chatContainer = document.querySelector('#message-list');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const emojiButton = document.getElementById('emoji-button');
    const emojiList = document.getElementById('emoji-list');
    const chatInput = document.getElementById('message-input');

    // Exibir/esconder a lista de emojis ao clicar no botão
    emojiButton.addEventListener('click', () => {
        emojiList.classList.toggle('show');
    });

    // Adicionar emoji ao input quando clicado
    emojiList.addEventListener('click', (event) => {
        if (event.target.tagName === 'SPAN') {
            chatInput.value += event.target.textContent;
            chatInput.focus(); // Coloca o foco de volta no campo de entrada
        }
    });

    // Ocultar a lista de emojis quando clicar fora dela
    document.addEventListener('click', (event) => {
        if (!emojiButton.contains(event.target) && !emojiList.contains(event.target)) {
            emojiList.classList.remove('show');
        }
    });
});

function showDropdownMenu(button, contactName, id) {
    //Remove caso tenha algum em tela
    let showingMenu = document.querySelector('.dropdown-menu');
    if(showingMenu != null) {
        showingMenu.remove();
    }

    // Criar o elemento do menu dropdown
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.classList.add('custom-dropdown-menu', 'show');

    // Calcular a posição do menu em relação ao botão dentro do contêiner
    const rect = button.getBoundingClientRect();
    dropdownMenu.style.top = `${rect.bottom + window.scrollY}px`; // Posicionar abaixo do botão
    dropdownMenu.style.left = `${rect.left + window.scrollX}px`;

    // Conteúdo do menu com ações
    dropdownMenu.innerHTML = `
        <a class="dropdown-item" href="#" onclick="viewProfile('${contactName} ${id}')">View profile</a>
        <a class="dropdown-item" href="#" onclick="addFriend('${contactName} ${id}')">Add friend</a>
        <a class="dropdown-item" href="#" onclick="deleteFriend('${contactName} ${id}')">Delete friend</a>
        <a class="dropdown-item" href="#" onclick="challengeToMatch('${contactName} ${id}')">Challenge to match</a>
    `;

    document.body.appendChild(dropdownMenu);

    // Remover o menu ao clicar em uma opção ou sair com o mouse
    dropdownMenu.addEventListener('mouseleave', removeDropdownMenu);
    dropdownMenu.addEventListener('click', removeDropdownMenu);
}

function removeDropdownMenu() {
    const existingMenu = document.querySelector('.dropdown-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

//funções abaixo serão substituídas pelo uso de htmx
function changeChat(contactName) {
    try {
        $('#current-chat-name').text(contactName);
        $('#message-list').empty();
        const dummyMessages = [
            { type: 'received', text: 'Hello!' },
            { type: 'sent', text: 'Hi there!' },
            { type: 'received', text: 'How are you?' },
        ];
        dummyMessages.forEach(msg => {
            const newMessage = $(`<div class="message-container ${msg.type}"><div class="message ${msg.type}">${msg.text}</div></div>`);
            $('#message-list').append(newMessage);
        });
        $('#message-list').scrollTop($('#message-list')[0].scrollHeight);
    } catch (error) {
        console.error('Error changing chat:', error);
    }
}

function sendMessage() {
    try {
        var messageText = $('#message-input').val().trim();
        if (messageText !== '') {
            var newMessage = $('<div class="message-container sent"><div class="message sent">' + messageText + '</div></div>');
            $('#message-list').append(newMessage);
            $('#message-input').val('');
            $('#message-list').scrollTop($('#message-list')[0].scrollHeight);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

function viewProfile(contactName) {
    try {
        console.log('Viewing profile of ' + contactName);
        alert('Viewing profile of ' + contactName);
    } catch (error) {
        console.error('Error viewing profile:', error);
    }
}

function addFriend(contactName) {
    try {
        console.log('Adding friend: ' + contactName);
        alert('Added ' + contactName + ' as friend');
    } catch (error) {
        console.error('Error adding friend:', error);
    }
}

function deleteFriend(contactName) {
    try {
        console.log('Deleting friend: ' + contactName);
        alert('Deleted ' + contactName + ' from friends');
    } catch (error) {
        console.error('Error deleting friend:', error);
    }
}

function challengeToMatch(contactName) {
    try {
        console.log('Challenging ' + contactName + ' to a match');
        alert('Challenged ' + contactName + ' to a match');
    } catch (error) {
        console.error('Error challenging to match:', error);
    }
}