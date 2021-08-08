 
import _ from 'lodash'           // go to vue ui and install lodash in dependencies

//register global components and see main.js
export default{
    install(app){
        const baseComponents= require.context('../components/base/',false,/[A-Za-z0-9-_,\s]+\.vue$/i ,
        )               // regx for only vue files
    
    baseComponents.keys().forEach((fileName)=>{
        const componentConfig = baseComponents(fileName)
        const componentName = _.upperFirst(_.camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')))
        // console.log(componentName);

        app.component(`Base${componentName}` , componentConfig.default || componentConfig )
    })
}
}