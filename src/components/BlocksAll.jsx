import { ExclamationCircleFilled, FolderAddOutlined,DeleteOutlined,EditOutlined  } from '@ant-design/icons';
import { Button, Input, Space, Table, Divider,Tabs,  message,  Modal  } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Global, getBlocks, removeBlock } from '../Global';
import { useNavigate } from 'react-router';

const { Column, ColumnGroup } = Table;

var sID_ = ''
export default function BlocksAll () {
    const [blocks, setBlocks] = useState([])
    const [tabsSectors, setTabsSectors] = useState([])
    const navigate = useNavigate()
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


    const showDeleteConfirm =  (block) => {
        var bl = Global.blocks.filter(b => b.id == block.id);
            sID_ = bl[0].sector_id;
        confirm({
          title: `Sicuro di elimanare il blocco:  ${block.name}`,
          icon: <ExclamationCircleFilled />,
          okText: 'Yes', 
          okType: 'danger',
          cancelText: 'No',
          async onOk()  {
           remove(block)
          },
          onCancel() {
            
          },
        });
      };

      async function remove(block) {
      
       if( await removeBlock(block.id)){
        success('Blocco eliminato correttamente', 'success')
       }else{
          success('Impossibile Eliminare. Il blocco contiene delle tombe', 'error')
       };
       
       setBlocks_(sID_);
      
      }

    async function setBlocks_ (id) {
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

    useEffect(() => {
        setContent('Lista Blocchi')
        const tabs = []
        Global.sectors.map(s => 
            tabs.push({
                key: s.id,
                label: s.name,
            })
            
            )
            setTabsSectors(tabs)

        setBlocks_(sID_ == '' ? 1 : sID_)
    },[])
    
       
    return (
        <>
        {contextHolder}
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
        <Tabs  items={tabsSectors}   onChange={(e) =>  { setBlocks_(e); }} />
        <Button className='addDeceased' type="primary" icon={<FolderAddOutlined />} onClick={() => navigate('/create/block/')}>
            Aggiungi
        </Button>
        </div>
            <Table dataSource={blocks}>
                
                <ColumnGroup>
                    <Column title="#" dataIndex="id" key="id" />
                    <Column title="Nome Blocco" dataIndex="name" key="name" />
                    <Column title="Settore" dataIndex="sector" key="sector" />
                    <Column
                        title="Modifica / Elimina"
                        key="action"
                        render={(text, record) => (
                            <span>
                                <Button type='primary' ghost onClick={() => navigate(`/edit/block/${record.id}`)}><EditOutlined /></Button>
                                <Divider type="vertical"/>
                                <Button type='primary' ghost style={{backgroundColor: 'red', color: 'white'}} onClick={() => showDeleteConfirm(record)}><DeleteOutlined /></Button>
                            </span>
                        )}
                    />
                </ColumnGroup>
        </Table>
        </>
    )
}