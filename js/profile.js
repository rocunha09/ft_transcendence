$(document).ready(function () {
    $('#editButton').on('click', function (event) {
        event.preventDefault();

        if ($(this).text() === 'Editar') {
            $(this).removeClass('btn-warning').addClass('btn-success').text('Salvar');
            $('#uploadImage').css('display', 'block');
            $('#userNameField').prop('readonly', false);
            $('#nicknameField').prop('readonly', false);
            $('#emailField').prop('readonly', false);
            $('#passwordField').prop('readonly', false);
            $('#confirmPasswordField').prop('readonly', false)
            $('#confirmPasswordDiv').css('display', 'block');
            $('#descriptionField').prop('readonly', false);
        }
        else {
            if ($('#passwordField').val() !== $('#confirmPasswordField').val()) {
                alert('As senhas não conferem.');
            }
            else if ($('#userNameField').val() === '') {
                alert('O nome não pode ser vazio.');
            }
            else {
                $(this).removeClass('btn-success').addClass('btn-warning').text('Editar');
                $('#uploadImage').css('display', 'none');
                $('#userNameField').prop('readonly', true);
                $('#nicknameField').prop('readonly', true);
                $('#emailField').prop('readonly', true);
                $('#passwordField').prop('readonly', true);
                $('#confirmPasswordField').prop('readonly', true)
                $('#confirmPasswordDiv').css('display', 'none');
                $('#descriptionField').prop('readonly', true);
            }
        }
    });






/********************************************************************/
    /**
     * ESSES DADOS VIRÃO DO BACK
     */
    const matchHistory = [
        { opponent: "Alê Furona", result: "victory", score: "3-1" },
        { opponent: "big", result: "defeat", score: "3-0" },
        { opponent: "moaMinion", result: "victory", score: "3-0" },
        { opponent: "theFingers", result: "victory", score: "3-1" },
        { opponent: "dockerOnWindows", result: "defeat", score: "2-3" }
    ];


    function renderMatchHistory() {
        const historyContainer = document.querySelector('.match-history');
        historyContainer.innerHTML = '';

        matchHistory.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = `match-history-item p-3 ${match.result} bg-light`;
            
            matchElement.innerHTML = ` <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Opponent:</strong> ${match.opponent}
                                            </div>
                                            <div>
                                                <span class="badge ${match.result === 'victory' ? 'badge-success' : 'badge-danger'}">
                                                    ${match.result === 'victory' ? 'Victory' : 'Defeat'}
                                                </span>
                                                <span class="ml-2">${match.score}</span>
                                            </div>
                                        </div>`;

            historyContainer.appendChild(matchElement);
        });
    }

    function showProfile() {
        document.querySelector('#profileModal').style.display = 'block';
    }

    function hideProfile() {
        document.querySelector('#profileModal').style.display = 'none';
    }

    document.querySelector('#closeBtn').onclick = () => {
        hideProfile();
    }
    window.onclick = () => {
        hideProfile()
    }

    showProfile();
    renderMatchHistory();
}); 