const fetch = require('node-fetch')
const Promises = require('bluebird');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const apiKey = "AIzaSyBuun6zzW5zaCpRP53FhcOseSh4iVWqoQU";

const getRows = async (link)=>{
    const ID = link.split('/')[5]

    const doc = new GoogleSpreadsheet(ID);

    await doc.useApiKey(apiKey);

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]; // the first sheet

    return await sheet.getRows();
}

const preview = async (link)=>{
    const rows = await getRows(link);
    
    let elements = [];
    
    let promise = new Promise((resolve, reject)=> {
        return(
                Promises.map(rows,(row)=>{
                    const {tag,value} = row;
                    if(tag==='image'){
                        elements= [...elements,`<img class='row' src=${value} />`]
                    }
                    if(tag==='title'){
                    elements= [...elements,`<h1 class='row' >${value}</h1>`]
                    }
                    if(tag==='youtube'){
                        const id = value.split("v=")[1].substring(0, 11)
                        elements= [...elements,`<iframe width="750" height="420" src=${'https://www.youtube.com/embed/'+id} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`]
                    }
                    if(tag==='twitter'){
                        return(new Promise((resolve,reject)=>{
                            fetch(`https://publish.twitter.com/oembed?url=${encodeURI(value)}`)
                            .then((res)=>res.json())
                            .then((res)=>{
                                resolve(elements= [...elements,res.html])
                            })
                        }))
                    }
                    if(tag==='instagram'){
                        return(new Promise((resolve,reject)=>{
                            fetch(`https://api.instagram.com/oembed?url=${value}`)
                            .then((res)=>res.json())
                            .then((res)=>{
                                resolve(elements= [...elements,res.html])
                            })
                        }))
                    }
                    if(tag==='map'){
                        const [lat,lng] = value.split(',');
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
                    if(tag==='card'){
                        return(new Promise((resolve,reject)=>{
                            getRows(value)
                            .then((res)=>{
                                let cards = `<div class="card" style="width: 18rem;">
                                            ${res.map(ele =>{
                                                const [tag,value] = ele["_rawData"];
                                                return(
                                                    `${tag==="image"?`<img src=${value} class="card-img-top" alt="...">`:''}
                                                    <div class="card-body">
                                                        ${tag==="title"?`<h5 class="card-title">${value}</h5>`:''}
                                                        ${tag==="description"?`<p class="card-text">${value}</p>`:''}
                                                    </div>`
                                                )
                                            })}
                                        </div>`;
                                resolve(elements= [...elements,`<div class="card-deck">${cards}</div>`])
                            })
                        }))
                    }
                    if(tag==='table'){
                        return(new Promise((resolve,reject)=>{
                            getRows(value)
                            .then((res)=>{
                                let table;
                                let keys;
                                res.map((key)=>keys!==undefined?keys+=`<th scope="col">${key[0]}</th>`:keys=`<th scope="col">${key[0]}</th>`)
                                const head = `<thead><tr>${keys}</tr></thead>`
                                res.map((elem)=>{                                    
                                        const columns = elem["_rawData"]
                                        let column = [];
                                        columns.map((col=>column!==undefined?column +=`<td>${col}</td>`:column = `<td>${col}</td>`))
                                        table!==undefined?table +=`<tr>${column}</tr>`:table = `<tr>${column}</tr>`
                                })
                                resolve(elements= [...elements,'<table class="table table-bordered table-hover"><tbody>'+table+' </tbody></table>'])
                            })
                        }))
                    }
                })
                .then(()=>resolve(elements.join(',').replace(/>,/g,'>')))
            )
      });
    
    return promise;
}
module.exports = {
    preview
}