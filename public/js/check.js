// var jq = $.noConflict();
jq(document).ready(function(){
    jq('#a,#b,#c,#d').change(function() {
    console.log("msg");    
    alert("changed");
    })
}
)