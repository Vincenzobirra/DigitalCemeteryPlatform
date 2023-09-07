import { useEffect } from "react"
import { Global, getBlocks } from "../Global"
import { useParams } from "react-router"
import { useState } from "react";
import Card from "antd/es/card/Card";
import { useNavigate } from "react-router";
import { Row, Input, List,  } from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons'; 
import ModalDeceased from './ModalDeceased';

export default function TombsListView () {
const {idBlock} = useParams();
const [tombs, setTombs] = useState(null);
const [block, setBlock] = useState(null)
const navigate = useNavigate();
const {Search} = Input;


    useEffect(() =>{
        setBlock(Global.blocks.filter(b => b.id == idBlock))
        const tombs = [...Global.allTombs];
        setTombs(tombs.filter(t => t.block_id == idBlock));
    },[])

    

    return (
        <>
        {block ? <div style={{display:'flex', justifyContent: 'center'}}><h1>Tombe del blocco {block[0].name}</h1></div> : ''}
        <div style={{display: 'flex', justifyContent:'space-between', margin:'5px'}}> 
            <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
        </div>

   {     /*<div className='viewListBlock scrollBar' style={{display: 'none', cursor: 'pointer'}}>
            <List
                itemLayout="horizontal"
                dataSource={blocks ? blocks : []}
                renderItem={(item, index) => (
                <List.Item onClick={() => navigate(`/graves/block/${item.id}`)}>
                    <List.Item.Meta
                    title={item.name + " " + item.id}
                    />
                </List.Item>
                )}
            />
                </div>*/}

        <div className='viewListBlock scrollBar' style={{display: 'none', cursor: 'pointer'}}>
            <List
                itemLayout="horizontal"
                dataSource={tombs ? tombs : []}
                renderItem={(item, index) => (
                <List.Item onClick={() => navigate(`/listbytomb/${item.id}`)}>
                    <List.Item.Meta
                    title={`Tomba: ${item.reference}`}
                    />
                </List.Item>
                )}
            />
        </div>
        
        <Row className="blockSectors" style={{justifyContent: 'space-around', overflowY:'scroll', maxHeight: '800px'}}>
            {
                tombs ?
                    tombs.map(item => 
                        <Card className='cardSector' style={{width:'20%'}} title={item.reference} bordered={false} onClick={() => {
                            navigate(`/listbytomb/${item.id}`);
                        }}>
                           
                        </Card> )
                :
                <>attendi</>
            }
        </Row>
        </>
    )
}