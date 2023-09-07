import { ExclamationCircleFilled,FolderAddOutlined, EditOutlined,DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Divider,Tabs, Select, Form, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Global, getBlocks, getTombs, removeTomb } from '../Global';
import { useNavigate } from 'react-router';
import { useForm } from 'antd/es/form/Form';
import { useParams } from 'react-router';
import {ArrowLeftOutlined} from '@ant-design/icons'; 
const { Column, ColumnGroup } = Table;
var lastBlock;
var currentBlock = '';

export default function TombsList () {
    const {idBlock} = useParams();
    const [tombs, setTombs] = useState([])
    const [blocks, setBlocks] = useState([])
    const [tabsSectors, setTabsSectors] = useState([])
    const [tabsBlocks, setTabsBlocks] = useState([])
    const [tabsSelected, setTabsSelected] = useState({sector : 0, block : 0})
    const selectorBlocks = useRef();
    const navigate = useNavigate()
    const [form] = useForm()
    const { confirm } = Modal;
    const [messageApi, contextHolder] = message.useMessage();
    var setContent = Global.setContent

    const success = (msg, type) =>{
        messageApi.open({
            duration: 5,
            type: type,
            content: msg,
            className: 'custom-class',
            style: {
             
              marginTop: '1vh',
            },
          });
    }

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
                                sector : sectorName[0].name
                            })
                    setBlocks(data)
                }}
            )
    }

 async function filterTombs (id) {
    setTombs([])
    const t =  Global.allTombs.filter(t => t.block_id == id);
    setTombs(t)
 }
    

    useEffect(() => {
        setContent('Lista Tombe')
        const data = []

        blocks.forEach(b => 
            data.push({
                value: b.id,
                label: b.name,
            }))
            setTabsBlocks(data)
            selectorBlocks.current.focus()
            
    },[blocks])

    useEffect(() => {

        const tabs = []
        Global.sectors.map(s => 
            tabs.push({
                key: s.id,
                label: s.name,
            })
            
            )
            setTabsSectors(tabs)
        if(idBlock){
            const t_ = [...Global.allTombs.filter(t => t.block_id == idBlock)]
            currentBlock = [...Global.blocks.filter(t => t.id == idBlock)]
            setBlocks_(parseInt(t_[0].sector_id))
            filterTombs(idBlock) 
            return
        }
        setBlocks_(1)
        filterTombs(22)
    },[])
    

    async function deletTomb (tomb) {
        if(await removeTomb(tomb)){
           await getTombs();
            success('Tomba eliminata correttamente', 'success')
            filterTombs(lastBlock)
        }else{
            success('Errore. Tomba non eliminata. Contiene defunti', 'error')
        }
        
    }


    const showDeleteConfirm = ( tomb ) => {
        confirm({
          title: `Sicuro di elimanare la tomba:  ${tomb.reference}`,
          icon: <ExclamationCircleFilled />,
          okText: 'Yes', 
          okType: 'danger',
          cancelText: 'No',
          async onOk()  {
           deletTomb(tomb.id)
          },
          onCancel() {
            
          },
        });
      };

       
    return (
        <>
            {contextHolder}
            
            
                
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <div style={{ display:'flex', justifyContent: 'space-between', marginRight:'20px'}}>
                <ArrowLeftOutlined style={{ marginTop: 'auto', marginBottom:'auto' }} className="arrow-back" onClick={() => navigate(-1)}/>
                <Tabs style={{display: idBlock ? 'none' : '', marginRight:'30px', marginLeft: '30px', marginTop: 'auto', marginBottom:'auto'}} defaultActiveKey="1" items={tabsSectors} onChange={(e) => {setBlocks_(e); form.setFieldValue('block', null); setTombs([])}} />


          
                <Form style={{display: idBlock ? 'none' : '',marginTop: 'auto', marginBottom:'auto'}} form={form}>
                    <Form.Item  name={'block'}>
                        <Select
                        onChange={(e) => {filterTombs(e); lastBlock = e}}
                            ref={selectorBlocks}
                            style={{width:200}}
                            placeholder="Seleziona blocco"
                            options={tabsBlocks}
                        />
                    </Form.Item>
                </Form>
                </div>
            

        <Button className='addDeceased' type="primary" icon={<FolderAddOutlined />} onClick={() => navigate('/create/tomb/')}>
            Aggiungi
        </Button>
        </div>
             
                <Table dataSource={tombs} style={{marginTop: '10px'}}>
                    <ColumnGroup >
                        <Column title="#" dataIndex="id" key="id" />
                        <Column title="Riferimento Tomba" dataIndex="reference" key="reference" />
                        <Column title="ID Settore" dataIndex="sector_id" key="sector_id" />
                        <Column title="ID Blocco" dataIndex="block_id" key="block_id" />
                        <Column title="Capacità" dataIndex="capacity" key="capacity" />
                        <Column title="Occupati" dataIndex="filled" key="filled" />
                        <Column
                            title={idBlock ? "Defunti" : "Modifica / Elimina"}
                            key="action"
                            render={(text, record) => (
                                <span>
                                    <Button style={{display: idBlock ? 'none' : '' }} type='primary' ghost onClick={() => navigate(`/edit/tomb/${record.id}`)}><EditOutlined /></Button>
                                    <Divider style={{display: idBlock ? 'none' : '' }} type="vertical"/>
                                    <Button style={{display: idBlock ? 'none' : '' ,backgroundColor: 'red', color: 'white'}} type='primary' ghost onClick={(e) => showDeleteConfirm(record)}><DeleteOutlined /></Button>
                                    <Button style={{display: idBlock ? '' : 'none' }} type='primary' ghost onClick={(e) => {}}>Defunti</Button>
                                </span>
                            )}
                        />
                    </ColumnGroup>
                </Table>
        </>
    )
}