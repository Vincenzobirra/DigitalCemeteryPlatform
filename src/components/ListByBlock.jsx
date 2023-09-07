import { Button, Table, Divider, Input, Switch, Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Global, getGraves } from '../Global';
import { useParams } from 'react-router';
import {ArrowLeftOutlined} from '@ant-design/icons'; 
import { useNavigate } from 'react-router';


const { Column, ColumnGroup } = Table;


export default function ListByBlock () {
    const {id} = useParams()
    const [list, setList] = useState(null);
    const navigate = useNavigate();
    const {Search} = Input;
    const [block, setBlock] = useState();

    useEffect(() => {
        (async () => {
            await getGraves(id);
            setList(Global.current_graves)
            const copy = JSON.parse( JSON.stringify(Global.blocks) );
            setBlock( copy.filter(b => b.id == id)[0] );
            
        })();
    },[])

                        
    return(
        <div className='scrollBar'>  
                {block ? <div style={{display:'flex' ,justifyContent:'center'}}><h2>Blocco: { block.name }</h2></div> : ''}
             <div style={{display: 'flex', justifyContent:'space-between', margin:'5px'}}> 
            <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
            <Search
                placeholder="Cerca defunto"
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
                onChange={(e) => {}} //filter(e.target.value)
            />
            </div>
        {   
            list ?

            <Table  dataSource={list}>
                        
                        <ColumnGroup title="Lista Defunti">
                            <Column title="#" dataIndex="id" key="id" />
                            <Column title="Nome" dataIndex="name" key="name" />
                            <Column title="Cognome" dataIndex="surname" key="surname" />
                            <Column title="Nascita" dataIndex="birthdate" key="birthdate" />
                            <Column title="Decesso" dataIndex="deathdate" key="deathdate" />
                            <Column
                                title="Modifica / Visualizza"
                                key="action"
                                render={(text, record) => (
                                    <span>
                                    <Button type='primary' ghost>Modifica</Button>
                                    <Divider type="vertical"/>
                                    <Button type='primary' ghost>Visualizza</Button>
                                    </span>
                                )}
                            />
                        </ColumnGroup>
                </Table>
            : <>Attendi</>
            }
        </div>
    )
}