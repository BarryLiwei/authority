import Vue from 'vue'

const builder = Vue.component('ueb-builder',{
    props:{
       builder:{
        type:[String,Function],
        required:true
       } 
    },
    render(createElement){
        return createElement('span',{

        })
    }
})