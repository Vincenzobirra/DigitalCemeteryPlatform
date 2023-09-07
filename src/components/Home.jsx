import {  HomeOutlined, AppstoreOutlined, TeamOutlined, DatabaseOutlined,CloseCircleFilled,EditOutlined, PlusCircleOutlined, UnorderedListOutlined, EyeOutlined, CloudOutlined,LogoutOutlined  } from '@ant-design/icons';
import { Layout, Menu, theme, Button, Typography, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {Global, getBlocks, getCemetery, getEntombments, getGraves, getSectors, getTombs, logOut, removeSector} from '../Global';
import { useNavigate } from 'react-router';
import { ReactComponent as Logo} from '../logo-white.svg'
import { readFile } from 'xlsx';


const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export default function Home ({children}) {
    const [content, setContent] = useState(''); 
    const [loader, showLoader] = useState(false); 
    const navigate = useNavigate();
    var blocchi = []
    Global.setContent = setContent

 async function Blocks () {
        var myHeaders = new Headers();
        
        const r = {
            "cemetery_token": "caiazzo",
            "user_token": "b745826033de8ae35910d52836b27ba2=",
            "pagination": 0,
            "take": 100,
            "order_by": "name",
            "order_type": "desc",
            "sector_id" : 3
        };
    
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
               blocchi = blocks.results
               console.log(blocchi)
               
            }
          }
        }catch(e){console.log(e)}
    }
useEffect(() => {
    
},[])

async function  importCsv () {

    var files = document.querySelector('#file').files;

    if(files.length > 0 ){

         var file = files[0];
         var reader = new FileReader();
         reader.readAsText(file);
         reader.onload = function(event) {
            var arrayCoordinate = []
              var csvdata = event.target.result;
              var rowData = csvdata.split('\n');

              for (var row = 1; row < rowData.length; row++) {
                   var r = rowData[ row ].split(';');
                   r[6] && r[6].length > 0 ? arrayCoordinate.push(r) : console.log('')
              }
              Blocks();
              console.log(arrayCoordinate)
         };

    }else{
         alert("Please select a file.");
    }

}

