
import {ArrowLeftOutlined, FolderAddOutlined,EyeOutlined,EditOutlined,DeleteOutlined,UserOutlined, CaretUpOutlined,FilterOutlined, SearchOutlined} from '@ant-design/icons'; 
import { Button, Table, Avatar, Input, Switch, Card, Row, Modal, List, Pagination, Select,DatePicker, } from 'antd';
import getDeceased, { Global, getBlocks, deleteDeceased, getGraves, getTombs } from '../Global';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import ModalDeceased from './ModalDeceased';

const { Column, ColumnGroup } = Table;

var lastPagination = 10

var name = null
var surname = null
var fc = null
var sectorID = null
var blockID = null
var tombId = null
var isOnline = null
var bdFrom = null
var bdTo = null
var ddFrom = null
var ddTo = null

export default function GravesList () {
const navigate = useNavigate();
const [list, setList] = useState( Global.graves );
const [listcopy, setListcopy] = useState(Global.graves);
const [layout, setLayout] = useState(Global.layout)
const [deceased, setDeceased] = useState(null)
const [shoModal, setShowModal] = useState(false)
const {Search} = Input;
const [sector, setSector] = useState(null);
const [block, setBlock] = useState(null);
const {confirm} = Modal;
const setContent = Global.setContent
const [refresh, setRefresh] = useState(false)
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const [filterShow, setFilter] = useState(false)

const selectorBlocks = useRef();
const selectorSelector = useRef();
const [blocks, setBlocks] = useState([])
const [tabsBlocks, setTabsBlocks] = useState([])
const [tabsTombs, setTabTombs] = useState([])
const [tabsSelected, setTabsSelected] = useState({sector : 0, block : 0})
const [tabsSectors, setTabsSectors] = useState([])
const [valBlock, setValBlock] = useState([])
const [valSector, setValSector] = useState([])
const [valTomb, setValTomb] = useState([])

const keyBlocks = 'test'



useEffect(()=>{
    setContent('Lista Defunti')
    
},[])

useEffect(() => {
    setContent('Lista Tombe')
    const data = []

    blocks.forEach(b => 
        data.push({
            value: b.id,
            label: b.name,
        }))
        setTabsBlocks(data)
        //selectorBlocks.current.focus()
        
},[blocks])

useEffect(() => {

    const tabs = []
    Global.sectors.map(s => 
        tabs.push({
            value: s.id,
            id: s.id,
            label: s.name,
            
        })
        
        )
        setTabsSectors(tabs)
    //setBlocks_(1)
    //filterTombs(22)
},[])

async function setBlocks_ (id) {
    setTabsSelected({sector : id})
    await getBlocks(id)
    setBlocks([])
const data = []
Global.blocks.forEach(b => 
        {   
            if(b.sector_id.toString() == id.toString()){
            const sectorName = Global.sectors.filter(s => s.id == b.sector_id )
            data.push({
                        key : b.id,
                        id : b.id,
                        name : b.name,
                        //sector : sectorName[0].name
                    })
            setBlocks(data)
        }}
    )
}

function setTabsTombs ( idBlock ){
    //getTombs(sectorID, blockID)
    var tabs = []
    JSON.parse( localStorage.getItem('tombs') ).map( ( t ) => {
        if(t.block_id == idBlock) tabs.push({value : t.id, id: t.it, label: t.reference});
        
   })
   setTabTombs(tabs)
}

async function showConfirmDeletion(record) {
    
    confirm({
        title: `Attenzione! Sicuro di eliminare il defunto?`,
        content: `Id: ${record.id} - Nome: ${record.name} - Cognome: ${record.surname}`,
        okText: 'Elimina',
        okType: 'danger',
        cancelText: 'Annulla',
        onOk() {
            (async () => {
               await deleteDeceased(record.id)
               await getGraves()
               setList(Global.graves)
            })()
            
        },
        onCancel() {
          
        },
      });
}

const setShow = () => {
    setShowModal(false)
}

async function  infoDeceased (record, type) {
   
    const d = Global.graves.filter(d_ => d_.id == record.id);
    getBlocks( record.sector_id )
    const s = [...Global.sectors.filter(s => s.id == record.sector_id)][0]
    const b = [...Global.blocks.filter(b => b.id == record.block_id)][0]
    
     if( d &&  s &&  b && type == 'click'){
        
        setSector(s)
        setBlock(b)
        setDeceased(d[0])
        setShowModal(true)
        getDeceased()
    }
}

/*const n = (e.name+' '+e.surname).toLowerCase();
        const t = text.split(" ")
        if( t.every(i => n.includes(i))){
            return true
        }*/

function filter (text)  {
    setListcopy(Global.graves)
    const copy = [...Global.graves];
    const filter = copy.filter(e => 
            e.name.trim().toLowerCase().includes(text.trim().toLowerCase()) 
        ||
            e.name.trim().toLowerCase().includes(text.trim().toLowerCase()) 
        ||
            (e.name + ' ' + e.surname).trim().toLowerCase().includes(text.trim().toLowerCase()) 
    );
    setList(filter)
}

function setLay (checked) {
    setLayout(checked)
    Global.layout = checked

}

const onShowSizeChange = async (current, pageSize) => {
    lastPagination = pageSize ?? lastPagination
    await getGraves( blockID, sectorID, tombId ,null ,name ,surname ,fc ,bdFrom ,bdTo ,ddFrom ,ddTo, current -1, lastPagination )
    setList(Global.graves)
  };

  function getDate(dd){
    var date = new Date(dd)
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
  }
   return ( 
    <div >
{    /*
        <div style={{display: 'flex', justifyContent:'space-between', margin:'5px'}}>

            <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
            <div className='buttonViewListDeceaseds'> <span>Lista</span><Switch defaultChecked={Global.layout} onChange={setLay} style={{margin: '10px'}}></Switch><span>Blocchi</span></div>
            <div className='buttonViewListDeceasedsMobile'style={{display: 'none'}}><Switch defaultChecked={Global.layout} onChange={setLay} style={{margin: '10px'}}></Switch></div>
        </div>
        */}
        <div className={ filterShow ? 'open' : 'close'} style={{ display: 'flex', position:'relative', zIndex: '100', flexDirection:'',justifyContent: 'center', marginBottom: '', width: '100%' , height:'15vh', }}>
            
            <div className='containerFilter' style={{ display:'flex', flexDirection: 'column', height: '100%',margin:'15px'}}>
                <div style={{height: '', margin: '5px', textAlign:'center'}}> Anagrafiche</div>
                <Input
                    placeholder="Nome"
                    onSearch={ value => console.log(value) }
                    style={{ width: 'auto', display: Global.layout ? 'none' : '', margin: 'auto'}}
                    onChange={(e) => {name = e.target.value;}}
                />
                <Input
                    placeholder="Cognome"
                    style={{ width: 'auto', display: Global.layout ? 'none' : '' , margin: 'auto'}}
                    onChange={(e) => {surname = e.target.value;}}
                />
                <Input
                    placeholder="Cod.Fiscale"
                    style={{ width: 'auto', display: Global.layout ? 'none' : '' , margin: 'auto'}}
                    onChange={(e) => {fc = e.target.value;}}
                />
            </div>

            <div className='containerFilter' style={{ display:'flex', flexDirection: 'column', height: '100%', margin:'15px'}}>
                <div style={{height: '', margin: '5px', textAlign:'center'}}> Ubicazione </div>
                <Select
                    onChange={(e) => {setValBlock([]);setValTomb([]); tombId=null; blockID = null; setBlocks_(parseInt(e)); sectorID = e; setValSector(e)  }}
                    ref={selectorSelector}
                    value={valSector}
                    style={{width:'200px', margin: 'auto'}}
                    placeholder="Settore"
                    options={tabsSectors}
                />
                <Select
                    onChange={async (e) => { blockID = e ; await setValBlock(e); setValTomb(null); tombId = null ; setTabsTombs(e)}}
                    value={valBlock}
                    defaultValue={null}
                    ref={selectorBlocks}
                    style={{width:'200px', margin: 'auto'}}
                    placeholder="Blocco"
                    options={tabsBlocks}
                />
                <Select
                    onChange={(e) => { setValTomb(e); tombId = e}}
                    value={valTomb}
                    style={{width:'200px', margin: 'auto'}}
                    placeholder="Tomba"
                    options={tabsTombs}
                />
            </div>

            <div className='containerFilter' style={{ display:'flex', flexDirection: 'column', height: '100%',margin:'15px'}}>
                <div style={{ display:'flex', flexDirection:'column', padding: '5px', justifyContent:'center'}}>
                    <div style={{height: '40%', margin: '5px', textAlign:'center'}}> Cerca per data di nascita</div>
                    <div>
                        <DatePicker 
                            placeholder='Inizio' 
                            format={dateFormatList} 
                            style={{height: 'auto', margin: '5px'}}
                            onChange={e => { e == null ? bdFrom = false : bdFrom = getDate(e.$d);}}
                        />
                        <DatePicker 
                            placeholder='Fine' 
                            format={dateFormatList} 
                            style={{height: 'auto', margin: '5px'}}
                            onChange={e => { e == null ? bdTo = false : bdTo = getDate(e.$d);}}
                        />
                    </div>
                
                </div>
                <div style={{ display:'flex', flexDirection:'column', padding: '5px'}}>
                    <div style={{height: '40%', margin: '5px',textAlign:'center'}}> Cerca per data di decesso</div>
                    <div>
                        <DatePicker 
                            placeholder='Inizio' 
                            format={dateFormatList} 
                            style={{height: 'auto', margin: '5px'}}
                            onChange={e => { e == null ? ddFrom = false : ddFrom = getDate(e.$d);}}
                        />
                        <DatePicker 
                            placeholder='Fine' 
                            format={dateFormatList} 
                            style={{height: 'auto', margin: '5px'}}
                            onChange={e => { e == null ? ddTo = false : ddTo = getDate(e.$d);}}
                        />
                    </div>
                </div>
            </div>

            <div className='containerFilter' style={{ display:'flex', flexDirection: 'column', height: '100%',margin:'15px'}}>
                <Select
                    onChange={(e) => {  }}
                    //ref={}
                    style={{width:'100%', margin: 'auto'}}
                    placeholder="Online"
                    options={[]}
                />
               
                    <Button style={{ margin: 'auto'}} className={'addDeceased'} type="primary" icon={<SearchOutlined />} 
                        onClick={ async () => {
                        await getGraves( blockID, sectorID, tombId ,null ,name ,surname ,fc ,bdFrom ,bdTo ,ddFrom ,ddTo, 0, lastPagination )
                            setList(Global.graves)
                        }}>
                            Cerca con filtri
                    </Button>
                
                
                    <Button style={{margin: 'auto', backgroundColor:'grey', width:'100%'}} className={'addDeceased'} type="primary" icon={<SearchOutlined />} 
                        onClick={ async () => {
                            name = null
                            surname = null
                            fc = null
                            sectorID = null
                            blockID = null
                            tombId = null
                            isOnline = null
                            bdFrom = null 
                            bdTo = null
                            ddFrom = null
                            ddTo = null
                            setValBlock([])
                            setValSector([])
                            setValTomb([])
                            setTabsBlocks([])
                            setTabsTombs([])
                            await getGraves( blockID, sectorID, tombId ,null ,name ,surname ,fc ,bdFrom ,bdTo ,ddFrom ,ddTo, 0, lastPagination )
                            setList(Global.graves)
                        }}>
                            Reset
                    </Button>
               
            </div>
            
        </div>
      
        
        <div style={{display:'flex', width: '100%', justifyContent: 'space-between', marginTop: '30px',marginBottom: '10px'}}>
        <div style={{display: 'flex', justifyContent:''}}>
            
            <Button style={{marginLeft:'20px'}} className='addDeceased' type="primary" icon={<FolderAddOutlined />} onClick={() => navigate('/addDeceased/')}>
                Aggiungi
            </Button>
            </div>
            
        
        <div style={{display:'flex'}}>
            
            <div  onClick={() => {
                setFilter(!filterShow)
            }} style={{display:'flex', width: 'auto', justifyContent: 'center', marginLeft: '20px', textAlign:'center',}}>
                <FilterOutlined  style={{ fontSize: '20px', cursor:'pointer'}}/>
                <CaretUpOutlined style={{ fontSize: '30px', cursor:'pointer', transform: !filterShow ? 'rotate(3.142rad)' : ''}}/> 
        </div>
            <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={ Global.pages }
                onChange={ ( e ) => {
                   if( window.event.target.tagName == 'DIV') return
                    onShowSizeChange(e , )
                }}
               
            />
        </div>
            
        </div>
        
        {
            
            //layout == false ?
            <div>

                
                <div className=''> 
                <Table
                    showHeader={true}
                    style={{ background: 'white'}} dataSource={list}
                    pagination={false}
                    onRow={( record ) => ({
                        onClick: (e) => {
                            if(e.target.tagName != 'TD') return; 
                            navigate(`/edit/${record.id}`); 
                        }
                    })}
                    rowClassName={ 'tableRow'}
                    scroll={{ y: `calc(100vh - 250px)` }}
                >
                    
                    <ColumnGroup >
                        <Column title="#" dataIndex="id" key="id" />
                        <Column title="   " dataIndex="avatar" key="avatar" render={ (text, record) => (
                            <>
                               <Avatar size={64} icon={<UserOutlined />} src={ record.picture ?? 'https://i.pravatar.cc'} />
                            </>
                        )}/>
                        <Column title="Nome" dataIndex="name" key="name" />
                        <Column title="Cognome" dataIndex="surname" key="surname" />
                        <Column title="Nascita" dataIndex="birthdate" key="birthdate" />
                        <Column title="Decesso" dataIndex="deathdate" key="deathdate" />
                        <Column title="Settore" dataIndex="sector_name" key="sector_name" />
                        <Column title="Blocco" dataIndex="block_name" key="block_name" />
                        <Column title="Tomba" dataIndex="tomb" key="tomb" />
                        <Column
                            title="Modifica / Anteprima / Elimina"
                            key="action"
                            render={(text, record) => (
                                <>
                                    <div className='setButton' style={{ display:'flex', zIndex: '1000!important'}}>
                                        <div style={{padding: 5}}><Button type='primary' ghost onClick={() => {
                                            navigate(`/edit/${record.id}`)
                                            }}><EditOutlined /></Button></div>
                                        <div style={{padding: 5}}><Button type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => infoDeceased(record,'click')}><EyeOutlined /></Button></div>
                                        <div style={{padding: 5}}><Button style={{backgroundColor: 'red', color: 'white', zIndex: '1000'}} type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => showConfirmDeletion(record)}><DeleteOutlined /></Button></div>
                                    </div>
                                        
                                    
                                    <div className='setButtonMobile ' style={{display: 'none', zIndex: '1000'}} >
                                        <div style={{padding: 5}}><Button type='primary' ghost onClick={() => navigate(`/edit/${record.id}`)}><EditOutlined /></Button></div>
                                        <div style={{padding: 5}}><Button type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => infoDeceased(record,'click')}><EyeOutlined /></Button></div>
                                        <div style={{padding: 5}}><Button style={{backgroundColor: 'red', color: 'white'}} type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => showConfirmDeletion(record)}><DeleteOutlined /></Button></div>
                                    </div>
                                </>
                            )}
                        />
                    </ColumnGroup>
                </Table>
            </div>
            </div>
            /*
            :
            <>
                <Row className='viewBlock' style={{justifyContent: 'space-between'}}>
                    {
                        Global.sectors.map(s => 
                            <Card className='cardSector' key={s.id} title={s.name} bordered={false} onClick={() => navigate(`/graves/sector/${s.id}`)}>
                            </Card> )
                    }
                </Row>
                <List
                    className='viewListBlock'
                    style={{display: 'none', cursor: 'pointer'}}
                    itemLayout="horizontal"
                    dataSource={Global.sectors}
                    renderItem={(item, index) => (
                    <List.Item onClick={() => navigate(`/graves/sector/${item.id}`)}>
                        <List.Item.Meta
                        title={item.name}
                        />
                    </List.Item>
               )}
               />
            </>
            */
        }
         {
                    deceased && sector && block?
                        <ModalDeceased show={shoModal && deceased} setShow={setShow} deceased={deceased} sector={sector} block={block}></ModalDeceased>
                    : <></>
                }
    </div>
    )
}