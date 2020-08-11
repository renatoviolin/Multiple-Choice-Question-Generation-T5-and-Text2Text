var data = []
var token = ""
var questions
var answers

jQuery(document).ready(function () {
    var slider_sentences = $('#max_answers')
    slider_sentences.on('change mousemove', function (evt) {
        $('#label_max_answers').text('Max questions: ' + slider_sentences.val())
    })

    $(document).on('click', '#btn_generate', function (e) {
        if ($('#input-text').val() == "") {
            alert('Insert a text')
            return
        }
        $.ajax({
            url: '/process',
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "input_text": $('#input-text').val(),
                "max_answers": $('#max_answers').val(),
                "generate_distractor": $('#generate_distractor').val()
            }),
            beforeSend: function () {
                $('.overlay').show()
                $('#question-container-T5').html('')
                $('#question-container-Text2Text').html('')
            },
            complete: function () {
                $('.overlay').hide()
            }
        }).done(function (jsondata, textStatus, jqXHR) {

            // ======= T5 results ========
            questions = jsondata['q_t5']
            answers = jsondata['a_t5']
            i = 0
            j = 0
            html = ''
            for (i = 0; i < questions.length; i++) {
                html += `<p class="question">${i+1}. ${questions[i]} </p>`
                for (j = 0; j < answers[i].length; j++) {
                    if (answers[i][j][1] == true)
                        html += `<p class="correct">${String.fromCharCode(97+j)}) ${answers[i][j][0]}</p>`
                    else
                        html += `<p>${String.fromCharCode(97+j)}) ${answers[i][j][0]}</p>`
                }
                html += '<br>'
            }
            $('#question-container-T5').html(html)


            // ======= T5 results ========
            questions = jsondata['q_t2']
            answers = jsondata['a_t2']
            i = 0
            j = 0
            html = ''
            for (i = 0; i < questions.length; i++) {
                html += `<p class="question">${i+1}. ${questions[i]} </p>`
                for (j = 0; j < answers[i].length; j++) {
                    if (answers[i][j][1] == true)
                        html += `<p class="correct">${String.fromCharCode(97+j)}) ${answers[i][j][0]}</p>`
                    else
                        html += `<p>${String.fromCharCode(97+j)}) ${answers[i][j][0]}</p>`

                }
                html += '<br>'
            }
            $('#question-container-Text2Text').html(html)


        }).fail(function (jsondata, textStatus, jqXHR) {
            console.log(jsondata)
        });
    })

})