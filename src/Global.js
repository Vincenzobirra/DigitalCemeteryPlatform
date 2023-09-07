export const Global = {
        log : [],
        cemetery : [],
        graves : [],
        current_graves: [],
        current_graves_list : [],
        sectors : [],
        blocks: [],
        current_blocks: [],
        layout: false,
        current_deceased: [],
        current_graveyard: [],
        tombs: [],
        allTombs: [],
        current_tombs: [],
        entombments : [],
        setContent : null,
        pages : 0
}

export async function setTomb (id = null, tomb) {
    console.log(tomb)
    const headers = new Headers;
    const raw = {
        
        "user_token":"28e6019d2e933f4c2175d355c41a962a=",
        "cemetery_token":"caiazzo",
        "data" : {
            "reference" : tomb.name,
            "block_id" : tomb.block,
            "sector_id" : tomb.sector,
            "capacity" : tomb.capacity,
            "coordinates" : tomb.coordinates,
            "enabled" : tomb.enable,
        }
    }

    if(id){
        raw.tomb_id = id           
    }

    var requestOptions = {
        method : 'POST',
        headers: headers,
        body: JSON.stringify(raw) ,
        redirect: 'follow'
    }
    
    try{
        const response = await fetch("https://webservice.cimiterodigitale.it/tomb_set", requestOptions);
            if(response && response.status == 200){
                const json = await response.json();
                console.log(json)
             if ( json.response == 'ok' ) {
                    await getTombs()
                    return  [`Perfetto`, 'success']
                } else if (json.response == 'ko'){
                    return [`Attenzione: La tomba contiene ${json.reasons[0].filled} defunti.`, 'error']
                }else {
                    return [`Verifica errore`, 'error']
                }
            }
    }catch(e){console.log(e)}

} 

export async function removeSector (id) {
    const headers = new Headers;
    const raw = {
        
			"user_token":"28e6019d2e933f4c2175d355c41a962a=",
			"cemetery_token":"caiazzo",
			"sector_id":id
    }

    var requestOptions = {
        method : 'POST',
        headers: headers,
        body: JSON.stringify(raw) ,
        redirect: 'follow'
    }

    try{
        const response = await fetch( "https://webservice.cimiterodigitale.it/sector_remove", requestOptions );
            if(response && response.status == 200){
                const json = await response.json();
                if(json.reasons == "blocks_in_sector"){
                    return false
                }else if (json.response == 'ok') {
                    return true
                }
            }
    }catch(e){console.log(e)}
}

export async function setSectors (id = null, sector) {
    
    const myHeaders = new Headers;

    const raw = {
             "user_token":"b745826033de8ae35910d52836b27ba2=",
             "cemetery_token":"caiazzo",
             "data" : {
                        "name": sector.name,
                        "coordinates": sector.coordinates,
                        "enable": sector.enable
             }
         }

         if(id){
            raw.sector_id = id;
         }
         
 
         var requestOptions = {
             method : 'POST',
             headers: myHeaders,
             body: JSON.stringify(raw) ,
             redirect: 'follow'
         }
         try{
             const response = await fetch("https://webservice.cimiterodigitale.it/sector_set", requestOptions);
                 if(response && response.status == 200){
                     const json = await response.json();
                     getSectors();
                     return true;
                 }
         }catch(e){console.log(e)}
}

export async function removeTomb (id){
    
    const headers = new Headers;

    const raw = {

			"user_token":"b745826033de8ae35910d52836b27ba2=",
			"cemetery_token":"caiazzo",
			"tomb_id":id
		}
    
        var requestOptions = {
            method : 'POST',
            headers: headers,
            body: JSON.stringify(raw) ,
            redirect: 'follow'
        }

        var response = await fetch('https://webservice.cimiterodigitale.it/tomb_remove', requestOptions);

        try{
            if(response && response.status == 200){
                const json = await response.json();
                if(json.response == 'ok'){
                    await getTombs()
                return true
                } else{
                    return false
                }
            }
        }catch(e){console.log(e)}
}



export async function removeBlock (id){
    const headers = new Headers;

    const raw = {

			"user_token":"b745826033de8ae35910d52836b27ba2=",
			"cemetery_token":"caiazzo",
			"block_id":id
		}
    
        var requestOptions = {
            method : 'POST',
            headers: headers,
            body: JSON.stringify(raw) ,
            redirect: 'follow'
        }

        var response = await fetch('https://webservice.cimiterodigitale.it/block_remove', requestOptions);

        try{

            if(response && response.status == 200){
                const json = await response.json();
                if(json.reasons == 'tombs_in_block'){
                    return false
                }

                return true
            }



        }catch(e){console.log(e)}
}

