var jq = $.noConflict();

Vue.component('optiona-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="a" name="ans"  id="u" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});
Vue.component('optionb-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="b" name="ans"  id="u" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});
Vue.component('optionc-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="c" name="ans"  id="u" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
});
Vue.component('optiond-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" value="d" name="ans"  id="u" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
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
            answer:[],
            index:0,
            flag:false
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
    	onNext: function(){
            this.setAns();
            if(vm.questionArray[vm.index].question_Type=='objective'){
                vm.answer[vm.index]=jq('input[name="ans"]:checked').val();
            }
             if(vm.questionArray[vm.index].question_Type=='fill_in_the_blank_answer'){
                vm.answer[vm.index]=jq("#fill").val();
            }
	        this.postAns();
			vm.index++;

    		if(vm.index>(vm.questionArray.length)-1){
    			alert("thankyou");
    			return;
    		}
    		
    		if(vm.index>0){
             console.info(this.question)

                jq("input[name=ans]").prop('checked', false);

                jq("#fill").val('');

    			this.question.shift();
                this.question.push(vm.questionArray[vm.index]);

    			vm.flag=true;
                this.setAns();
    			return;
    		}
    		        },
        fetchQuestions: function() {
            jq.get('/log', function(doc) {
            vm.questionArray=doc;
            vm.question.push(vm.questionArray[vm.index]);
        })},
        onPrev: function() {
 	      	 vm.index=vm.index-1;
             if(vm.index==0){
                vm.flag=false;
            }
             if(vm.index>0){
                vm.flag=true;
             }  
             console.log(vm.questionArray[vm.index])
             // console.log(this.question)
                this.question.shift();
                this.question.push(vm.questionArray[vm.index]);
                this.setAns();
                this.postAns();
                return;
            },
        setAns:function(){
                    setTimeout(function(){
                    if(vm.questionArray[vm.index].question_Type=='objective'){
                        console.log()
                        jq("input[name=ans][value="+vm.answer[vm.index]+"]").attr('checked', 'checked')
                    }
                    if(vm.questionArray[vm.index].question_Type=='fill_in_the_blank_answer'){
                    jq("#fill").val(vm.answer[vm.index]);

                    }
                    return;},1500);
                },
        postAns:function(){
                jq.post('/result',{"answer":vm.answer[vm.index],"question_Id":vm.questionArray[vm.index].question_Id});

        }      

         }      
        
    }
);
