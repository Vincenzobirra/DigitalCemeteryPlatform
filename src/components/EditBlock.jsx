import { Form, Input, Switch, Button, Row, Col, Upload, Image,message,Select } from "antd"
import { UploadOutlined, ArrowLeftOutlined,   } from "@ant-design/icons";
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "antd/es/form/Form";
import { Global, setBlock, setSectors } from "../Global";



export default function EditBlock () {
    const [form] = useForm();
    const {id} = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    var choices = []
    var setContent = Global.setContent                         
                             
   Global.sectors.forEach(s => {choices.push(<Select.Option value={s.id}>{s.name}</Select.Option>)   } )
    
    useEffect(() => {
        setContent('Nuovo blocco')
            const block = Global.blocks.filter(b => b.id == id)
            if(id) {
                setContent('Modifica blocco: '+block[0].name)
                form.setFieldsValue({
                    id : block[0].id,
                    name :block[0].name,
                    coordinates: block[0].coordinates,
                    sectorId: block[0].sector_id,
                    enabled: block[0].enable == 0 ? false : true,
                    sector: block[0].sector_id
                })
            }
    },[id])

    useEffect(() => {
        if(!id){
            form.resetFields()
        }
    },[id])
    const onFinish = async (value) =>  {

        if(setBlock(id ? id : null, value)){
            success();
            if(id == null) {
                form.setFieldsValue({
                    id : '',
                    name :'',
                    coordinates: '',
                    sectorId: '',
                    enabled: false,
                    sector: ''
                })
            }
        }
        
    }

    const success = () =>{
        messageApi.open({
            type: 'success',
            content: id ? 'Dati aggiornati correttamente' : 'Blocco aggiunto correttamente',
            className: 'custom-class',
            style: {
             
              marginTop: '5vh',
            },
          });
    }

    return (
        <>
        {contextHolder}
        <ArrowLeftOutlined className="arrow-back" onClick={() => navigate('/blocks/')}/>
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
                        <Select>
                             {choices}
                        </Select>
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
                    <Image width={300}>IMMAGINE</Image>



                    <Button type="primary" htmlType="submit" >
                        Salva
                    </Button>
                    <Button style={{margin : 8}} onClick={() => navigate(-1)} >
                        Annulla
                    </Button>
                </Form>
            </Col>
        </Row>
        </>
    )
}