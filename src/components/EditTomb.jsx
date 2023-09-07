import { Form, Input, Switch, Button, Row, Col, Upload, Image,message,Select } from "antd"
import { UploadOutlined, ArrowLeftOutlined,   } from "@ant-design/icons";
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "antd/es/form/Form";
import { Global, getBlocks, setBlock, setSectors, setTomb } from "../Global";


var once = true
export default function EditTomb () {
    const [form] = useForm();
    const {id} = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [blocks, setBlocks] = useState();
    var choicesSector = []
    var choicesBlock = []   
    var setContent = Global.setContent                
                             
   Global.sectors.forEach(s => {choicesSector.push(<Select.Option value={s.id}>{s.name}</Select.Option>)   } )
  


  const filterBlocks = async (idSector) => {
    await getBlocks(idSector);
    Global.blocks.forEach(b => {choicesBlock.push(<Select.Option value={b.id}>{b.name}</Select.Option>)})
    setBlocks(choicesBlock)
    const tomb = Global.allTombs.filter(t => t.id == id)
    if(id && once){
        form.setFieldValue('block', tomb[0].block_id)
        once = false
    }

  }


  useEffect(() => {
    setContent('Nuova Tomba')
    if(id){
        const tomb = Global.allTombs.filter(t => t.id == id)
        filterBlocks(tomb[0].sector_id)
        setContent('Modifica tomba: '+tomb[0].reference)

    }
    
  },[])



    useEffect(() => {
            const tomb = Global.allTombs.filter(t => t.id == id)
            if(id) {
                form.setFieldsValue({ 
                    id : tomb[0].id,
                    name :tomb[0].reference,
                    coordinates: tomb[0].coordinates,
                    sectorId: tomb[0].sector_id,
                    enabled: tomb[0].enable == 0 ? false : true,
                    sector: tomb[0].sector_id,
                    block: tomb[0].block_id,
                    capacity: tomb[0].capacity
                })
            }
    },[ id ])


    useEffect(() => {
        if(!id){
            form.resetFields()
        }
    },[id])


    const onFinish = async (value) =>  {

        setTomb(id ? id : null, value )
            success(await setTomb(id ? id : null, value ));
            
            
    }

    const success = (msg) =>{
        messageApi.open({
            type: msg[1],
            content: msg[0],
            className: 'custom-class',
            style: {
              marginTop: '5vh',
            },
          });
          if(msg[1] == 'success'){
            id ? navigate('/create/tomb/') : form.resetFields();
            form.resetFields();
            navigate('/create/tomb/')
          }
    }

    return (
        <>
        {contextHolder}
        <ArrowLeftOutlined className="arrow-back" onClick={() => navigate('/tombs/')}/>
        <Row style={{justifyContent: 'center'}}>
        
            <Col span={10}>
                <Form form={form} onFinish={onFinish}>
                    <Form.Item style={{display: 'none'}} name={'id'}/>

                    <Form.Item label='Nome' name={'name'} rules={[
                        {required: true,
                        message: 'Capo obbligatorio',}
                    ]}>
                        <Input placeholder="Inserisci nome"/>    
                    </Form.Item>

                    <Form.Item label='Coordinate' name={'coordinates'}>
                        <Input placeholder="Inserisci coordinate"/>    
                    </Form.Item> 

                    <Form.Item label="Settore"  name={'sector'} rules={[{required: true, message: 'Campo obblicatorio' }]}>
                        <Select onChange={(e) =>{filterBlocks(e); form.setFieldValue('block', '')}}>
                             {choicesSector}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Blocco"  name={'block'} rules={[{required: true, message: 'Campo obblicatorio' }]}>
                        <Select>
                             {blocks}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Capacità'  name={'capacity'} rules={[{required: true, message: 'Campo obbligatorio' }]}>
                        <Input type="number" suffix='N.' style={{width: 100}} placeholder="Inserisci capacità della tomba" onChange={() => {if(form.getFieldValue('capacity') < 1){
                            form.setFieldValue('capacity', 1)
                        }}}/>    
                    </Form.Item>     

                    <Form.Item name="enabled" label="Online" valuePropName="checked">
                            <Switch/>
                    </Form.Item>

                

                    <Form.Item
                        name="picture"
                        label="Upload"
                        onChange={e => {
                            

                        }}
                        extra=""
                        >
                        <Upload name="logo" action="/upload.do" listType="picture" >
                            <Button icon={<UploadOutlined />}>Aggiungi foto</Button>
                        </Upload>
                    </Form.Item>
                    <Image width={300}></Image>


                    <div>
                        <Button type="primary" htmlType="submit" >
                            Salva
                        </Button>
                        <Button style={{margin : 8}} onClick={() => navigate(-1)} >
                            Annulla
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
        </>
    )
}