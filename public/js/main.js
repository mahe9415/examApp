var jq = $.noConflict();
var vm = newVue({
            el: '#question_form',
            data() {
                return {
                    question_array: [];
                }
            },
            mounted: function() {
                this.fetchQuestions();
            },
            methods: {
                fetchQuestions: function() {
                    jq.get('/log', function(doc) {
                        jq.each(doc, function(key, value) {
                            vm.questionArray.push(value);
                        })
                    })
                }


            )
