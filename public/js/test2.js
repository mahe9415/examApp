var jq = $.noConflict();
Vue.component('optionbox', {
    props: ['option', 'val'],
    template: '<label class="radio well btn-group" data-toggle="buttons" ><input type="radio" :value=val name="ans"  id="a" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label>'
});
Vue.component('question', {
    props: ['que'],
    template: '<div class="well"><small id="small"> Question</small> <small id="qtype"></small><br><h4 id="question1" style="font-size:25px;">{{que}}</h4></div>'
});
Vue.component('text-box', {
    template: '<input type="text" id="fill" name="fill_in_the_blank_answer" autocomplete="off">'
})
Vue.component('checkbox', {
    props: ['option','val'],
    // template: '<div><input type="checkbox" name="group2" id="checkbox-2"><label for="checkbox-2"><span class="checkbox">{{option}}</span></label></div>'
    template:'<label class="wrap well btn-group radio" :for="val"><input type="checkbox" name="checkbox" :id="val"><label :for="val"><span class="checkbox">{{option}}</span></label></label>'
})

function checked() {
    var checkedvalues = jq('input[name="checkbox"]:checked').each(function() {
        return (this.value);
    });
    return checkedvalues;
}
var vm = new Vue({
    el: '#target',
    data() {
        return {
            question: [],
            questionArray: [],
            index: 0,
            flag: false
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
        fetchQuestions: function() {
            jq.get('/log', function(doc) {
                vm.questionArray = doc;
                console.log(doc);
                vm.question.push(vm.questionArray[vm.index]);
            });
        },
        onNext: function() {
            if (vm.index == (vm.questionArray.length) - 1) {
                this.getUserAns(vm.index);
                var length = vm.questionArray.length;
                var count;
                console.log(length);
                var arr = vm.questionArray.map(function(item) {
                    if(item.answer==undefined){
                        item.answer='';
                    }
                    var answer = item.answer.toString();
                    console.log(answer)
                    var question_Id = item.question_Id;
                    return { "userAnswer": answer, "question_Id": question_Id, "ans_validate": "" };
                })
                this.postAns(arr);
                // window.location.pathname = '/displayResult';
                return;
            }
            vm.flag = true;
            vm.getUserAns(vm.index);
            vm.index++;
            var promise = new Promise(function(resolve, reject) {
                vm.displayQuestion(vm.index);
                resolve();
            });
            promise.then(function() {
                vm.clearAns();
                vm.previousAns(vm.index)
            })

            // setTimeout(function() {  }, 500);

        },
        displayQuestion: function(index) {
            vm.question = [];
            vm.question.push(vm.questionArray[index]);
        },
        onPrev: function() {
            this.getUserAns(vm.index);
            this.clearAns();
            vm.index--;
            if (vm.index == 0) { vm.flag = false };
            var promise = new Promise(function(resolve, reject) {
                vm.displayQuestion(vm.index);
                resolve();
            });
            promise.then(function() {
                    vm.previousAns(vm.index)
                })
                // this.displayQuestion(vm.index);
                // setTimeout(function() { vm.previousAns(vm.index) },500);
        },
        clearAns: function() {
            jq("input[name=ans]").prop('checked', false);
            jq("#fill").val(undefined);
            jq("input[name=checkbox]").prop('checked', false);

        },
        getUserAns: function(index) {
            if (vm.question[0].question_Type == 'objective') {
                vm.questionArray[index].answer = jq('input[name="ans"]:checked').val();
            } else if (vm.question[0].question_Type == 'fill_in_the_blank_answer') {
                vm.questionArray[index].answer = jq("#fill").val();
            } else if (vm.question[0].question_Type == 'checkbox') {
                var answer = checked();
                var checkedAnswer=[];
                // console.log(answer)
                for (value of answer) {
                    if(value.value){
                    checkedAnswer.push(value['value']);
                }
                }
                    console.log(checkedAnswer);
                    vm.questionArray[index].answer = checkedAnswer;
            }
        },
        previousAns: function(index) {
            if (vm.question[0].hasOwnProperty('answer')) {
                if (vm.question[0].question_Type == 'objective') {
                    jq("input[name=ans][value=" + vm.questionArray[index].answer + "]").prop('checked', true);
                } else if (vm.question[0].question_Type == 'fill_in_the_blank_answer') {
                    jq("#fill").val(vm.questionArray[index].answer);
                }
                else if (vm.question[0].question_Type == 'checkbox'){

                    jq("input[name=checkbox][value=" + vm.questionArray[index].answer[0] + "]").prop('checked', true);
                    jq("input[name=checkbox][value=" + vm.questionArray[index].answer[1] + "]").prop('checked', true);
                    jq("input[name=checkbox][value=" + vm.questionArray[index].answer[2] + "]").prop('checked', true);
                    jq("input[name=checkbox][value=" + vm.questionArray[index].answer[3] + "]").prop('checked', true);
                    jq("input[name=checkbox][value=" + vm.questionArray[index].answer[4] + "]").prop('checked', true);
                    jq("input[name=checkbox][value=" + vm.questionArray[index].answer[5] + "]").prop('checked', true);
                }
                console.log(vm.questionArray[index].answer);
            }
        },
        postAns: function(ans) {
            jq.ajax({
                headers: {
                    'x-auth': document.cookie.split('=')[1]
                },
                method: 'POST',
                url: '/result',
                data: { "answer": ans },
                success: function(result) {
                    // window.location.pathname='/displayResult';
                }

            })
        }
    }

});

jq(document).ready(function() {
    var mins = 0;
    var sec = 0;
    var displayClock = jq("#clock");
    setInterval(function() {
        if (document.hidden) {
            alert("logged out");
            console.log("hg");
        }
        if (sec == 59) {
            mins++;
            sec = 0;
        }
        jq("#clock").text(mins + ":" + sec++)
    }, 1000);
})
