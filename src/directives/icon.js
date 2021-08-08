export default {
    beforeMount(el,binding){
        let iconClass = `fa fa-${binding.value} float-right text-green-400 text-2xl`
        if(binding.arg === 'full'){
            iconClass = binding.value
        }
        if(binding.modifiers.right){
            iconClass += ' float-right'                // space is must at starting of float-right
        }
        if(binding.modifiers.yellow){
            iconClass += ' text-yellow-400'
        }else{
            iconClass += ' text-green-400'
        }


        el.innerHTML += `<i class="${iconClass}"></i>`

    }

}










// directive life cycles
// 1.beforeMount   --  called first
// 2.mounted    --  called when document is mounted
//3.beforeUpdate -- it called before update
// 4.updated
// 5.beforeUnmount
// 6.unmounted


/// arguments
// 1.el  --- element binding sits on
// 2.binding -- an object wich contains arguments the are passed into hooks
// 3.vnode -- allows you to refre directly to the node in the virtual dom
// 4.prevNode