var jq = $.noConflict();
Vue.component('question', {
    props: ['que', 'id', 'type'],
    template: '<div class="well"><small id="small"> Question {{id}} </small> <small class="pull-right" id="qtype">Type : {{type}}</small><br><h4 style="font-size:25px;">{{que}}</h4></div>'
})
function resetAll() {
    jq('input').prop('checked', false);
    jq('input[type="text"]').val('');
    jq('#question').val('');
    // jq('option').attr('selected', false);
    // jq("#question_Type").find('option:first').prop('selected', true);
    vm.fetchQuestions();
    // vm1.count=0;
}
var vm = new Vue({
    el: '#target',
        beforeCreate(){
            if(!localStorage.admin){
                window.location.href="/admin"
            }
        },
    data() {
        
        return {
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
            resetAll();
            vm1.count = 0;
            vm2.addBtn = false;
            vm2.id = id;
            var promise = new Promise(function(resolve, reject) {
                if (vm.questionArray[index].hasOwnProperty("f")) { vm1.count = 6 } else if (vm.questionArray[index].hasOwnProperty("e")) { vm1.count = 5 } else if (vm.questionArray[index].hasOwnProperty("d")) { vm1.count = 4 } else if (vm.questionArray[index].hasOwnProperty("c")) { vm1.count = 3 } else {
                    vm1.count = 2
                }
                if (vm.questionArray[index].hasOwnProperty("c6")) { vm3.count = 6 } else if (vm.questionArray[index].hasOwnProperty("c5")) { vm3.count = 5 } else if (vm.questionArray[index].hasOwnProperty("c4")) { vm3.count = 4 } else if (vm.questionArray[index].hasOwnProperty("c3")) { vm3.count = 3 } else {
                    vm3.count = 2
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
                    jq("#check").attr('class','hidden');
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
                    jq("#check").attr('class','hidden');
                    jq("#obj1").attr('class', "hidden");
                    
                }
                else if(type == 'checkbox'){
                    jq("#obj1").attr('class', "hidden");
                    jq("#fill_in").attr('class', "hidden");
                    jq("#check").attr('class','');
                    // console.log(vm.questionArray[index].correct_answer[1]);
                    jq('input[name="checkbox"][value='+vm.questionArray[index].correct_answer[0]+']').prop('checked', true);
                    jq('input[name="checkbox"][value='+vm.questionArray[index].correct_answer[2]+']').prop('checked', true);
                    jq('input[name="checkbox"][value='+vm.questionArray[index].correct_answer[4]+']').prop('checked', true);
                    jq('input[name="checkbox"][value='+vm.questionArray[index].correct_answer[6]+']').prop('checked', true);
                    jq('input[name="checkbox"][value='+vm.questionArray[index].correct_answer[8]+']').prop('checked', true);
                    jq('input[name="checkbox"][value='+vm.questionArray[index].correct_answer[10]+']').prop('checked', true);
                    jq('input[name="c1"]').val(vm.questionArray[index].c1)
                    jq('input[name="c2"]').val(vm.questionArray[index].c2)
                    jq('input[name="c3"]').val(vm.questionArray[index].c3)
                    jq('input[name="c4"]').val(vm.questionArray[index].c4)
                    jq('input[name="c5"]').val(vm.questionArray[index].c5)
                    jq('input[name="c6"]').val(vm.questionArray[index].c6)
                    
                }

            })
        }
    }

})
Vue.component('checkbox',{
    props:['val'],
    template:'<div class="form-group btn-group"><input  type="checkbox" name="checkbox" :value="val" :id="val" > <label :for="val"> {{val}}</label></div>'
})

