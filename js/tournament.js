$(document).ready(function() {
    function winnerPlayer(match) {
        //requisição para o back
        return null;
    }

    function createLine(id, type, definition, x, y, length) {
        var line = $('<div class="line ' + type + ' ' + definition + '" id="' + id + '"></div>');

        line.css({
            'position': 'absolute',
            'z-index': '10',
            'background-color': definition === 'vencedor' ? '#32CD32' : '#000'
        });

        if (type === 'v') {
            line.css({
                'width': '2px',
                'top': (y-75) + 'px',
                'left': x + 'px',
                'height': length + 'px'
            });
        }
        else if (type === 'h') {
            line.css({
                'height': '2px',
                'top': (y-75) + 'px',
                'left': x + 'px',
                'width': length + 'px'
            });
        }

        $('.lines').append(line);
    }

    function createBracket(m_f1, m_f2, winnerPlayer, direction) {
        /**
         * DEFINE A COR DA LINHA DE ACORDO COM O VENCEDOR
         * */
        let player1 = 'padrao'
        let player2 = 'padrao'
        if(winnerPlayer != null && winnerPlayer === 'p1') {
            player1 = 'vencedor'
        }
        if(winnerPlayer != null && winnerPlayer === 'p2') {
            player2 = 'vencedor'
        }
        
        /**
         * OBTÉM (X,Y) INICIAL DE CADA PARTIDA PARA CÁLCULO DAS LINHAS
         * */
        //(x,y) match1
        let match_f1 = [0,0]
        match_f1[0] = parseFloat(m_f1.getBoundingClientRect().left);
        match_f1[1] = parseFloat(m_f1.getBoundingClientRect().top);

        //(x,y) match2
        let match_f2 = [0,0]
        match_f2[0] = parseFloat(m_f2.getBoundingClientRect().left);
        match_f2[1] = parseFloat(m_f2.getBoundingClientRect().top);

        /**
         * CALCULA O PONTO DE PARTIDA DAS LINHAS EM X E DEFINE O STEPS (X, Y) PARA CÁLCULO DE COMPRIMENTO DA LINHA
         * */
        let x1_lines_h = 0;
        let x_step = 0;
        if(direction === 1) {
            x1_lines_h = match_f1[0] + parseFloat(matchWidth.replace('px', '')) 
            x_step = (match_f2[0] - x1_lines_h) / 3
        }
        else if(direction === -1) {
            x1_lines_h = match_f1[0] 
            x_step = (x1_lines_h - (match_f2[0] + parseFloat(matchWidth.replace('px', '')))) / 3
        }                
        let y_step = parseFloat(matchHeight.replace('px', '')) / 4
        

        /**
         * CALCULA O (X,Y) INICIAL DAS LINHAS E SEUS COMPRIMENTOS PAR ENTÃO CRIAR A LINHA NA TELA
         * DEFINE OFFSETS PARA USO CASO SEJA NECESSÁRIO
         * */
        let offset_x = 0;
        let offset_y = 0;
        let line1 = [0,0]
        let length_l1 = 0
        //(x,y) inicial
        if(direction === 1) {
            line1[0] = x1_lines_h                       - offset_x
        }
        else if(direction === -1) {
            line1[0] = x1_lines_h - x_step              - offset_x
        }
        line1[1] = match_f1[1] + y_step                 + offset_y
        //comprimento da linha
        length_l1 = x_step
        createLine(('line1_' + m_f1.getAttribute('id')),'h', player1, line1[0], line1[1], length_l1);
        
        let line2 = [0,0]
        let length_l2 = 0
        if(direction === 1) {
            line2[0] = x1_lines_h                       - offset_x
        }
        else if(direction === -1) {
            line2[0] = x1_lines_h - x_step              - offset_x
        }
        line2[1] = match_f1[1] + (3 * y_step)           + offset_y
        length_l2 = x_step
        createLine(('line2_' + m_f1.getAttribute('id')),'h', player2, line2[0], line2[1], length_l2);
        
        let line3 = [0,0]
        let length_l3 = 0
        if(direction === 1) {
            line3[0] = x1_lines_h + x_step              - offset_x
        }
        else if(direction === -1) {
            line3[0] = x1_lines_h - x_step              - offset_x
        }
        line3[1] = match_f1[1] + y_step                 + offset_y
        length_l3 = y_step
        createLine(('line3_' + m_f1.getAttribute('id')),'v', player1, line3[0], line3[1], length_l3);

        let line4 = [0,0]
        let length_l4 = 0
        if(direction === 1) {
            line4[0] = x1_lines_h + x_step              - offset_x
        }
        else if(direction === -1) {
            line4[0] = x1_lines_h - x_step              - offset_x
        }
        line4[1] = match_f1[1] + (2 * y_step)           + offset_y
        length_l4 = y_step
        createLine(('line4_' + m_f1.getAttribute('id')),'v', player2, line4[0], line4[1], length_l4);
    }

    function destroyBrackets() {
        let lines = document.querySelector('.lines')
        lines.innerHTML = ""
    }


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

    var matchWidth = $(f1p1).css('width');
    var matchHeight = $(f1p1).css('height');
   
    /**
     * CRIAÇÃO INCIIAL DOS BRACKETS
     * */
    destroyBrackets();
    createBracket(f1p1, f2p1, winnerPlayer(f1p1), 1)
    createBracket(f1p2, f2p1, winnerPlayer(f1p2), 1)
    createBracket(f1p3, f2p2, winnerPlayer(f1p3), 1)
    createBracket(f1p4, f2p2, winnerPlayer(f1p4), 1)
    
    createBracket(f2p1, f3p1, winnerPlayer(f2p1), 1)
    createBracket(f2p2, f3p1, winnerPlayer(f2p2), 1)
    
    createBracket(f2p3, f3p1, winnerPlayer(f2p3), -1)
    createBracket(f2p4, f3p1, winnerPlayer(f2p4), -1)
    
    createBracket(f1p5, f2p3, winnerPlayer(f1p5), -1)
    createBracket(f1p6, f2p3, winnerPlayer(f1p6), -1)
    createBracket(f1p7, f2p4, winnerPlayer(f1p7), -1)
    createBracket(f1p8, f2p4, winnerPlayer(f1p8), -1)

    /**
     * CRIAÇÃO DOS BRACKETS SE HOUVER RESIZE DA TELA
     * */
    window.onresize = function(){
        destroyBrackets();
        createBracket(f1p1, f2p1, winnerPlayer(f1p1), 1)
        createBracket(f1p2, f2p1, winnerPlayer(f1p2), 1)
        createBracket(f1p3, f2p2, winnerPlayer(f1p3), 1)
        createBracket(f1p4, f2p2, winnerPlayer(f1p4), 1)
        
        createBracket(f2p1, f3p1, winnerPlayer(f2p1), 1)
        createBracket(f2p2, f3p1, winnerPlayer(f2p2), 1)
        
        createBracket(f2p3, f3p1, winnerPlayer(f2p3), -1)
        createBracket(f2p4, f3p1, winnerPlayer(f2p4), -1)
        
        createBracket(f1p5, f2p3, winnerPlayer(f1p5), -1)
        createBracket(f1p6, f2p3, winnerPlayer(f1p6), -1)
        createBracket(f1p7, f2p4, winnerPlayer(f1p7), -1)
        createBracket(f1p8, f2p4, winnerPlayer(f1p8), -1)
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