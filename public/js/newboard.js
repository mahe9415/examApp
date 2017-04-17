var jq = $.noConflict();
// var data={qText:'ghjnkml'};
var question= {
    props: ['que', 'id', 'type'],
    data() {
        return {
            questionArray: []
        }
    },
    template: '<div class="well"><small id="small"> Question {{id}} </small> <small class="pull-right" id="qtype">Type : {{type}}</small><br><h4 style="font-size:25px;">{{que}}</h4></div>',
    mounted: function() {
    	console.log("msg");
        this.fetchQuestions();

    },
    methods: {
        fetchQuestions() {
            jq.get('/logAdmin', function(doc) {
                questionArray = doc.reverse();
                console.log(doc);
            });
        }
    }
};
var qt = {
    data() {
        return { qtext: "" }
    },
    template: '<div class="form-group"><textarea class="form-control" id="question" name="question" placeholder="Type the Question" rows="5" v-model="qtext"></textarea>{{qtext}}</div>'
}
new Vue({
    el: '#div1',
    data() {
        return {
            questionText: "ajiskmxajks"
        }
    },
    components: { "question-text": qt }

})
new Vue({
	el:'#div2',
	data(){
		return{questionArray:[]}
	},
	components:{question}
})