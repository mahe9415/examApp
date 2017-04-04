var jq = $.noConflict();


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
            });

        },
        onNext: function() {

            if (vm.index == (vm.questionArray.length)-1) {
                this.getUserAns(vm.index);
                var length=vm.questionArray.length;
                var count;
                console.log(length);
                debugger;
                for(count=0;count<=length;count++){
                    vm.postAns(vm.questionArray[count].answer,vm.questionArray[count].question_Id);    
            }
                return;
            }
            vm.flag = true;
            this.getUserAns(vm.index);
            vm.index++;
            this.clearAns();
            this.displayQuestion(vm.index);
            setTimeout(function() { vm.previousAns(vm.index) }, 0000);
            
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
            this.displayQuestion(vm.index);
            setTimeout(function() { vm.previousAns(vm.index) }, 0000);
        },
        clearAns: function() {
            jq("input[name=ans]").prop('checked', false);
            jq("#fill").val(undefined);
        },
        getUserAns: function(index) {
            if (vm.question[0].question_Type == 'objective') {
                vm.questionArray[index].answer = jq('input[name="ans"]:checked').val();
            } else if (vm.question[0].question_Type == 'fill_in_the_blank_answer') {
                vm.questionArray[index].answer = jq("#fill").val();
            }
        },
        previousAns: function(index) {
            if (vm.question[0].hasOwnProperty('answer')) {
                if (vm.question[0].question_Type == 'objective') {
                    jq("input[name=ans][value=" + vm.questionArray[index].answer + "]").prop('checked', true);
                } else if (vm.question[0].question_Type == 'fill_in_the_blank_answer') {
                    jq("#fill").val(vm.questionArray[index].answer);
                }
                console.log(vm.questionArray[index].answer);
            }
        },
        postAns: function(ans, id) {
            if (ans == undefined) {
                return;
            }
            jq.ajax({
                headers: {
                    'x-auth': document.cookie.split('=')[1]
                },
                method: 'POST',
                url: '/result',
                data: { "answer": ans, "question_Id": id }
            })
        }
    }
});
