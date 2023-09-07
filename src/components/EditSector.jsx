import { Form, Input, Switch, Button, Row, Col, Upload, Image,message, } from "antd"
import { UploadOutlined, ArrowLeftOutlined,   } from "@ant-design/icons";
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "antd/es/form/Form";
import { Global, setSectors } from "../Global";



export default function EditSectors () {
    const [form] = useForm();
    const {id} = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    var setContent = Global.setContent


    useEffect(() => {
            setContent('Nuovo Settore')
            const sector = Global.sectors.filter(s => s.id == id)
            if(id) {
                setContent('Modifica Settore: ' + sector[0].name)
                form.setFieldsValue({
                    id : sector[0].id,
                    name :sector[0].name,
                    coordinates: sector[0].coordinates,
                    enable: sector[0].enable == 0 ? false : true,
                })
            }
    },[id])

    useEffect(() => {
        if(!id){
            form.resetFields()
        }
    },[id])
    
    const onFinish = async (value) =>  {
        if(setSectors(id ? id : null,value)){
            success();
            if(id == null){
                form.setFieldsValue({
                    id : '',
                    name :'',
                    coordinates: '',
                })
            }
        }
    }

    const success = () =>{
        messageApi.open({
            type: 'success',
            content: id ? 'Dati aggiornati correttamente' : 'Settore aggiunto correttamente',
            className: 'custom-class',
            style: {
             
              marginTop: '5vh',
            },
          });
    }

    return (
        <>
        {contextHolder}
        <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
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