Vue.component('textbox', {
    props: ['display', 'val'],
    template: '<div class="form-group"><input class="form-control" :placeholder=display :name=val type="text" autocomplete="off"/></div></div>'
})
Vue.component('rbutton', {
    props: ['val'],
    template: '<div class="radio btn-group" data-toggle="buttons"><label><input type="radio" :value=val name="correct_answer" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span style="font-size:20px; padding-left:10px;"></span>{{val}}</label></div>'
})
var vm1 = new Vue({
    el: '#obj1',
    data() {
        return {
            count: 2
        }
    }
});
var vm3=new Vue({
    el:'#check',
    data() {
        return{
            count:2,
            addBtn:true
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
        jq("#obj1").attr('class', 'hidden');
        jq("#check").attr('class','hidden');
    } else if (this.value == 'objective') {
        // vm1.count=2;
        jq("#obj1").attr('class', "");
        jq("#fill_in").attr('class', "hidden");
        jq("#check").attr('class','hidden');
    } else if(this.value == 'checkbox'){
        jq("#check").attr('class','');
        jq("#fill_in").attr('class', "hidden");
        jq("#obj1").attr('class', 'hidden');
    }

})
function checked () {
    var checkedvalues=jq('input[name="checkbox"]:checked').each(function() {
   return(this.value);
});
   return checkedvalues;
}

function formValidation() {
    var question = jq("#question").val();
    if (question == '') 
        { alert("enter a question"); return false }
    var question_Type = jq("#question_Type").val();
    if (question_Type == '') 
        { alert('select a question type'); return false ;}
    var a = jq('input[name="a"]').val()
    if (question_Type == 'objective'&& a == '') 
        { alert('enter option A'); return false };
    var b = jq('input[name="b"]').val()
    if (question_Type == 'objective'&& b == '') 
        { alert('enter option B'); return false };
    var c = jq('input[name="c"]').val()
    var d = jq('input[name="d"]').val()
    var e = jq('input[name="e"]').val()
    var f = jq('input[name="f"]').val()
    var c1=jq('input[name="c1"]').val()
    var c2=jq('input[name="c2"]').val()
    if(question_Type == 'checkbox' && c1==''){
        alert('enter option A'); return false
    }
    if(question_Type == 'checkbox' && c2==''){
        alert('enter option B'); return false
    }
    var c3=jq('input[name="c3"]').val()
    var c4=jq('input[name="c4"]').val()
    var c5=jq('input[name="c5"]').val()
    var c6=jq('input[name="c6"]').val()

    var correct_answer = jq('input[name="correct_answer"]:checked').val();
    var correct_fillup = jq("#fillup").val().trim();
    // var correct_checkbox=jq('input[name="checkbox"]:checked');
    // console.log(correct_checkbox);
    var correct_checkbox = checked()

    // console.log(correct_checkbox[0].value);
    // console.log(correct_answer);
    if (question_Type == 'objective' && correct_answer == undefined)
     { alert('select correct option'); return false }
    
    else if (question_Type == 'fill_in_the_blank_answer' && correct_fillup == '') 
        { alert('Fill the answer'); return false }

    else if(question_Type == 'checkbox' && checked().length<2){
        alert("select any 2 answers");return false
    }
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
        // qset.correct_answer = correct_answer;
    } else if (question_Type == 'fill_in_the_blank_answer') {
        qset.correct_fillup = correct_fillup
    } else if(question_Type == 'checkbox')
    {
        qset.c1=c1;
        qset.c2=c2;
        qset.c3=c3;
        qset.c4=c4;
        qset.c5=c5;
        qset.c6=c6;
        var correct=[];
        // console.log(Object.values(correct_checkbox));
         for(value of correct_checkbox){
            // console.log(value)
            correct.push(value['value'])
    }
        qset.correct_checkbox=correct;
    }
    
    qset.time=jq('.time input[type="text"]').val()
"4"
    return qset
}

function postQuestion(question) {
    jq.post('/postQuestions', question, function() {
        resetAll();
    })
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
        clear:function()
        {
            vm2.addBtn=true
    jq('input').prop('checked', false);
    jq('input[type="text"]').val('');
    jq('#question').val('');
        },
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

