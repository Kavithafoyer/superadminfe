import React, { useEffect, useState } from 'react';
import { Form } from '@formio/react';
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { Cancelbutton } from '../widgets/StylesComponents';
import Div from '@jumbo/shared/Div';
import './stylesmodule.css';


function FormEdit({ setshowformpage, setshowlistpage, setshoweditpage, prop, GetFormSTR }) {
    const [formName, setFormName] = useState(null);
    const [formId, setFormId] = useState(null);
    const [formSchema, setformSchema] = useState({})
    const [formData, setformData] = useState({})
    const [dataID, setdataID] = useState('')
    const token = localStorage.getItem("accesstoken");


    useEffect(() => {
        setdataID(prop?.id)
        setFormId(prop?.form_id)
        setFormName(prop?.form_name)
        setformData(prop?.data)
        GetFormData(prop?.form_id)

    }, [prop]);

    const GetFormData = (id) => {
        axios.get(`${BASE_URL}/user/CustomizeFormCRUD/?id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
        }).then((res) => {
            setformSchema(res?.data?.FormSTR)
        }).catch((error) => {
            console.error("Error", error)
        })
    }


    const onSubmitHandler = (submission) => {
        const payload = {
            'id': dataID,
            'form_id': formId,
            'form_name': formName,
            'data': submission?.data
        }
        axios.put(`${BASE_URL}/user/CustomizeFormSubmissionCRUD/`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
        }).then((res) => {
            toast.success("Data updated successfully", {
                position: "top-right",
                autoClose: 1000
            });
            GetFormSTR();
            setshoweditpage(false);
            setshowformpage(false);
            setshowlistpage(true);

        }).catch((error) => {
            console.error("Error", error)
        });
    };

    return (
        <>
            <Div>
                <Cancelbutton
                    onClick={() => {
                        setshowlistpage(true);
                        setshoweditpage(false);
                        GetFormSTR();
                    }}
                    label={"Back"}
                    Icon={"backIcon"}
                />
            </Div>
            <br />

            <Div className="custom-form">
                <Form form={formSchema} submission={{ data: formData }} onSubmit={onSubmitHandler} />
            </Div>
        </>

    );
}

export default FormEdit;
