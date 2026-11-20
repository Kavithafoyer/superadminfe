import React, { useEffect, useState } from 'react';
import { Form } from '@formio/react';
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { useParams } from "react-router-dom";
import Div from '@jumbo/shared/Div';
import { Cancelbutton } from '../widgets/StylesComponents';



function CFCreate({ setshowformpage, setshowlistpage, setshoweditpage, GetFormSTR }) {
  const [formSchema, setFormSchema] = useState(null);
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState(null);
  const token = localStorage.getItem("accesstoken");
  const { id } = useParams();
  const [formData, setformData] = useState('');



  const GetFormData = () => {
    axios.get(`${BASE_URL}/user/CustomizeFormCRUD/?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    }).then((res) => {
      setFormId(res?.data?.id)
      setFormName(res?.data?.FormName)
      setFormSchema(res?.data?.FormSTR)
    }).catch((error) => {
      console.error("Error", error)
    })
  }

  useEffect(() => {
    GetFormData()
  }, [id]);

  const handlebackfun = () => {
    setshowlistpage(true);
    setshowformpage(false);
    setshoweditpage(false);
    GetFormSTR();
  }

  const onSubmitHandler = (submission) => {
    const payload = {
      'form_id': formId,
      'form_name': formName,
      'data': submission?.data
    }
    axios.post(`${BASE_URL}/user/CustomizeFormSubmissionCRUD/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    }).then((res) => {
      // Clear form fields after submission
      setformData(null);
      toast.success("Data created successfully", {
        position: "top-right",
        autoClose: 1000
      });

    }).catch((error) => {
      console.error("Error", error)
    })
  };

  return (
    <>

      <Div>
        <Cancelbutton
          onClick={handlebackfun}
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

export default CFCreate;
