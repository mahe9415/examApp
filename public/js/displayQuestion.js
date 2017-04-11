var jq = $.noConflict();
Vue.component('question', {
    props: ['que', 'id', 'type'],
    template: '<div class="well"><small id="small"> Question {{id}} </small> <small class="pull-right" id="qtype">Type : {{type}}</small><br><h4 style="font-size:25px;">{{que}}</h4></div>'
})
var vm = new Vue({
    el: '#target',
    data() {
        return {
            displayQueue: [],
            questionArray: [],
            addBtn:true,
            editBtn:false
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
        fetchQuestions: function() {
            jq.get('/logAdmin', function(doc) {
                vm.questionArray = doc;
                console.log(doc);
            });

        },
        del: function(id) {
            jq.ajax({
                url: '/log',
                method: 'DELETE',
                data: { "question_Id": id },
                success: function(result) {
                    console.log(result);
                }
            });
        },
        edit: function(id, index) {
            vm1.count=0;
            vm.addBtn=false;
            var promise=new Promise(function(resolve,reject){
            if(vm.questionArray[index].hasOwnProperty("f"))
                {vm1.count=4}
            else if(vm.questionArray[index].hasOwnProperty("e"))
                {vm1.count=3}
            else if(vm.questionArray[index].hasOwnProperty("d"))
                {vm1.count=2}
            else if(vm.questionArray[index].hasOwnProperty("c"))
                {vm1.count=1}
            resolve();
        })
            promise.then(()=>{
            jq("#question").val(vm.questionArray[index].question);
            var type = vm.questionArray[index].question_Type;
            jq("#question_Type").val(type);
            if (type == 'objective') {
                jq("#obj1").attr('class', "");
                jq("#fill_in").attr('class', "hidden");
                jq('input[name="a"]').val(vm.questionArray[index].a)
                jq('input[name="b"]').val(vm.questionArray[index].b)
                jq('input[name="c"]').val(vm.questionArray[index].c)
                jq('input[name="d"]').val(vm.questionArray[index].d)
                jq('input[name="e"]').val(vm.questionArray[index].e)
                jq('input[name="f"]').val(vm.questionArray[index].f)
                jq("input[name=correct_answer][value=" + vm.questionArray[index].correct_answer + "]").prop('checked', true);
            } else if (type == 'fill_in_the_blank_answer') {
                jq("#fill_in").attr('class', "");
                jq("#obj1").attr('class', "hidden");
                jq("#fillup").val(vm.questionArray[index].correct_answer);
            }

            jq.ajax({
                    url: '/log',
                    method: 'PATCH',
                    data: { "question_Id": id },
                    success: function(res) {
                    }
                
            });
    })}
}

})
Vue.component('textbox', {
    props: ['display', 'val'],
    template: '<div class="form-group"><input class="form-control" :placeholder=display :name=val type="text" autocomplete="off"/></div></div>'
})
Vue.component('rbutton', {
    props: ['val'],
    template: '<div class="radio btn-group btn-group" data-toggle="buttons"><label><input type="radio" :value=val name="correct_answer" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span style="font-size:20px; padding-left:10px;"></span>{{val}}</label></div>'
})
var vm1 = new Vue({
    el: '#obj1',
    data() {
        return {
            count: 0
        }
    }
});
jq(document).ready(function() {
    jq(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

jq("#question_Type").on('change', function() {
    if (this.value == 'fill_in_the_blank_answer') {
        jq("#fill_in").attr('class', "");
        jq("#obj1").attr('class', "hidden");
    } else if (this.value == 'objective') {
        jq("#obj1").attr('class', "");
        jq("#fill_in").attr('class', "hidden");
    }
})

function sendForm() {
    var question = jq("#question").val();
    if (question == '') { alert("enter a question"); }
    var question_Type = jq("#question_Type").val();
    if (question_Type == '') { alert('select a question type') }
    var a = jq('input[name="a"]').val()
    console.log(a);
    if (question_Type == 'objective' && a == '') { alert('enter option A') };
    var b = jq('input[name="b"]').val()
    if (question_Type == 'objective' && b == '') { alert('enter option B') };
    var c = jq('input[name="c"]').val()
    var d = jq('input[name="d"]').val()
    var e = jq('input[name="e"]').val()
    var f = jq('input[name="f"]').val()
    var correct_answer = jq('input[name="correct_answer"]:checked').val();
    console.log(correct_answer);
    if (question_Type == 'objective' && correct_answer == undefined) { alert('select correct option') };
    var correct_fillup = jq("#fillup").val().trim();
    if (question_Type == 'fill_in_the_blank_answer' && correct_fillup == '') { alert('Fill the answer') };
    var qset = {};
    qset.question = question
    qset.question_Type = question_Type
    if (question_Type == 'objective') {
        qset.correct_answer = correct_answer;
        qset.a = a;
        qset.b = b;
        qset.c = c;
        qset.d = d;
        qset.e = e;
        qset.f = f;
        qset.correct_answer = correct_answer;
    } else if (question_Type == 'fill_in_the_blank_answer') {
        qset.correct_fillup = correct_fillup
    }
    console.log(qset)
    jq.post('/postQuestions', qset);
}
