$(document).ready(function() {
    /**
     * pega dados do back
     */
    function matchFinished(match1, match2) {
        //requisição para o back
        return null;
    }
    
    /**
     * pega dados do back
     */
    function winnerPlayer(match) {
        //requisição para o back
        return null;
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
        var line = $('<div class="line ' + type + ' ' + definition + '" id="' + id + '"></div>');

        line.css({
            'position': 'absolute',
            'z-index': '10',
            'background-color': definition === 'winner' || definition === 'finished' ? '#32CD32' : '#000'
        });

        if (type === 'v') {
            line.css({
                'width': '2px',
                'top': (coordinate.y-75) + 'px',
                'left': coordinate.x + 'px',
                'height': coordinate.length + 'px'
            });
        }
        else if (type === 'h') {
            line.css({
                'height': '2px',
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
        (match1 === 'finished' || match1 === 'finished' ? 'finished' : 'default'), line5);
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
            x: 0,
            y: 0
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

     /**
     * PEGA OS PLAYERS QUE IRÃO DISPUTAR O TERCEIRO LUGAR;
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

        let lines = document.querySelector('.lines');
        let div3rdMatch = document.createElement('div');
        div3rdMatch.innerHTML = htmlContent;
        lines.appendChild(div3rdMatch);

        let finalMatch = document.querySelector('#f3p1');
        let xFinalMatch = finalMatch.getBoundingClientRect().left;
        let yFinalMatch = finalMatch.getBoundingClientRect().top;

        let _3rdMatch = document.querySelector('#f3p2');
        let y_3rdMatch = yFinalMatch + 150;

        _3rdMatch.style.left = `${xFinalMatch}px`;
        _3rdMatch.style.top = `${y_3rdMatch}px`;
    }
   
    /**
     * EXECUTA A CRIAÇÃO DOS BRACKETS
     * */
    var matchWidth = $(f1p1).css('width');
    var matchHeight = $(f1p1).css('height');
    function buildBrackets() {
        let f1p1 = document.getElementById('f1p1');
        let f1p2 = document.getElementById('f1p2');
        let f1p3 = document.getElementById('f1p3');
        let f1p4 = document.getElementById('f1p4');
    
        let f2p1 = document.getElementById('f2p1');
        let f2p2 = document.getElementById('f2p2');
    
        let f3p1 = document.getElementById('f3p1');
    
        let f2p3 = document.getElementById('f2p3');
        let f2p4 = document.getElementById('f2p4');
    
        let f1p5 = document.getElementById('f1p5');
        let f1p6 = document.getElementById('f1p6');
        let f1p7 = document.getElementById('f1p7');
        let f1p8 = document.getElementById('f1p8');

        destroyBrackets();
        let brkt_f1p1 = createMatchBracket(f1p1, f2p1, winnerPlayer(f1p1), 1)
        let brkt_f1p2 = createMatchBracket(f1p2, f2p1, winnerPlayer(f1p2), 1)
        let brkt_f1p3 = createMatchBracket(f1p3, f2p2, winnerPlayer(f1p3), 1)
        let brkt_f1p4 = createMatchBracket(f1p4, f2p2, winnerPlayer(f1p4), 1)
        let brkt_f2p1 = createMatchBracket(f2p1, f3p1, winnerPlayer(f2p1), 1)
        let brkt_f2p2 = createMatchBracket(f2p2, f3p1, winnerPlayer(f2p2), 1)
        
        let brkt_f2p3 = createMatchBracket(f2p3, f3p1, winnerPlayer(f2p3), -1)
        let brkt_f2p4 = createMatchBracket(f2p4, f3p1, winnerPlayer(f2p4), -1)
        let brkt_f1p5 = createMatchBracket(f1p5, f2p3, winnerPlayer(f1p5), -1)
        let brkt_f1p6 = createMatchBracket(f1p6, f2p3, winnerPlayer(f1p6), -1)
        let brkt_f1p7 = createMatchBracket(f1p7, f2p4, winnerPlayer(f1p7), -1)
        let brkt_f1p8 = createMatchBracket(f1p8, f2p4, winnerPlayer(f1p8), -1)
        
        createPhaseBrackets(brkt_f1p1, brkt_f1p2, f1p1, f2p1, matchFinished(f1p1, f1p2), 1)
        createPhaseBrackets(brkt_f1p3, brkt_f1p4, f1p3, f2p2, matchFinished(f1p3, f1p4), 1)
        createPhaseBrackets(brkt_f2p1, brkt_f2p2, f2p1, f3p1, matchFinished(f2p1, f2p2), 1)
        
        createPhaseBrackets(brkt_f2p3, brkt_f2p4, f2p3, f3p1, matchFinished(f2p3, f2p4), -1)
        createPhaseBrackets(brkt_f1p5, brkt_f1p6, f1p5, f2p3, matchFinished(f1p5, f1p6), -1)
        createPhaseBrackets(brkt_f1p7, brkt_f1p8, f1p6, f2p4, matchFinished(f1p7, f1p8), -1)

    }

   
    /**
     * [EM CONSTRUÇÃO]
     * IMPLEMENTAÇÃO DE ZOOM PARA QUANDO A TELA TER SUA 
     * LARGURA MUITO REDUZIDA
     */
    var tournament = document.querySelector('.areaTournament')
    var originalWidth = tournament.getBoundingClientRect().width;
    function resizeTournament() {
        minWidth = 1200;
        actualWidth = tournament.getBoundingClientRect().width;
        
        let scale = actualWidth / originalWidth;
        if (scale < 0.5) {
            scale = 0.5;
        }

        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = 'top left';

    }

    /**
     * CRIAÇÃO INICIAL DOS BRACKETS
     * */
    buildBrackets();
    create3rd(get3rdPlayersMatch());

    /**
     * CRIAÇÃO DOS BRACKETS SE HOUVER RESIZE DA TELA
     * */
    window.onresize = function(){
        //resizeTournament();
        buildBrackets();
        create3rd(get3rdPlayersMatch());
    }

    /**
     * FUNÇÃO TEMPORÁRIA, UTILIZADA PARA DESENVOLVIMENTO
     * */
    document.addEventListener('mousemove', function(event) {
        // Obtém as coordenadas X e Y do mouse
        var x = event.clientX; // Posição X do mouse
        var y = event.clientY; // Posição Y do mouse

        // Print no terminal (console) do navegador
        console.log('Posição do mouse - X: ' + x + ', Y: ' + y);
    });

});