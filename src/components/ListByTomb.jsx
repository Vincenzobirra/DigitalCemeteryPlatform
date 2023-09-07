import { Button, Table, Divider, Input, Switch, Card, Col, Row, Modal } from 'antd';
import { useEffect, useState } from 'react';
import getDeceased, { Global, deleteDeceased, getBlocks, getGraves } from '../Global';
import { useParams } from 'react-router';
import {ArrowLeftOutlined,FolderAddOutlined,EyeOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons'; 
import { useNavigate } from 'react-router';
import ModalDeceased from './ModalDeceased';



const { Column, ColumnGroup } = Table;


export default function ListByTomb () {
    const {idTomb} = useParams()
    const [list, setList] = useState(null);
    const navigate = useNavigate();
    const [block, setBlock] = useState();
    const [sector, setSector] = useState(null);
    const [deceased, setDeceased] = useState(null)
    const [shoModal, setShowModal] = useState(false)
    const {confirm} = Modal;

    useEffect(() => {
       const dec = [...Global.graves.filter(g => g.tomb_id == idTomb)]
       setList(dec)
    },[])

    async function  infoDeceased (record, type) {
   
        const d = Global.graves.filter(d_ => d_.id == record.id);
        getBlocks(record.sector_id)
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
                   setList([...Global.graves.filter(g=> g.tomb_id == idTomb)])
                })()
                
            },
            onCancel() {
              
            },
          });
    }
    const setShow = () => {
        setShowModal(false)
    }
                        
    return(
        <div className='scrollBar'>  
             <div style={{display: 'flex', justifyContent:'space-between', margin:'5px'}}> 
            <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
        </div>
        {   
            list ?

            <Table  dataSource={list}>
                        
                        <ColumnGroup title={`Lista Defunti tomba: ${[...Global.allTombs.filter(t => t.id == idTomb)][0]['reference']}`}>
                            <Column title="#" dataIndex="id" key="id" />
                            <Column title="Nome" dataIndex="name" key="name" />
                            <Column title="Cognome" dataIndex="surname" key="surname" />
                            <Column title="Nascita" dataIndex="birthdate" key="birthdate" />
                            <Column title="Decesso" dataIndex="deathdate" key="deathdate" />
                            <Column
                                title="Modifica / Visualizza"
                                key="action"
                                render={(text, record) => (
                                    <>
                                        <div className='setButton'>
                                            <Button type='primary' ghost onClick={() => navigate(`/edit/${record.id}`)}>Modifica</Button>
                                            <Divider type="vertical"/>
                                            <Button type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => infoDeceased(record,'click')}>Visualizza</Button>
                                            <Divider type="vertical"/>
                                            <Button type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => showConfirmDeletion(record)}>Elimina</Button>
                                        </div>
                                            
                                        
                                        <div className='setButtonMobile' style={{display: 'none'}} >
                                            <div style={{padding: 5}}><Button type='primary' ghost onClick={() => navigate(`/edit/${record.id}`)}><EditOutlined /></Button></div>
                                            <div style={{padding: 5}}><Button type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => infoDeceased(record,'click')}><EyeOutlined /></Button></div>
                                            <div style={{padding: 5}}><Button style={{backgroundColor: 'red', color: 'white'}} type='primary' ghost onMouseOver={() => infoDeceased(record, 'hover')} onClick={() => showConfirmDeletion(record)}><DeleteOutlined /></Button></div>
                                        </div>
                                    </>
                                )}
                            />
                        </ColumnGroup>
                </Table>
            : <>Attendi</>
            }
            {
                    deceased && sector && block?
                        <ModalDeceased show={shoModal && deceased} setShow={setShow} deceased={deceased} sector={sector} block={block}></ModalDeceased>
                    : <></>
                }
        </div>
    )
}