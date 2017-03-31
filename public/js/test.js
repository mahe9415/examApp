var jq = $.noConflict();

jq(document).ready(function() {
    alert("dc");

})

Vue.component('optiona-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="a" name="ans"  id="a" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});
Vue.component('optionb-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="b" name="ans"  id="b" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});
Vue.component('optionc-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="c" name="ans"  id="c" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});
Vue.component('optiond-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="d" name="ans"  id="d" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});

Vue.component('question', {
    props: ['que'],
    template: '<div class="well"><small id="small"> Question</small> <small id="qtype"></small><br><h4 id="question1" style="font-size:25px;">{{que}}</h4></div>'
});
Vue.component('text-box', {
    template: '<input type="text" id="fill" name="fill_in_the_blank_answer" autocomplete="off">'
})

var vm = new Vue({
    el: '#target',
    data() {
        return {
            question: [],
            questionArray: [],
            answer: [],
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
                vm.question.push(vm.questionArray[vm.index]);
            })
        },
        onNext: function() {
            debugger;
            if(vm.setAns(vm.index+1)){
            if (vm.index != 0) { vm.flag = true; }
            vm.question = [];
            var answer = jq('input[name="ans"]:checked').val();
            if ((vm.questionArray[vm.index].question_Type == 'objective') && (answer !== undefined)) {
                if (vm.questionArray[vm.index].answer != answer) {
                    vm.questionArray[vm.index].answer = answer;
                }
            } else if (vm.questionArray[vm.index].question_Type == 'fill_in_the_blank_answer') {
                answer = jq("#fill").val();
                if (answer == '') { answer = undefined }
                vm.questionArray[vm.index].answer = answer;
            }
            this.postAns(vm.questionArray[vm.index].answer, vm.questionArray[vm.index].question_Id)
            vm.index++;
            console.log(vm.index);
            this.question.push(vm.questionArray[vm.index]);

        }},
        onPrev: function() {
            debugger;
            vm.index = vm.index - 2;
            console.log(vm.index);
            if (vm.index < 0) {
                vm.index=0;
                vm.question.push(vm.questionArray[vm.index]);
            }
            vm.onNext();
        },
        postAns: function(ans, id) {
            if (ans == undefined) {
                return true;
            }
            jq.ajax({
                headers: {
                    'x-auth': document.cookie.split('=')[1]
                },
                method: 'POST',
                url: '/result',
                data: { "answer": ans, "question_Id": id }
            })
            jq("input[name=ans]").prop('checked', false);
            jq("#fill").val(undefined);
            return true;
        },
        setAns: function(index) {

                if (vm.questionArray[index].hasOwnProperty('answer')) {
                    if (vm.questionArray[index].question_Type == 'objective') {
                        jq("input[name=ans][value=" + vm.questionArray[index].answer + "]").prop('checked', true);
                    } else if (vm.questionArray[index].question_Type == 'fill_in_the_blank_answer') {
                        jq("#fill").val(vm.questionArray[index].answer);
                    }
                }
                return true;
                // else if(!vm.questionArray[index-1].hasOwnProperty('answer')){console.log("msg")}
            }

        }
    }
);