export async function setBlock (blockId = null, block) {
    
    const myHeaders = new Headers;
    const raw = {
             "user_token":"b745826033de8ae35910d52836b27ba2=",
             "cemetery_token":"caiazzo",
             "data" : {
                        "name": block.name,
                        "coordinates": block.coordinates,
                        "enable": block.enable,
                        "sector_id": block.sector
             }
         }

         if(blockId){
            raw.block_id = blockId;
         }
         
 
         var requestOptions = {
             method : 'POST',
             headers: myHeaders,
             body: JSON.stringify(raw) ,
             redirect: 'follow'
         }
         try{
             const response = await fetch("https://webservice.cimiterodigitale.it/block_set", requestOptions);
                 if(response && response.status == 200){
                     const json = await response.json();
                     return true;
                 }
         }catch(e){console.log(e)}
}



export async function setDeceased (values, picture, id) {
   
    var myHeaders = new Headers();

    const payload =
        {
            "user_token":"b745826033de8ae35910d52836b27ba2=",
            "cemetery_token":"caiazzo",
            "data": {
                //"id" : id ? id : null,
                "sector_id": values.sector,
                "block_id": values.block,
                "tomb_id": values.tomb,
                "entombment_id": values.entombment,
                "name": values.name,
                "surname": values.surname,
                "nominative_search": values.name+' '+values.surname,
                "birthdate": values.birthdate.$y+'-'+(values.birthdate.$M+1)+'-'+values.birthdate.$D, 
                "deathdate": values.deathdate.$y+'-'+(values.deathdate.$M+1)+'-'+values.deathdate.$D,
                "enabled" : values.enabled == false ? 0 : 1,
                "epitaph" : values.epitaph,
                "fiscal_code" : values.fiscalCode
            }
        };

    if(values.id){
        payload.deceased_id = values.id;
    }

    var raw = JSON.stringify(payload);

    var requestOptions = {
        method : 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    try{

        const response = await fetch("https://webservice.cimiterodigitale.it/deceased_set_dev", requestOptions);
        if(response && response.status == 200){
            console.log(response)
            const result = await response.json()
            if(result.response == 'ok' && result.results){
                if(result.results.length && result.results.includes('Impossibile')){
                    return (['defunto presente nel database', 'warning' ])
                }else if(result.response == 'ok' && values.id){
                    if(picture){
                        const result = await setPicture(picture, values.id, Global.log.user_token)
                        if(result.response == 'ok'){ 
                            return ['Defunto aggiornato correttamente', 'success' ]    
                        } 
                        return ['Defunto aggiornato. Errore foto', 'warning' ] 
                    }else{ 
                        return ['Defunto aggiornato correttamente', 'success']
                    }
                }else if(result.response == 'ok' && result.results > 0 && picture){
                    const resultPhoto = await setPicture(picture, result.results, Global.log.user_token)
                        if(resultPhoto.response == 'ok'){ 
                            return ['Defunto inserito correttamente', 'success']
                        } 
                        return ['Defunto inserito correttamente. Errore foto', 'warning'] 
                }else { 
                    return ['Utente caricato correttamente. Senza Foto', 'success'] 
                } 
            }else if ( result.response == 'ko' && result.reasons == 'tomb_capacity_exceeded'){ 
                    return ['Attenzione: La tomba di destinazione è piena', 'error']
                 } else { 
                    return ['verifica', 'error']
                 }
        }

    }catch(e){console.log(e)}
}

export async function deleteDeceased(id) {
    var myHeaders = new Headers();
    
    var raw = JSON.stringify({
			"user_token":"b745826033de8ae35910d52836b27ba2=",
			"cemetery_token":"caiazzo",
			"deceased_id": id
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      try{
        const response = await fetch('https://webservice.cimiterodigitale.it/deceased_remove', requestOptions);
        if(response && response.status == 200){
            const json = await response.json();
            if(json.response == 'ok'){
                return true
            } else { return false}
        }
      }catch(e){console.log(e)}
}

async function setPicture(e, id, userToken){

    if(e.target.files.length > 0){
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("deceased_picture", file);
        formData.append("deceased_id", id);
        formData.append("user_token", userToken);
        formData.append("cemetery_token", "caiazzo");

        const response =
            await fetch(
                'https://webservice.cimiterodigitale.it/deceased_set_picture.php',
                {
                    method: "POST",
                    body: formData
                }
            );

        if(response && response.status == 200){
            console.log(response);
            const txt = await response.json();
            return txt
        }

    }else{
        alert("Mancano file");
    }

}

export async function getEntombments () {
    
    var myHeaders = new Headers();
    
    var raw = JSON.stringify({
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
try{
    const response = await fetch('https://webservice.cimiterodigitale.it/entombments_get')
    if(response && response.status == 200){
        const entombments = await response.json()
        if(entombments.response == 'ok'){
            Global.entombments = entombments.results;
        }
    }}catch(e){console.log(e)}
}

export  default async function getDeceased (id) {

    var myHeaders = new Headers();
    
    var raw = JSON.stringify({
        "cemetery_token":"caiazzo",
		"user_token":"28e6019d2e933f4c2175d355c41a962a=",
		"deceased_id":id
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      try{
        const response = await fetch("https://webservice.cimiterodigitale.it/deceased_get", requestOptions)
        if(response && response.status == 200){
          const dec = await response.json()
          if(dec.response == 'ok'){
              Global.current_deceased = dec.results 
          }
        }
      }catch(e){console.log(e)}
}


export async function getTombs (sector, block) {
    var myHeaders = new Headers();
    
    var raw = {
        "cemetery_token":"caiazzo",
        "user_token":"b745826033de8ae35910d52836b27ba2=",
        "pagination": "0",
        "take": "10000000",
    };

    if(sector && block){
        raw.sector_id = sector
        raw.block_id = block
    }
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
      };
      
      try{
      const response = await fetch("https://webservice.cimiterodigitale.it/tombs_get", requestOptions)
      if(response && response.status == 200){
        const tombs = await response.json()
        if(tombs.response == 'ok'){

            if(sector && block){
                Global.tombs = tombs.results
                localStorage.setItem('tombs', JSON.stringify(tombs.results))
            }else{
                Global.allTombs = tombs.results
                localStorage.setItem('tombs', JSON.stringify(tombs.results))
            }
        }
      }
    }catch(e){console.log(e)}
}


export async function getBlocks (sector) {
    var myHeaders = new Headers();
    
    const r = {
        "cemetery_token": "caiazzo",
        "user_token": "b745826033de8ae35910d52836b27ba2=",
        "pagination": 0,
        "take": 1000000000000,
        "order_by": "name",
        "order_type": "desc"
    };

      if(sector){
        r.sector_id = sector
      }
    const raw = JSON.stringify(r)  
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      try{
      const response = await fetch("https://webservice.cimiterodigitale.it/blocks_get", requestOptions)
      if(response && response.status == 200){
        const blocks = await response.json()
        if(blocks.response == 'ok'){
            Global.blocks = blocks.results
            if(!sector){
                localStorage.setItem('block', JSON.stringify(blocks.results))
              }
            
           
        }
      }
    }catch(e){console.log(e)}
}

export async function getSectors () {
    var myHeaders = new Headers();

    var raw = JSON.stringify({
    "cemetery_token": "caiazzo",
    "user_token": "28e6019d2e933f4c2175d355c41a962a="
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
try{
    const response = await fetch("https://webservice.cimiterodigitale.it/sectors_get", requestOptions);
   
    if(response && response.status == 200){
        const sectors = await response.json();
        if(sectors.response == 'ok'){
            localStorage.setItem('sectors', JSON.stringify(sectors.results))
            Global.sectors = sectors.results
        }
    }
}catch(_){console.log(_)}
 
}

 function getSectorName( d ){
    var n = ''
    JSON.parse( localStorage.getItem('sectors')).map( s => {
        
        if(s.id == d.sector_id) {
            n = s.name
            
        }
       })
       return n
}

function getBlockName( d ){
    var n = ''
    JSON.parse( localStorage.getItem('block')).map( s => {
        
        if(s.id == d.block_id) {
            n = s.name
            
        }
       })
       return n
}

export function logOut () {
    localStorage.removeItem('token');
    localStorage.removeItem('cemetery')
    localStorage.removeItem('graves')
    localStorage.removeItem('block')
    localStorage.removeItem('tombs')
}


export async function getGraves( block, sector, tomb, isEnabled, name, surname, fiscalCode, birthdateFrom, birthdateTo, deathFrom, deathTo, page, take ) {

    try{
        
                var raw = {
                    "cemetery_token": "caiazzo",
                    "user_token": "b745826033de8ae35910d52836b27ba2=",
                    "pagination": page ?? '0',
                    "take": take ?? "10",
                    //"sector_id": 2,  //FACOLTATIVO
                    //"block_id": "",  //FACOLTATIVO
                    //"tomb_id": "",  //FACOLTATIVO
                    //"deceased_id": "",  //FACOLTATIVO
                    //"order_by":"name",  //FACOLTATIVO
                    //"order_type":"desc",  //FACOLTATIVO
                    //"enabled": 1,  //FACOLTATIVO
                    //"name":"",  //FACOLTATIVO
                    //"surname":"",  //FACOLTATIVO
                    //"fiscal_code":"",  //FACOLTATIVO
                    //"birthdate_from":"",  //FACOLTATIVO
                    //"birthdate_to":"",  //FACOLTATIVO
                    //"deathdate_from":"", //FACOLTATIVO
                    //"deathdate_to":"",  //FACOLTATIVO
                    //"picture":'',  //FACOLTATIVO
                    //"search":""  //FACOLTATIVO
            };
            sector         ? raw.sector_id       = sector : console.log('')
            block          ? raw.block_id        = block  : console.log('')
            tomb           ? raw.tomb_id         = tomb : console.log('')
            name           ? raw.name            = name : console.log('')
            surname        ? raw.surname         = surname : console.log('')
            fiscalCode     ? raw.fiscal_code     = fiscalCode : console.log('')
            birthdateFrom  ? raw.birthdate_from  = birthdateFrom : console.log('')
            birthdateTo    ? raw.birthdate_to    = birthdateTo : console.log('')
            deathFrom      ? raw.deathdate_from  = deathFrom : console.log('')
            deathTo        ? raw.deathdate_to    = deathTo : console.log('')
            if( isEnabled != null ){
                isEnabled = true//= true ? raw.enable = true : raw.enable = false
            }

            isEnabled   ? raw.tomb_id  = tomb : console.log('')
        var requestOptions = {
        method: 'POST',
        body: JSON.stringify(raw),
        redirect: 'follow'
        };

        const response = await fetch("https://webservice.cimiterodigitale.it/deceaseds_get", requestOptions)
        if( response && response.status == 200 ){
            const json = await response.json();
            if( json.response == 'ok' ){
                    console.log(JSON.stringify(raw))
                    console.log(json)
                    json.results.map(  ( d )  => {
                        var det = d.deathdate ? d.deathdate.split('-') : ['000','00','00']
                        var bir = d.birthdate ? d.birthdate.split('-') : ['000','00','00']
                        d.sector_name = getSectorName( d );
                        d.block_name = getBlockName( d );
                        d.deathdate = `${det[2]}-${det[1]}-${det[0]}`
                        d.birthdate = `${bir[2]}-${bir[1]}-${bir[0]}`
                        
                    })
                    Global.graves = json.results
                    Global.pages =  json.results_total_rows 
                    console.log( Global.recordsTotalPagination ) 
                    Global.current_graves = json.results
                    localStorage.setItem("graves", await JSON.stringify(json.results))
              
            }
        }
    }catch(e){ console.log(e) }

}

export async function login ( email, password ) {

    try{
        var myHeaders = new Headers();

        var raw = JSON.stringify({
            "email": email,                      //vincenzo.birra@cmh.it
            "password": password,               //VinBirr01
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://webservice.cimiterodigitale.it/login", requestOptions);
        if(response && response.status == 200){
            const json = await response.json();
            if(json.response == "ok"){
                localStorage.setItem("token", json.results.user_token);
                Global.log = json.results;
                return true;      
            }
        }

    }catch(_){}



    return false;
}

// CIMITERO
export async function getCemetery () {

    try{
        var myHeaders = new Headers();

        var raw = JSON.stringify({
            "cemetery_token": "caiazzo",
            "user_token": "28e6019d2e933f4c2175d355c41a962a="
          });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://webservice.cimiterodigitale.it/cemetery_get", requestOptions);
        if(response && response.status == 200){
            const json = await response.json();
            if(json.response == "ok"){
                localStorage.setItem("cemetery", JSON.stringify(json.results) );
                Global.cemetery = json.results;
                return true;      
            }
        }

    }catch(_){}



    return false;
}


export async function setCemetery (cemetery, file) {

  const myHeaders = new Headers;

   const raw = {
            "user_token":"b745826033de8ae35910d52836b27ba2=",
            "cemetery_token":"caiazzo",
            "data" : {
                    "name": cemetery.name,
                    "address": cemetery.address,
                    "color": cemetery.color,
                    "coordinates": cemetery.coordinates,
                    "link1":cemetery.link1,
                    "link1_label": 'Link 1',
                    "link2": cemetery.link2,
                    "link2_label": 'Link 2',
                    "link3": cemetery.link3,
                    "link3_label":'Link 3'
            }
        }

        var requestOptions = {
            method : 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw) ,
            redirect: 'follow'
        }
        try{
            const response = await fetch("https://webservice.cimiterodigitale.it/cemetery_set", requestOptions);
                if(response && response.status == 200){
                    const json = await response.json();
                    await getCemetery();
                    await setLogoGraveyard(file, Global.log.user_token)
                    return true;
                }
        }catch(e){console.log(e)}
            

}

async function setLogoGraveyard(e, userToken){

    if(e.target.files.length > 0){
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("cemetery_logo", file);
        formData.append("user_token", userToken);
        formData.append("cemetery_token", "caiazzo");

        const response =
            await fetch(
                'https://webservice.cimiterodigitale.it/cemetery_set_picture.php',
                {
                    method: "POST",
                    body: formData
                }
            );

        if(response && response.status == 200){
            console.log(response);
            const txt = await response.json();
            return txt
        }

    }else{
        alert("Mancano file");
    }

}
