import { defineRule, ErrorMessage, Field as VeeField, Form as VeeForm,configure } from 'vee-validate'
import { max,min,required,alpha_spaces as alphaSpaces ,email,min_value as minVal, max_value as maxVal,confirmed,not_one_of as excluded} from '@vee-validate/rules'
// import { max, min } from "lodash"
// import { required } from "yargs"

export default{
    install(app){
        app.component('VeeForm',VeeForm)
        app.component('VeeField',VeeField)
        app.component('ErrorMessage',ErrorMessage)

        defineRule('required',required)
        defineRule('tos',required)
        defineRule('min',min)
        defineRule('max',max)
        defineRule('email',email)
        defineRule('min_value',minVal)
        defineRule('max_value',maxVal)
        defineRule('confirmed',confirmed)
        defineRule('alpha_spaces',alphaSpaces)
        defineRule('excluded',excluded)

        configure({
            generateMessage(ctx){
                const messages ={
                    required: `The field ${ctx.field} is required`,
                    min: `The field ${ctx.field} is short`,
                    max: `The field ${ctx.field} is long`,
                    email:`The field ${ctx.field} must be a valid email`,
                    min_value:`The field ${ctx.field} is low`,
                    max_value:`The field ${ctx.field} is long`,
                    excluded:`you are not allowed to use this value ${ctx.field}`,
                    confirmed:`The password mismatch`,
                    tos:`You must accept the Terms of Service`

                }
                
                const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${context.field} is invalid`
                return message
            },
            validateOnBlur:true,
            validateOnChange:true,
            validateOnInput:false,
            validateOnModelUpdate:true
        })
          
        

    }
}