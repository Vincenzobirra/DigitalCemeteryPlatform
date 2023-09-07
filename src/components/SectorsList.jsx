import { ExclamationCircleFilled,FolderAddOutlined,  EditOutlined,DeleteOutlined  } from '@ant-design/icons';
import { Button, Input, Space, Table, Divider, message,  Modal} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Global, getSectors, removeSector } from '../Global';
import { useNavigate } from 'react-router';

const { Column, ColumnGroup } = Table;

export default function SectorsList () {
    const [sectors, setSectors] = useState([])
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const { confirm } = Modal;
    var data = []
    var setContent = Global.setContent
    
    const showDeleteConfirm = (sector) => {
        confirm({
          title: `Sicuro di elimanare : ${sector.name}`,
          icon: <ExclamationCircleFilled />,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            remove(sector.id)
          },
          onCancel() {
            
          },
        });
      };
    

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

    useEffect(() => {
        setContent('Lista Settori')
        Global.sectors.forEach(s => 
            data.push({
                        key : s.id,
                        id : s.id,
                        name : s.name,
                    })
                    )
        setSectors(data)
    },[])

    useEffect(() => {
        data = [];
        Global.sectors.forEach(s => 
            data.push({
                        key : s.id, 
                        id : s.id,
                        name : s.name,
                    })
                    )
        setSectors(data)
    },[refresh])  
    
    async function remove(id) {
        if(await removeSector(id)){
            success('Settore Eliminato correttamente', 'success');
           await  getSectors();
            setRefresh(refresh ? false : true);
        }else{success('Impossibile eliminare il settore. Contiene dei blocchi', 'error');}
    }
       
    return (
        <>
        {contextHolder}
        <div style={{ display:'flex', justifyContent:'end', marginBottom:'10px'}}>
        <Button className='addDeceased' type="primary" icon={<FolderAddOutlined />} onClick={() => navigate('/create/sector/')}>
                Aggiungi
            </Button>
        </div>
   
            <Table dataSource={sectors}>
                
                <ColumnGroup>
                    <Column title="#" dataIndex="id" key="id" />
                    <Column title="Nome" dataIndex="name" key="name" />
                    <Column
                        title="Modifica / Elimina"
                        key="action"
                        render={(text, record) => (
                            <span>
                                <Button type='primary' ghost onClick={() => navigate(`/edit/sector/${record.key}`)}><EditOutlined /></Button>
                                <Divider type="vertical"/>
                               
                                <Button type='primary'  style={{backgroundColor: 'red', color: 'white'}}ghost onClick={() => showDeleteConfirm(record)}><DeleteOutlined /></Button>
                                
                            </span>
                        )}
                    />
                </ColumnGroup>
        </Table>
        </>
    )
}