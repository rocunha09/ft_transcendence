$(document).ready(function() {
    var mode = 'small';

    function ActivateMode(mode) {
        if(mode === 'small') {
            document.querySelector('#f1p1').remove();
            document.querySelector('#f1p2').remove();
            document.querySelector('#f1p3').remove();
            document.querySelector('#f1p4').remove();
        
            document.querySelector('#f1p5').remove();
            document.querySelector('#f1p6').remove();
            document.querySelector('#f1p7').remove();
            document.querySelector('#f1p8').remove();

            document.querySelector('.card-body').style.height = '700px';
            
            document.querySelectorAll('.round').forEach((element) => {
                element.style.paddingBottom = '150px'; 
            });
        }
    }

    function put_color(match, player, status) {
        let matchId = match.getAttribute("id")
        let id = `#${matchId}_${player}`
        let p = match.querySelector(id)
      
        p.classList.remove('list-group-item-secondary')
        p.classList.remove('list-group-item-danger')
        p.classList.remove('list-group-item-success')
        p.classList.add(`list-group-item-${status}`)
    }

    function createLine(id, type, definition, coordinate) {
        let line = $('<div class="line ' + type + ' ' + definition + '" id="' + id + '"></div>');
        
        line.css({
            'position': 'absolute',
            'z-index': '10',
            'background-color': definition === 'winner' || definition === 'finished' ? '#32CD32' : '#000'
        });
        
        let thickness = 3
        if (type === 'v') {
            line.css({
                'width': `${thickness}px`,
                'top': (coordinate.y-75) + 'px',
                'left': coordinate.x + 'px',
                'height': coordinate.length + 'px'
            });
        }
        else if (type === 'h') {
            line.css({
                'height': `${thickness}px`,
                'top': (coordinate.y-75) + 'px',
                'left': coordinate.x + 'px',
                'width': coordinate.length + 'px'
            });
        }

        $('.lines').append(line);
    }

    function createPhaseBrackets(p1, p2, m_f1, m_f2, MatchFinished, direction) {
        /**
        * DEFINE A COR DA LINHA DE ACORDO COM O VENCEDOR
        * */
        let match1 = 'default'
        let match2 = 'default'
        if(MatchFinished != null && MatchFinished === 'm1') {
            match1 = 'finished'
        }
        else if(MatchFinished != null && MatchFinished === 'm2') {
            match2 = 'finished'
        }
        else if(MatchFinished != null && MatchFinished === 'm1m2') {
            match1 = 'finished'
            match2 = 'finished'
        }

        /**
         * OBTÉM (X,Y) INICIAL DA PARTIDA DA PRÓXIMA FASE E DEFINE O ALVO PARA FIM DA LINHA
         * */
        //(x,y) match
        let match_f2 = {
            x: parseFloat(m_f2.getBoundingClientRect().left),
            y: parseFloat(m_f2.getBoundingClientRect().top)
        }
        match_f2.y += (parseFloat(matchHeight.replace('px', '')) / 2)

        /**
         *DEFINE O STEPS X PARA CÁLCULO DE COMPRIMENTO DA LINHA
         * */
         let base = {
            x: 0,
            y: 0,
            x_step: 0,
            y_step:0
        }
         if(direction === 1) {
             base.x = parseFloat(m_f1.getBoundingClientRect().left) + parseFloat(matchWidth.replace('px', '')) 
             base.x_step = (match_f2.x - base.x) / 3
         }
         else if(direction === -1) {
             base.x = parseFloat(m_f1.getBoundingClientRect().left)
             base.x_step = (base.x - (match_f2.x + parseFloat(matchWidth.replace('px', '')))) / 3
         }                

         /**
         * CALCULA O (X,Y) INICIAL DAS LINHAS E SEUS COMPRIMENTOS PARA ENTÃO CRIAR A LINHA NA TELA
         * DEFINE OFFSETS PARA USO CASO SEJA NECESSÁRIO
         * */
        let offset = {
            x: 0,
            y: 0
        }

        let line1 = {
            x: 0,
            y: 0,
            length:0
        }
        direction === 1 ?
            line1.x = p1.x - offset.x :
            line1.x = p1.x - base.x_step - offset.x;
        line1.y = p1.y + offset.y
        line1.length = base.x_step
        createLine(('line5' + m_f1.getAttribute('id')),'h', match1, line1);

        let line2 = {
            x: 0,
            y: 0,
            length:0
        }
        direction === 1 ?
            line2.x = p2.x - offset.x :
            line2.x = p2.x - base.x_step - offset.x;
        line2.y = p2.y + offset.y
        line2.length = base.x_step
        createLine(('line6' + m_f1.getAttribute('id')),'h', match2, line2);

        let line3 = {
            x: 0,
            y: 0,
            length:0
        }
        direction === 1 ?
            line3.x = line1.x + base.x_step - offset.x :
            line3.x = line1.x - offset.x;
        line3.y = line1.y + offset.y
        line3.length = match_f2.y - line3.y
        createLine(('line7' + m_f1.getAttribute('id')),'v', match1, line3);

        let line4 = {
            x: 0,
            y: 0,
            length:0
        }
        line4.x = line3.x - offset.x
        line4.y = match_f2.y + offset.y
        line4.length = p2.y - (line3.y + line3.length)
        createLine(('line8' + m_f1.getAttribute('id')),'v', match2, line4);

        offset.y = -20
        let line5 = {
            x: 0,
            y: 0,
            length:0
        }
        direction === 1 ?
            line5.x = line4.x - offset.x :
            line5.x = line4.x - base.x_step - offset.x;
        line5.y = line4.y + offset.y
        line5.length = base.x_step
        createLine(('line9' + m_f1.getAttribute('id')),'h', 
        ((match1 === 'finished' || match2 === 'finished') ? 'finished' : 'default'), line5);
    }

    function createMatchBracket(m_f1, m_f2, winnerPlayer, direction) {
        /**
         * DEFINE A COR DA LINHA DE ACORDO COM O VENCEDOR
         * */
        let player1 = 'default'
        let player2 = 'default'
        put_color(m_f1, 'p1', 'secondary')
        put_color(m_f1, 'p2', 'secondary')
        if(winnerPlayer != null && winnerPlayer === 'p1') {
            player1 = 'winner'
            put_color(m_f1, 'p1', 'success')
            put_color(m_f1, 'p2', 'danger')
        }
        if(winnerPlayer != null && winnerPlayer === 'p2') {
            player2 = 'winner'
            put_color(m_f1, 'p1', 'danger')
            put_color(m_f1, 'p2', 'success')
        }
        
        /**
         * OBTÉM (X,Y) INICIAL DE CADA PARTIDA PARA CÁLCULO DAS LINHAS
         * */
        let match_f1 = {
            x: parseFloat(m_f1.getBoundingClientRect().left),
            y: parseFloat(m_f1.getBoundingClientRect().top)
        }

        let match_f2 = {
            x: parseFloat(m_f2.getBoundingClientRect().left),
            y: parseFloat(m_f2.getBoundingClientRect().top)
        }

        /**
         * CALCULA O PONTO DE PARTIDA DAS LINHAS EM X E DEFINE O STEPS (X, Y) PARA CÁLCULO DE COMPRIMENTO DA LINHA
         * */
        let base = {
            x: 0,
            y: 0,
            x_step: 0,
            y_step:0
        }
        if(direction === 1) {
            base.x = match_f1.x + parseFloat(matchWidth.replace('px', '')) 
            base.x_step = (match_f2.x - base.x) / 3
        }
        else if(direction === -1) {
            base.x = match_f1.x 
            base.x_step = (base.x - (match_f2.x + parseFloat(matchWidth.replace('px', '')))) / 3
        }                
        base.y_step = parseFloat(matchHeight.replace('px', '')) / 4

        /**
         * CALCULA O (X,Y) INICIAL DAS LINHAS E SEUS COMPRIMENTOS PARA ENTÃO CRIAR A LINHA NA TELA
         * DEFINE OFFSETS PARA USO CASO SEJA NECESSÁRIO
         * */
        let offset = {
            x: 100,
            y: -20
        }
        let line1 = {
            x: 0,
            y: 0,
            length: 0
        }
        direction === 1 ?
            line1.x = base.x - offset.x :
            line1.x = base.x - base.x_step - offset.x;
        line1.y = match_f1.y + base.y_step + offset.y
        line1.length = base.x_step
        createLine(('line1_' + m_f1.getAttribute('id')),'h', player1, line1);
        
        let line2 = {
            x: 0,
            y: 0,
            length: 0
        }
        direction === 1 ?
            line2.x = base.x - offset.x :
            line2.x = base.x - base.x_step - offset.x;
        line2.y = match_f1.y + (3 * base.y_step) + offset.y
        line2.length = base.x_step
        createLine(('line2_' + m_f1.getAttribute('id')),'h', player2, line2);
        
        let line3 = {
            x: 0,
            y: 0,
            length: 0
        }
        direction === 1 ?
            line3.x = base.x + base.x_step - offset.x :
            line3.x = base.x - base.x_step - offset.x;
        line3.y = match_f1.y + base.y_step + offset.y
        line3.length = base.y_step
        createLine(('line3_' + m_f1.getAttribute('id')),'v', player1, line3);

        let line4 = {
            x: 0,
            y: 0,
            length: 0
        }
        direction === 1 ?
            line4.x = base.x + base.x_step - offset.x :
            line4.x = base.x - base.x_step - offset.x;
        line4.y = match_f1.y + (2 * base.y_step) + offset.y
        line4.length = base.y_step
        createLine(('line4_' + m_f1.getAttribute('id')),'v', player2, line4);

        return line4;
    }

    function destroyBrackets() {
        let lines = document.querySelector('.lines')
        lines.innerHTML = ""
    }

    function create3rd(players) {
        let htmlContent =`<div id="f3p2" class="matchup d-flex flex-column justify-content-center align-items-center" >
                            <div class="row m-1 p-1">
                                <div id="f3p2_p1" class="p-1 playerMatch list-group-item-secondary text-white d-flex justify-content-between align-items-center">
                                    <div class="col d-flex justify-content-center align-items-center">
                                        <img src="${players[0].photo}" class="rounded-circle" height="50" alt="et photo" loading="lazy" />
                                        <span>${players[0].name}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row m-1 p-1">
                                <div id="f3p2_p2" class="p-1 playerMatch list-group-item-secondary text-white d-flex justify-content-between align-items-center">
                                    <div class="col d-flex justify-content-center align-items-center">
                                        <img src="${players[1].photo}" class="rounded-circle" height="50" alt="et photo" loading="lazy" />
                                        <span>${players[1].name}</span>
                                    </div>
                                </div>
                            </div>
                        </div> `

        let offset = {
            x: 100,
            y: -20
        }
        let lines = document.querySelector('.lines');
        let div3rdMatch = document.createElement('div');
        div3rdMatch.innerHTML = htmlContent;
        lines.appendChild(div3rdMatch);
        
        let finalMatch = document.querySelector('#f3p1');
        let xFinalMatch = finalMatch.getBoundingClientRect().left;
        let yFinalMatch = finalMatch.getBoundingClientRect().top;

        let _3rdMatch = document.querySelector('#f3p2');
        let y_3rdMatch = yFinalMatch + 150;

        xFinalMatch -= offset.x
        y_3rdMatch += offset.y

        _3rdMatch.style.left = `${xFinalMatch}px`;
        _3rdMatch.style.top = `${y_3rdMatch}px`;
    }
   
    var matchWidth = $(f1p1).css('width');
    var matchHeight = $(f1p1).css('height');
    function buildBrackets(mode) {
        if(mode === 'big'){

            let f1p1 = document.getElementById('f1p1');
            let f1p2 = document.getElementById('f1p2');
            let f1p3 = document.getElementById('f1p3');
            let f1p4 = document.getElementById('f1p4');
            
            let f1p5 = document.getElementById('f1p5');
            let f1p6 = document.getElementById('f1p6');
            let f1p7 = document.getElementById('f1p7');
            let f1p8 = document.getElementById('f1p8');
        }
    
        let f2p1 = document.getElementById('f2p1');
        let f2p2 = document.getElementById('f2p2');
    
        let f3p1 = document.getElementById('f3p1');
    
        let f2p3 = document.getElementById('f2p3');
        let f2p4 = document.getElementById('f2p4');
    

        destroyBrackets();

        if(mode === 'big'){
            let brkt_f1p1 = createMatchBracket(f1p1, f2p1, winnerPlayer(f1p1), 1)
            let brkt_f1p2 = createMatchBracket(f1p2, f2p1, winnerPlayer(f1p2), 1)
            let brkt_f1p3 = createMatchBracket(f1p3, f2p2, winnerPlayer(f1p3), 1)
            let brkt_f1p4 = createMatchBracket(f1p4, f2p2, winnerPlayer(f1p4), 1)
            
            let brkt_f1p5 = createMatchBracket(f1p5, f2p3, winnerPlayer(f1p5), -1)
            let brkt_f1p6 = createMatchBracket(f1p6, f2p3, winnerPlayer(f1p6), -1)
            let brkt_f1p7 = createMatchBracket(f1p7, f2p4, winnerPlayer(f1p7), -1)
            let brkt_f1p8 = createMatchBracket(f1p8, f2p4, winnerPlayer(f1p8), -1)
            
            createPhaseBrackets(brkt_f1p1, brkt_f1p2, f1p1, f2p1, matchFinished(f1p1, f1p2), 1)
            createPhaseBrackets(brkt_f1p3, brkt_f1p4, f1p3, f2p2, matchFinished(f1p3, f1p4), 1)
            createPhaseBrackets(brkt_f1p5, brkt_f1p6, f1p5, f2p3, matchFinished(f1p5, f1p6), -1)
            createPhaseBrackets(brkt_f1p7, brkt_f1p8, f1p6, f2p4, matchFinished(f1p7, f1p8), -1)
        }
        let brkt_f2p1 = createMatchBracket(f2p1, f3p1, winnerPlayer(f2p1), 1)
        let brkt_f2p2 = createMatchBracket(f2p2, f3p1, winnerPlayer(f2p2), 1)
        
        let brkt_f2p3 = createMatchBracket(f2p3, f3p1, winnerPlayer(f2p3), -1)
        let brkt_f2p4 = createMatchBracket(f2p4, f3p1, winnerPlayer(f2p4), -1)
        
        createPhaseBrackets(brkt_f2p1, brkt_f2p2, f2p1, f3p1, matchFinished(f2p1, f2p2), 1)
        createPhaseBrackets(brkt_f2p3, brkt_f2p4, f2p3, f3p1, matchFinished(f2p3, f2p4), -1)

    }

    function cardTimer() {
        let htmlContent = `<div id="cardTimer" class="card popup-card">
                                <div class="card-header text-center">
                                    <h5>
                                        Loading...
                                    </h5>
                                </div>
                                <div class="card-body text-center">
                                    <img class="imageTimer" src="assets/timer.png" alt="Timer">
                                    <p id="timerDisplay" style="font-size: 2rem;">
                                        01:00
                                    </p> 
                                </div>
                                <div class="card-footer">
                                    <button id="cancelButton" class="btn btn-danger">
                                        Desistir
                                    </button>
                                    <button id="readyButton" class="btn btn-success">
                                        Estou Pronto
                                    </button>
                                </div>
                            </div>` 
        
        let lines = document.querySelector('.lines');
        let cardTimer = document.createElement('div');
        cardTimer.innerHTML = htmlContent;
        lines.appendChild(cardTimer);


    }

    function startCountdown(duration, display) {
        let timer = duration, minutes, seconds;
        const countdownInterval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(countdownInterval);
                display.textContent = "Tempo esgotado!";
            }
        }, 1000);
    }

    function exibeCardTimer () {
        const countdownCard = document.querySelector("#cardTimer");
        const timerDisplay = document.querySelector("#timerDisplay");
        
        countdownCard.style.display = "block"; 
        startCountdown(60, timerDisplay); 
    }
   
    /*********************  CONSTRÓI ELEMENTOS NA TELA  *********************/
    ActivateMode(mode);
    buildBrackets(mode);
    create3rd(get3rdPlayersMatch());
    cardTimer();
   
    window.onresize = () =>{
        //resizeTournament();
        buildBrackets();
        create3rd(get3rdPlayersMatch());
    }

    /************************************************************************/

    /**
     * PEGA OS PLAYERS QUE IRÃO DISPUTAR O TERCEIRO LUGAR POR RQUISIÇÃO NO BACK;
     */
    function get3rdPlayersMatch() {
        let player1 = {
            name: 'waiting...',
            photo: 'assets/profileDefault.png'
        }

        let player2 = {
            name: 'waiting...',
            photo: 'assets/profileDefault.png'
        }

        let players = [player1, player2]
        return players;
    }

    /**
     * MOCK PARA TESTE - DEVE-SE REALIZAR REQUISIÇÃO PARA OBTER DADOS DO BACK
     */
    function matchFinished(match1, match2) {
        //requisição para o back
        return null;
    }
    
    /**
     * MOCK PARA TESTE - DEVE-SE REALIZAR REQUISIÇÃO PARA OBTER DADOS DO BACK
     */
    function winnerPlayer(match) {
        //requisição para o back
        return null;
    }
    /**
     * FUNÇÃO TEMPORÁRIA, A EXIBIÇÃO DO CARD TIMER DEVE
     * SER DAR PELO EVENTO DO BACK QUANDO TIVER UMA PARTIDA PREENCHIDA COM 2 JOGADOEES
     */
    window.onclick = () => {
        exibeCardTimer();
    }

    /**
     * AÇÕES DOS BOTÕES DO CARD TIMER, DEVEM SER PARAMETRIZADAS DE ACORDO COM O BACK
     */
    document.querySelector("#cancelButton").addEventListener("click", () => {
        document.querySelector('#cardTimer').remove()
    });

    document.querySelector("#readyButton").addEventListener("click", () => {
        document.querySelector('#cardTimer').remove()
    });

});