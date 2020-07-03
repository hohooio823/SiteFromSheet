const Tabletop = require('tabletop')
const fetch = require('node-fetch')
const Promises = require('bluebird');

const preview = async (link)=>{
    let elements = [];
    
    let promise = new Promise((resolve, reject)=> {
        Tabletop.init( {
            key: link,
            simpleSheet: true }
          )
        .then((data)=>{
            return(
                Promises.map(data,(ele)=>{
                    if(ele.tag==='image'){
                        elements= [...elements,`<img class='row' src=${ele.value} />`]
                    }
                    if(ele.tag==='title'){
                    elements= [...elements,`<h1 class='row' >${ele.value}</h1>`]
                    }
                    if(ele.tag==='youtube'){
                        const id = ele.value.split("v=")[1].substring(0, 11)
                        elements= [...elements,`<iframe width="750" height="420" src=${'https://www.youtube.com/embed/'+id} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`]
                    }
                    if(ele.tag==='twitter'){
                        return(new Promise((resolve,reject)=>{
                            fetch(`https://publish.twitter.com/oembed?url=${encodeURI(ele.value)}`)
                            .then((res)=>res.json())
                            .then((res)=>{
                                resolve(elements= [...elements,res.html])
                            })
                        }))
                    }
                    if(ele.tag==='instagram'){
                        return(new Promise((resolve,reject)=>{
                            fetch(`https://api.instagram.com/oembed?url=${ele.value}`)
                            .then((res)=>res.json())
                            .then((res)=>{
                                resolve(elements= [...elements,res.html])
                            })
                        }))
                    }
                    if(ele.tag==='map'){
                        const [lat,lng] = ele.value.split(',');
                        elements= [...elements,`
                            <div id="map" style='height:400px;width:100%'></div>
                                <script>
                            // Initialize and add the map
                            function initMap() {
                            // The location of Uluru
                            var uluru = {lat: ${lat}, lng: ${lng}};
                            // The map, centered at Uluru
                            var map = new google.maps.Map(
                                document.getElementById('map'), {zoom: 4, center: uluru});
                            // The marker, positioned at Uluru
                            var marker = new google.maps.Marker({position: uluru, map: map});
                            }
                                </script>
                                <!--Load the API from the specified URL
                                * The async attribute allows the browser to render the page while the API loads
                                * The key parameter will contain your own API key (which is not needed for this tutorial)
                                * The callback parameter executes the initMap() function
                                -->
                                <script async defer
                                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCmmS2aCB-VKLZ_xjAOGEMug9MJlZVYbjw&callback=initMap">
                                </script>`]
                    }
                    if(ele.tag==='card'){
                        return(new Promise((resolve,reject)=>{
                            Tabletop.init( {
                                key: ele.value,
                                simpleSheet: true }
                            )
                            .then((res)=>{
                                let cards = [];
                                res.map((elem)=>{
                                    cards!==undefined?cards +=`<div class="card" style="width: 18rem;">
                                    <img src=${elem.image} class="card-img-top" alt="...">
                                    <div class="card-body">
                                    <h5 class="card-title">${elem.title}</h5>
                                    <p class="card-text">${elem.description}</p>
                                    </div>
                                </div>`:cards = `<div class="card" style="width: 18rem;">
                                <img src=${elem.image} class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">${elem.title}</h5>
                                <p class="card-text">${elem.description}</p>
                                </div>
                            </div>`
                                })
                                resolve(elements= [...elements,`<div class="card-deck">${cards}</div>`])
                            })
                        }))
                    }
                    if(ele.tag==='table'){
                        return(new Promise((resolve,reject)=>{
                            Tabletop.init( {
                                key: ele.value,
                                simpleSheet: true }
                            )
                            .then((res)=>{
                                let table ;
                                const entry = Object.entries(res[0]);
                                let keys ;
                                entry.map((key)=>keys!==undefined?keys+=`<th scope="col">${key[0]}</th>`:keys=`<th scope="col">${key[0]}</th>`)
                                const head = `<thead><tr>${keys}</tr></thead>`
                                res.map((elem)=>{
                                        const columns = Object.values(elem);
                                        let column = [];
                                        columns.map((col=>column!==undefined?column +=`<td>${col}</td>`:column = `<td>${col}</td>`))
                                        table!==undefined?table +=`<tr>${column}</tr>`:table = `<tr>${column}</tr>`
                                })
                                resolve(elements= [...elements,'<table class="table table-bordered table-hover">'+head+'<tbody>'+table+' </tbody></table>'])
                            })
                        }))
                    }
                })
                .then(()=>resolve(elements))
            )
        })
      });
    
    return promise;
}
module.exports = {
    preview
}