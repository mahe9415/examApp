var jq = $.noConflict();

Vue.component('option-box', {
    props: ['option'],
    template: '<div class="radio well btn-group btn-group" data-toggle="buttons" ><label><input type="radio" name="ans" value="a" id="u" class="rbtn"><i class="fa fa-circle-o fa-2x"></i><i class="fa fa-check-circle fa-2x"></i><span id="a" style="font-size:20px; padding-left:30px;"></span>{{option}}</label></div>'
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
            // questionset:{question:'',a:'',b:'',c:'',d:''},
            questionset: [],
            questionArray: [],
            i:0,
            b:false
        }
    },
    mounted: function() {
        this.fetchQuestions();
    },
    methods: {
    	next1: function(){
    		if(vm.i>(vm.questionArray.length)-1){
    			alert("thankyou");
    			return;
    		}
    		this.questionset.push(vm.questionArray[vm.i]);   
    		console.log(vm.i);
    		vm.i++;

    		if(vm.i>1){
    			this.questionset.shift();
    			vm.b=true;
    			return;
    		}
    		        },
        fetchQuestions: function() {
            jq.get('/log', function(doc) {
            vm.questionArray=doc;
            vm.next1();
        })},
        prev: function() {
        	if(vm.i==2){
        		this.questionset.shift();
        		vm.b=false;

        	}
        	vm.i=vm.i-2;
       		vm.next1();

         }      
        
    }
});
