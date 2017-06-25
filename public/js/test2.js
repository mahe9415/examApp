var jq = $.noConflict();
// Vue.component('optionbox', {
//     props: ['option', 'val'],
//     template: '<label class="radio well btn-group" data-toggle="buttons" ><input type="radio" :value=val name="ans"  class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label>'
// });

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
Vue.component('question', {
    props: ['que','index'],
    template: '<div class="well q"><small id="small"> Question </small> <small id="qtype">{{index +1}} of {{length}}</small><br><h4 id="question1" style="font-size:20px;">{{que}}</h4></div>',
    data(){
        return{
            length:vm.questionArray.length
        }
    }
});
Vue.component('text-box', {
    template: '<input type="text" id="fill" name="fill_in_the_blank_answer" autocomplete="off">'
})
Vue.component('sidebar',{
    props:['i'],
    template:`<li class="box" @click="goto(i)">{{i+1}}</li>`,
    methods:{
        goto(i){
            vm.getUserAns(vm.index)
            vm.clearAns()
            vm.displayQuestion(i)
            vm.index=i
             var promise = new Promise(function(resolve, reject) {
              
                resolve();
            });
            promise.then(function() {
                vm.clearAns();
                vm.previousAns(vm.index)
            })
            // vm.previousAns(vm.index)
            // vm.getUserAns(vm.index)
        }
    }
})
// Vue.component('checkbox', {
//     props: ['option','val'],
//     // template: '<div><input type="checkbox" name="group2" id="checkbox-2"><label for="checkbox-2"><span class="checkbox">{{option}}</span></label></div>'
//     template:'<label class="wrap well btn-group radio" :for="val"><input type="checkbox" name="checkbox" :value="val" :id="val"><label :for="val"><span class="checkbox">{{option}}</span></label></label>'
// })
Vue.component('optionbox',{
    props:['option','val'],
    template:'<div><input type="radio" :value="val" name="ans" :id="val"><label class="radio well btn-group rbtn" :for="val">{{option}}</label></div>'
})
Vue.component('checkbox', {
    props: ['option','val'],
    // template: '<div><input type="checkbox" name="group2" id="checkbox-2"><label for="checkbox-2"><span class="checkbox">{{option}}</span></label></div>'
    template:'<div><input type="checkbox" name="checkbox" :value="val" :id="val"><label class="radio well btn-group rbtn" :for="val">{{option}}</label></div>'
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
                        item.answer=' ';
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
                        console.log(value.value);
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
                    'x-auth': getCookie('x-auth')
                    // 'x-auth':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTMwMjVlNjM3MTg3ZDA4YzZjOGRhNzIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk2MzI3NjU0fQ.dn5kfy0JdeiZkfY3ZefXPCOXMIMPzIyx9g5_hVVnbJo'
                },
                method: 'POST',
                url: '/result',
                data: { "answer": ans },
                success: function(result) {
                    alert("You are Done!!")
                    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                    localStorage.is_loggedin=false;
                    window.location.pathname='/'
                }

            })
        },
        deleteAllCookies:function() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

    }

});

jq(document).ready(function() {
    if(!localStorage.is_loggedin){
        window.location='/'
    }
    var mins;
    jq.get('/time',function(data,status){
         mins=data[0].total
    })
    var sec = 59;
    var displayClock = jq("#clock");
    setInterval(function() {
        if (document.hidden){
            alert("logged out");
        }
        if (sec == 0) {
            mins--;
            if(mins==0 && sec==0){
                g()
            }
            sec=60
            console.log(mins)
        }
        jq("#clock").text(mins-1 + ":" + sec--)
    }, 1000);
    var g=()=>{
        vm.index=vm.questionArray.length - 1
        vm.onNext()
    }
})
