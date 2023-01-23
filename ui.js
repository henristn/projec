let roupaID = null;
let dataPart = null;
let sexoLoja = 'Male';
let dataCat = 'mascara';
let change = {}
let oldPart = {}
let ultLoja = null;
let lojaDados = null;
let aberto2 = false;
let colorOpen = true;

let sizeW = 100;
let sizeH = 100;

$(document).ready(function() {
    document.onkeydown = function(data) {
        switch(data.keyCode) {
            case 27:
                $("body").fadeOut();
                $('#listagem').html('');
                $("body").fadeOut();
                $('#totalDireita').html('0'); 
                change = {};
                $.post('http://clothes/reset', JSON.stringify({}))
            break;

            case 68:
                $.post('http://clothes/rotate', JSON.stringify("left"))
            break;

            case 65:
                $.post('http://clothes/rotate', JSON.stringify("right"))
            break;

            case 88:
                $.post('http://clothes/handsup', JSON.stringify({}))
            break;
        }
    }

    $("#esquerda").click(function() {
        $.post('http://clothes/leftHeading', JSON.stringify({ value: 10 }));
    })

    $("#maos").click(function() {
        $.post('http://clothes/handsup', JSON.stringify({}))
    })

    $("#direita").click(function() {
        $.post('http://clothes/rightHeading', JSON.stringify({ value: 10 }));
    })

    $("#cart").click(function() {
        $("body").fadeOut()
        $.post('http://clothes/payament', JSON.stringify({ price: $('#totalDireita').text(), parts: oldPart }));
        $('#totalDireita').html('0');
        change = {};
    })

    window.addEventListener('message', function(event) {
        let item = event.data;

        if (item.action == 'setPrice') {
            if (item.typeaction == "add") {
                $('#totalDireita').html(item.price)
            }
            if (item.typeaction == "remove") {
                $('#totalDireita').html(item.price)
            }
        }
        
        if (item.openLojaRoupa) {
            oldPart = item.oldCustom
            change = {};
            ultLoja = item.ultLoja;
            lojaDados = item.dadosLoja;
            $("body").fadeIn()
            dataPart = item.category
            $('#listagem').html('')
            if(item.category == 'p2' || item.category == 'p6'|| item.category == 'p7'){                    
                $("#listagem").append(`
                    <div class="item lista" data-id="-1" onclick="select(this)" id="${item.category}-1">
                        <div class="item-photo" style="background-image: url('');"></div>
                        <span>N ${i}</span>
                        <div class="price">FREE</div>
                    </div>
                `);
            }

            for (var i = 0; i <= (item.drawa -1); i++) {   
                var exibeItem = false;
                if(lojaDados[ultLoja-1]['type'] == 'all'){
                    exibeItem = true;
                }else if(lojaDados[ultLoja-1]['type'] == 'exclusive'){
                    if(inArray(i, lojaDados[ultLoja-1]['clouth'][dataPart]['clouth'])){
                        exibeItem = true;
                    }
                }else if(lojaDados[ultLoja-1]['type'] == 'exclude'){
                    if(!inArray(i, lojaDados[ultLoja-1]['clouth'][dataPart]['clouth'])){
                        exibeItem = true;
                    }
                }
                
                if(exibeItem){
                    $("#listagem").append(`
                        <div class="item lista" data-id="${i}" onclick="select(this)" id="${item.category}${i}">
                            <div class="item-photo" style="background-image: url('');"></div>
                            <span>N ${i}</span>
                            <div class="price">FREE</div>
                        </div>
                    `);
                    if (oldPart[item.category][0] == i) {
                        select2(i);
                    }  
                }  
            };
        }
        if (item.changeCategory) {
            sexoLoja = item.sexo;
            dataPart = item.category;
            $('#listagem').html('');
            if(item.category == 'p2' || item.category == 'p6'|| item.category == 'p7'){                                  
                $("#listagem").append(`
                    <div class="item lista" data-id="-1" onclick="select(this)" id="${item.category}-1">
                        <span>N ${i}</span>
                        <img src="https://cdn.discordapp.com/attachments/646512396285902851/861123160119312404/trash.png">
                        <div class="price">FREE</div>
                    </div>
                `);
            }
            for (var i = 0; i <= (item.drawa -1); i++) {     
                var exibeItem = false;
                if(lojaDados[ultLoja-1]['type'] == 'all'){
                    exibeItem = true;
                }else if(lojaDados[ultLoja-1]['type'] == 'exclusive'){
                    if(inArray(i, lojaDados[ultLoja-1]['clouth'][dataPart]['clouth'])){
                        exibeItem = true;
                    }
                }else if(lojaDados[ultLoja-1]['type'] == 'exclude'){
                    if(!inArray(i, lojaDados[ultLoja-1]['clouth'][dataPart]['clouth'])){
                        exibeItem = true;
                    }
                }
                
                if(exibeItem){
                    $("#listagem").append(`
                        <div class="item lista" data-id="${i}" onclick="select(this)" id="${item.category}${i}">
                            <div class="item-photo" style="background-image: url('');"></div>
                            <span>N ${i}</span>
                            <div class="price">FREE</div>
                        </div>
                    `);
                    if (oldPart[item.category][0] == i) {
                        select2(i);
                    }  
                }  

            };            
        }

        if(item.changeCategoryColor) {
            $('#listaCores').html('')   
            let itemMax = item.max - 1;      
            for (var i = 0; i <= itemMax; i++) {             
                $("#listaCores").append(`
                    <div class="item listaCor" id="color${i}" onclick="selectColor(this, ${i})">
                        <img src="">
                    </div>
                `);
                if (oldPart[item.category][1] == i) {
                    selectColor2(i);
                }
            };      
        }

        if(item.atualizaRoupa) { 
            oldPart[dataPart][1] = item.color;
        }
    })
});

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function update_valor() {
    const formatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 })
    let total = 0
    for (let key in change) { if (!change[key] == 0) { total += 40 } }
    $('#totalDireita').html(formatter.format(total))
}