useEffect(() => {
    
    (async () =>{
        await getTombs()
        showLoader(true)
        await getBlocks()
        await getEntombments()
        await getCemetery()
        await getGraves()
        await getSectors()
        showLoader(false)
        Global.current_graveyard = [  ...Global.cemetery.filter(c => c.token == Global.log.cemetery_token)] 
    })()
       
},[])




    function getContent (key) {

        switch(key){
            case 'cemetery':
                navigate('/cemeterylist')
                
                break;
            case 'graves':
                navigate(`/graves/${Global.current_graveyard[0].id}`)
                
                break;
            case 'users':
                navigate(``)
                break;
            case 'gravelard':
              {  navigate('/gravelard');
              console.log(Global.current_graveyard)
                    setContent('Cimitero di: '+Global.current_graveyard[0].name)
              }

                break;
            case 'modGravelard':
                navigate(`/updategraveyard/${Global.current_graveyard[0].id}`)
                break;
            case 'addDeceased':
                navigate(`/addDeceased/`)
                break;
            case 'sectors':
                navigate(`/sectors/`)
                break;
            case 'addSectors':
                navigate(`/create/sector/`)
                break;
            case 'blocks':
                navigate(`/blocks/`)
                break;
                case 'addBlock':
                navigate(`/create/block/`)
                break;
            case 'tombs':
                navigate(`/tombs/`)
                break;
                case 'addTomb':
                    navigate(`/create/tomb/`)
                    break;
        }
                 
    };


    const menuItems = [

        Global.log.role == 'superadmin'? 
        {
            key: 'cemetery',
            icon: React.createElement(HomeOutlined),
            label: 'Cimiteri',
        }: '',
        Global.log.role == 'admin' && Global.current_graveyard[0] ? 
        {
            key: 'gravelard',
            icon: React.createElement(HomeOutlined),
            label: 'Cimitero',
         /*   children: [{
                key: 'gravelard',
                icon: React.createElement(EyeOutlined),
                label: Global.current_graveyard[0].name
            },
            {
                key: 'modGravelard',
                icon: React.createElement(EditOutlined),
                label: 'Modifica'
            }]
            */
        }: '',
        {
            key: 'graves',
            icon: React.createElement(CloudOutlined),
            label: 'Defunti',
           /*  children: [
                {
                    key: 'graves',
                    icon: React.createElement(UnorderedListOutlined),
                    label: 'Elenco'
                },
                {
                key: 'addDeceased',
                icon: React.createElement(PlusCircleOutlined),
                label: 'Agg. defunto'
                },
            ]
            */
        },
        {
            key: 'sectors',
            icon: React.createElement(AppstoreOutlined),
            label: 'Settori',
            /* children: [ 
                {
                    key: 'sectors',
                    icon: React.createElement(UnorderedListOutlined),
                    label: 'Settori'
                },
                {
                    key: 'addSectors',
                    icon: React.createElement(PlusCircleOutlined),
                    label: 'Agg. settore'
                },
                {
                    key: 'blocks',
                    icon: React.createElement(UnorderedListOutlined),
                    label: 'Blocchi'
                },
                {
                    key: 'addBlock',
                    icon: React.createElement(PlusCircleOutlined),
                    label: 'Agg. blocco'
                },
                {
                    key: 'tombs',
                    icon: React.createElement(UnorderedListOutlined),
                    label: 'Tombe'
                },
                {
                    key: 'addTomb',
                    icon: React.createElement(PlusCircleOutlined),
                    label: 'Agg. tomba'
                },
            ]
        */

        },
        {
            key: 'blocks',
            icon: React.createElement(DatabaseOutlined),
            label: 'Blocchi'
        },
        {
            key: 'tombs',
            icon: React.createElement(UnorderedListOutlined),
            label: 'Tombe'
        },
        {
            key: 'users',
            icon: React.createElement(TeamOutlined),
            label: 'Utenti',
        },
        

        
    ]
 
    const { 
        token: { colorBgContainer },
      } = theme.useToken();
    

      return (
        
        <Layout id='layout'>
            
            <Sider
                style={{backgroundColor: '#003B95'}}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                }}
                onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
                }}>
                    
                    <div style={{padding: '10px'}} ><Logo style={{padding:'5px',}}/></div>
                    <div style={{color: 'white', paddingLeft: '5px', paddingBottom: '10px'}}>
                        <Button className='logOutButton' onClick={() => 
                            {
                                logOut()
                                navigate("/")
                            }
                            
                            } size={'small'} type="primary" danger>
                                {<LogoutOutlined /> }{Global.log.name} Esci
                        </Button>
                     
                     { 
                     /*  
                     <Button className='logOutButton' onClick={() => 
                            {
                                
                                importCsv()
                            }
                            } size={'small'} type="primary" danger>
                                {<LogoutOutlined /> } Importa
                        </Button>
                        <input type="file" name="file" id="file" accept=".csv" ></input>
                        
                    
                    */
                   
                }
                </div>
                    <Button className='logOutButtonMobile' style={{display: 'none'}} onClick={() => 
                            {
                                logOut()
                                navigate("/")
                            }}
                            size={'small'} 
                            type="primary" 
                            danger> Esci 
                    </Button>
                    <Menu
                    style={{backgroundColor: '#003B95', color: 'white'}}
                        //theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['4']}
                        items={menuItems}
                        onClick={(e) => getContent(e.key)}
                        >
                    </Menu>
                    
            </Sider>
                            
            <Layout>
            {
                <Header style={{ padding: 0, background: '#e7f6ff', textAlign:'center' }}> <Title level={2}> { content } </Title> </Header>
            }
            
            <Content style={{padding: '50px', margin: '24px 16px 0', backgroundColor: '#e7f6ff', overflow:'unset' }}>
            
                 <div >
                    { children }
                 </div>
                    
            </Content>
               {//<Footer style={{ textAlign: 'center' }}>©<Button onClick={() => {console.log(Global)}}>log Global</Button> <button onClick={() => removeSector(11)}>test</button> 2023 Created CMH</Footer>
               }
            </Layout>
            {
                loader ?
                    <div className='loaderContainer'><Spin className='loader' size="large" /></div>
                :
                    <></>
            } 
        </Layout>
      );

}