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
            answer: [],
            index: 0,
            flag: false
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
        onNext: function() {
            if (vm.questionArray[vm.index].question_Type == 'fill_in_the_blank_answer') {
                vm.answer[vm.index] = jq("#fill").val();
                // console.log(vm.answer[vm.index] + " fill " + vm.index);
            } else {
                vm.answer[vm.index] = jq('input[name="ans"]:checked').val();
                // console.log(vm.answer[vm.index] + " check " + vm.index);
            }
            this.setAns();
            this.postAns();
            vm.index = vm.index + 1;

            if (vm.index > (vm.questionArray.length) - 1) {
                alert("thankyou");
                return;
            }

            if (vm.index > 0) {
                this.question = [];
                this.question.push(vm.questionArray[vm.index]);
                vm.flag = true;
                return;
            }
        },
        fetchQuestions: function() {
            jq.get('/log', function(doc) {
                vm.questionArray = doc;
                vm.question.push(vm.questionArray[vm.index]);
            })
        },
        onPrev: function() {
            this.question = [];
            vm.index = vm.index - 1;
            if (vm.index == 0) {
                vm.flag = false;
            } else {
                vm.flag = true;
            }
            this.question.push(vm.questionArray[vm.index]);
            this.setAns();
            return;
        },
        setAns: function() {
            setTimeout(function() {
                if (vm.questionArray[vm.index].question_Type == 'objective') {
                    jq('input[name=ans][value=' + vm.answer[vm.index] + ']').attr('checked', 'checked');
                } else if (vm.questionArray[vm.index].question_Type == 'fill_in_the_blank_answer') {
                    jq('#fill').val(vm.answer[vm.index]);
                }
                return;
            }, 0000);
        },
        postAns: function() {
            if (vm.answer[vm.index] == undefined || vm.answer[vm.index] == '') {
                // console.log("msg");
                return;
            }
            jq.ajax({
                method: 'POST',
                url: '/result',
                data: { "answer": vm.answer[vm.index], "question_Id": vm.questionArray[vm.index].question_Id }
            })
            jq('input[name=ans]').prop('checked', false);
            jq('#fill').val(undefined);
        },
        check: function() {
            alert(cool);
        }

    }

});

jq(document).ready(function() {
    jq("input").on('change', function() {
        console.log("changed");
        vm.postAns();
    })
    console.log("msg");
})