function selectPart(element) {    
    let dataPart = element.dataset.idpart;
    dataCat = dataPart;
    $('.category .item').removeClass('ativada');
    $(element).addClass('ativada');    
    $('#listaCores').html('');
    $.post('http://clothes/changePart', JSON.stringify({ part: dataPart }));
}

function select(element) {
    roupaID = element.dataset.id;

    $('.lista').removeClass('selected');
    $(element).addClass('selected'); 

    oldPart[dataPart][0] = roupaID;
    oldPart[dataPart][1] = 0;
    /*$('#showtresD').html(`<model-viewer src="" alt="" environment-image="neutral" id="modelColor" auto-rotate camera-controls></model-viewer>`);*/
    $.post('http://clothes/changeCustom', JSON.stringify({ type: dataPart, id: roupaID, color: 0 }));    
    $.post('http://clothes/updateColor', JSON.stringify({ part: dataCat }));
}

function select2(id) {
    roupaID = id;
    $('.lista').removeClass('selected');
    $(`#${dataPart}${id}`).addClass('selected'); 
    oldPart[dataPart][0] = roupaID;   
    /*$('#showtresD').html(`<model-viewer src="" alt="" environment-image="neutral" id="modelColor" auto-rotate camera-controls></model-viewer>`);*/
    $.post('http://clothes/changeCustom', JSON.stringify({ type: dataPart, id: roupaID, color: oldPart[dataPart][1] }));
    $.post('http://clothes/updateColor', JSON.stringify({ part: dataCat }));
}

function selectColor(element, id){    
    $('.listaCor').removeClass('selected');
    $(element).addClass('selected'); 
    /*$('#showtresD').html(`<model-viewer src="" alt="" environment-image="neutral" id="modelColor" auto-rotate camera-controls></model-viewer>`);*/
    $.post('http://clothes/changeCustom', JSON.stringify({ type: dataPart, id: roupaID, color: id }));
}

function selectColor2(id){    
    $('.listaCor').removeClass('selected');
    $('#color'+id).addClass('selected'); 
}

function open3D(category, item, color){
   if(aberto2){
    aberto2 = false;
    /*$('#showtresD').slideUp(500);*/
   }else{
    aberto2 = true;
    /*$('#showtresD').html(`<model-viewer src="http://131.196.198.222/roupas3D/${category}/${item}_${color}.glb" alt="" environment-image="neutral" id="modelColor" auto-rotate camera-controls></model-viewer>`);
    $('#showtresD').slideDown(500);*/
   }
}

$("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#listagem .item").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});