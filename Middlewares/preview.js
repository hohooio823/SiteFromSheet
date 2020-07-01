const Tabletop = require('tabletop')
const preview = async (link)=>{
    let elements = [];
    
    let promise = new Promise((resolve, reject)=> {
        Tabletop.init( {
            key: link,
            simpleSheet: true }
          )
        .then((data)=>{
            data.map((ele)=>{
                if(ele.tag==='image'){
                    elements= [...elements,`<img src=${ele.value} />`]
                }
                if(ele.tag==='title'){
                elements= [...elements,`<h1>${ele.value}</h1>`]
                }
            })
            resolve(elements)
        })
      });
    
    return promise;
}
module.exports = {
    preview
}