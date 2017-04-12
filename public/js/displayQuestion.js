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
            questionArray: []
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
        fetchQuestions: function() {
            jq.get('/logAdmin', function(doc) {

                vm.questionArray = doc.reverse();
                
                console.log(doc);
            });

        },
        del: function(id) {
            jq.ajax({
                url: '/log',
                method: 'DELETE',
                data: { "question_Id": id },
                success: function(result) {
                    // console.log(result);
                    resetAll();
                }
            });
        },
        edit: function(id, index) {
            vm1.count = 0;
            vm2.addBtn = false;
            vm2.id = id;
            var promise = new Promise(function(resolve, reject) {
                if (vm.questionArray[index].hasOwnProperty("f")) { vm1.count = 6 } else if (vm.questionArray[index].hasOwnProperty("e")) { vm1.count = 5 } else if (vm.questionArray[index].hasOwnProperty("d")) { vm1.count = 4 } else if (vm.questionArray[index].hasOwnProperty("c")) { vm1.count = 3 } else {
                    vm1.count = 2
                }
                resolve();
            })
            promise.then(() => {
                jq("#question").val(vm.questionArray[index].question);
                var type = vm.questionArray[index].question_Type;
                jq("#question_Type").val(type);
                if (type == 'objective') {
                    // var promise1=new Promise((resolve,reject)=>{
                    // debugger;
                    console.log("msg");
                    jq("#obj1").attr('class', "");
                    jq("#fill_in").attr('class', "hidden");
                    jq('input[name=correct_answer][value='+vm.questionArray[index].correct_answer+']').prop('checked', true);
                    
                    // resolve();
                    // })
                    // promise1.then(()=>{
                    jq('input[name="a"]').val(vm.questionArray[index].a)
                    jq('input[name="b"]').val(vm.questionArray[index].b)
                    jq('input[name="c"]').val(vm.questionArray[index].c)
                    jq('input[name="d"]').val(vm.questionArray[index].d)
                    jq('input[name="e"]').val(vm.questionArray[index].e)
                    jq('input[name="f"]').val(vm.questionArray[index].f)
                    // })
                } else if (type == 'fill_in_the_blank_answer') {
                    jq("#fillup").val(vm.questionArray[index].correct_answer);
                    jq("#fill_in").attr('class', "");
                    jq("#obj1").attr('class', "hidden");
                    
                }

            })
        }
    }

})
Vue.component('checkbox',{
    props:['val','textval'],
    template:'<div class="form-group"> <input class="form-control" type="checkbox" name="checkbox" :id="val"><label :for="val"> <input class="form-control" type="text" :id="textval"></label></div>'
})
var vm3=new Vue({
    el:'#check'
});
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
            count: 2
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
    // vm1.count=0;
    if (this.value == 'fill_in_the_blank_answer') {
        jq("#fill_in").attr('class', "");
        jq("#obj1").attr('class', "hidden");
    } else if (this.value == 'objective') {
        // vm1.count=2;
        jq("#obj1").attr('class', "");
        jq("#fill_in").attr('class', "hidden");
    }

})


function formValidation() {
    var question = jq("#question").val();
    if (question == '') { alert("enter a question"); return false }
    var question_Type = jq("#question_Type").val();
    if (question_Type == '') { alert('select a question type'); return false ;}
    var a = jq('input[name="a"]').val()
    console.log(a);
    if (question_Type == 'objective' && a == '') { alert('enter option A'); return false };
    var b = jq('input[name="b"]').val()
    if (question_Type == 'objective' && b == '') { alert('enter option B'); return false };
    var c = jq('input[name="c"]').val()
    var d = jq('input[name="d"]').val()
    var e = jq('input[name="e"]').val()
    var f = jq('input[name="f"]').val()
    var correct_answer = jq('input[name="correct_answer"]:checked').val();
    console.log(correct_answer);
    if (question_Type == 'objective' && correct_answer == undefined) { alert('select correct option'); return false };
    var correct_fillup = jq("#fillup").val().trim();
    if (question_Type == 'fill_in_the_blank_answer' && correct_fillup == '') { alert('Fill the answer'); return false };
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
    return qset
}

function postQuestion(question) {
    jq.post('/postQuestions', question, function() {
        resetAll();
    })
}

function resetAll() {
    jq('input').prop('checked', false);
    jq('input[type="text"]').val('');
    jq('#question').val('');
    // jq('option').attr('selected', false);
    // jq("#question_Type").find('option:first').prop('selected', true);
    vm.fetchQuestions();
    // vm1.count=0;
}



var vm2 = new Vue({
    el: "#btn",
    data() {
        return {
            addBtn: true,
            id: 0
        }
    },
    methods: {
        sendForm: function() {
            var data = formValidation()
            if(!data){return}
            postQuestion(data);

        },
        updateForm: function() {
            var data = formValidation();
            console.log(data)
            console.log(this.id);
            jq.ajax({
                url: '/log',
                method: 'PATCH',
                data: { "question_Id": vm2.id, "data": data },
                success: function(res) {
                 vm2.id=0;
                 vm2.addBtn=true;   
                resetAll();
            }
            });

        }
    }
})
