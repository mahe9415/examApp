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
            questionset: [],
            questionArray: [],
            answer:[],
            item:0,
            flag:false
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
    	onNext: function(){
            this.setAns();
            if(vm.questionArray[vm.item].question_Type=='objective'){
                vm.answer[vm.item]=jq('input[name="ans"]:checked').val();
            }
             if(vm.questionArray[vm.item].question_Type=='fill_in_the_blank_answer'){
                vm.answer[vm.item]=jq("#fill").val();
            }
	        this.postAns();
			vm.item++;

    		if(vm.item>(vm.questionArray.length)-1){
    			alert("thankyou");
    			return;
    		}
    		
    		if(vm.item>0){
                this.questionset.push(vm.questionArray[vm.item]);
    			this.questionset.shift();
    			vm.flag=true;
                this.setAns();
                jq("input[name=ans]").prop('checked', false);
                jq("#fill").val('');
    			return;
    		}
    		        },
        fetchQuestions: function() {
            jq.get('/log', function(doc) {
            vm.questionArray=doc;
            vm.questionset.push(vm.questionArray[vm.item]);
        })},
        onPrev: function() {
 	      	 vm.item=vm.item-1;
             if(vm.item==0){
                vm.flag=false;
            }
             if(vm.item>0){
                vm.flag=true;
             }  
                this.questionset.shift();
                this.questionset.push(vm.questionArray[vm.item]);
                this.setAns();
                this.postAns();
                return;
            },
        setAns:function(){
                    setTimeout(function(){
                    console.warn(vm.answer);
                    if(vm.questionArray[vm.item].question_Type=='objective'){
                        console.log()
                        jq("input[name=ans][value="+vm.answer[vm.item]+"]").attr('checked', 'checked')
                    }
                    if(vm.questionArray[vm.item].question_Type=='fill_in_the_blank_answer'){
                    jq("#fill").val(vm.answer[vm.item]);

                    }
                    return;},0000);
                },
        postAns:function(){
                jq.post('/result',{"answer":vm.answer[vm.item],"question_Id":vm.questionArray[vm.item].question_Id});

        }      

         }      
        
    }
);
