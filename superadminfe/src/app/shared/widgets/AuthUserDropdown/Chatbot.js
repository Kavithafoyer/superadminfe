import React, { useEffect, useState, useRef } from "react";
import useStateRef from "react-usestateref";
import Typography from "@mui/material/Typography";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import ForumIcon from "@mui/icons-material/Forum";
import CardContent from "@mui/material/CardContent";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Card from "@mui/material/Card";
import InputBase from "@mui/material/InputBase";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import Div from "@jumbo/shared/Div";

const Chatbot = () => {
  const defaulttext = [
    { type: "bot", content: "Hi, i am Luna," },
    { type: "bot", content: "what is your name?" },
  ];
  const [chatBot, setChatBot] = useState(false);
  const [text, setText] = useState("");
  const [details, setDetails] = useState({
    Name: "",
    emailid: "",
    phoneNo: "",
  });
  const [sender, setSender] = useState(false);
  const [step, setStep] = useState(0);
  const [prestep, setprestep] = useState(1);
  const [messages, setMessages, message] = useStateRef(defaulttext);
  const [typing, settyping] = useState(false);
  const [validtion, setValidtion] = useState(true);
  const chatBottomRef = useRef(null);

  const isValidName = (name) => {
    // Add your validation logic for name here
    return name.trim() !== "";
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Add your validation logic for phone number here
    return /^\d{10}$/.test(phoneNumber);
  };

  const isValidEmail = (email) => {
    // Add your validation logic for email here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handledatacheck = async () => {
    const list = [...messages];
    list.push({ type: "user", content: text });

    switch (prestep) {
      case 1:
        if (isValidName(text)) {
          list.push({
            type: "bot",
            content: "Could you please provide me with your phone ?",
          });
          setDetails({ ...details, Name: text });
          setText("");
          setprestep(prestep + 1); // Update prestep after successful validation
        } else {
          list.push({ type: "bot", content: "Please provide a valid name." });
          setText("");
        }
        break;
      case 2:
        if (isValidPhoneNumber(text)) {
          list.push({
            type: "bot",
            content: "Could you please share your email address ?",
          });
          setDetails({ ...details, phoneNo: text });
          setText("");
          setprestep(prestep + 1); // Update prestep after successful validation
        } else {
          list.push({
            type: "bot",
            content: "Please provide a valid phone number.",
          });
          setText("");
        }
        break;
      case 3:
        if (isValidEmail(text)) {
          setDetails({ ...details, emailid: text });
          await Userdata(list); // Await Userdata function call
          setValidtion(false);
        } else {
          list.push({
            type: "bot",
            content: "Please provide a valid email address.",
          });
          setText("");
        }
        break;
      default:
        break;
    }

    setMessages(list);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Assuming messages is your state containing chat messages

  // useEffect(() => {
  //     const updateMessages = async () => {
  //         const list = [...messages];
  //         list.push({ type: "user", content: text });

  //         switch (step) {
  //             case 1:
  //                 list.push({ type: "bot", content: 'Could you please provide me with your phone ?' });
  //                 setDetails({ ...details, Name: text });
  //                 setText("");
  //                 break;
  //             case 2:
  //                 list.push({ type: "bot", content: 'Could you please share your email address ?' });
  //                 setDetails({ ...details, phoneNo: text });
  //                 setText("");
  //                 break;
  //             default:
  //                 if (step === 3) {
  //                     setDetails({ ...details, emailid: text });
  //                     await Userdata(list);
  //                 } else if (step > 3) {
  //                     settyping(true);
  //                     setMessages(list);
  //                     await AI_Chatbot(list);
  //                 }
  //         }

  //         setMessages(list);
  //     };

  //     updateMessages();
  // }, [step]);

  const Userdata = async (list) => {
    try {
      const data = {
        bot_UserName: details?.Name,
        bot_MobileNumber: details?.phoneNo,
        bot_EmailId: text,
      };
      setText("");

      const response = await axios.post(
        `${BASE_URL}/useradmin/Chatbot_UserDetailsAPI/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      list.push({
        type: "bot",
        content: "Thanks for giving your details, How may i help ?",
      });
      setMessages(list);
    } catch (error) {
      console.error("Userdata error:", error);
    }
  };

  const AI_Chatbot = async () => {
    const list2 = [...messages];
    list2.push({ type: "user", content: text });
    setMessages(list2);
    settyping(true);
    try {
      let input = text;

      setText("");
      const response = await axios.get(
        `${BASE_URL}/useradmin/Chatbot_AIQuestionsAPI/?question=${input}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      settyping(false);
      list2.push({ type: "bot", content: response.data });
      setMessages(list2);
      setText(".");
      setText("");
    } catch (error) {
      console.error("AI_Chatbot error:", error);
    }
  };

  const handleClose = () => {
    setChatBot(!chatBot);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior of the Enter key
      if (validtion) {
        handledatacheck(); // Trigger your functionality here
      } else {
        AI_Chatbot();
      }
    }
  };

  return (
    <>
      {chatBot && (
        <Box
          sx={{
            bgcolor: "background.paper",
            width: 400,
            position: "absolute",
            right: 150,
            bottom: 50,
            borderRadius: "10px",
            overflowX: "auto",
            // minHeight: 200,
          }}
        >
          <Card
            variant="outlined"
            sx={{
              borderBottomRightRadius: "5px",
              borderBottomLeftRadius: "5px",
            }}
          >
            <React.Fragment>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: " 10px 10px",
                  backgroundColor: "#002e5d",
                  borderBottom: "0.1px solid #ccc",
                  justifyContent: "space-between",
                }}
              >
                <Typography style={{ fontSize: 15, color: "#fefae0" }}>
                  Luna
                </Typography>
                <IconButton
                  style={{ padding: "5px", color: "#fefae0" }}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <CardContent sx={{ height: "300px", overflowY: "auto" }}>
                <div>
                  {message?.current?.map((con, idx) => {
                    return (
                      <>
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent:
                              con?.type === "user" ? "right" : "left",
                          }}
                        >
                          <Typography
                            bgcolor={
                              con?.type == "user" ? "#164c7b" : "#f4f7f9"
                            }
                            p={1}
                            borderRadius={3}
                            sx={{
                              fontSize: 14,
                              display: "inline-flex",
                              justifySelf: "left",
                            }}
                            color={
                              con?.type === "user" ? "white" : "text.primary"
                            }
                            gutterBottom
                            align={con?.type === "user" ? "right" : "left"}
                          >
                            {con?.content}
                          </Typography>
                        </div>
                      </>
                    );
                  })}

                  {/* Conditionally render the typing message */}
                  {typing && (
                    <div style={{ display: "flex", justifyContent: "left" }}>
                      <Typography
                        bgcolor="#f4f7f9"
                        p={1}
                        borderRadius={3}
                        sx={{
                          fontSize: 14,
                          display: "inline-flex",
                          justifySelf: "left",
                        }}
                        color="text"
                        gutterBottom
                        align="left"
                      >
                        Typing...
                      </Typography>
                    </div>
                  )}
                  {/* Ref to scroll to bottom */}
                  <div ref={chatBottomRef} />
                </div>
              </CardContent>
            </React.Fragment>
          </Card>

          <Box
            // component="form"
            sx={{
              p: "1px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
              border: "1px solid lightgrey",
              borderTop: "none",
              borderRadius: "10px",
              overflowX: "auto",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, width: "85%" }}
              onChange={(e) => setText(e.target.value)}
              placeholder="text . . . "
              value={text}
              inputProps={{ "aria-label": "search google maps" }}
              onKeyDown={handleKeyDown} // Call handleKeyDown when a key is pressed
            />
            {/*                    
                            {validtion?<IconButton disabled={!Boolean(text?.trim())} onClick={() => handledatacheck()} sx={{ p: '10px', color: "#4c956c" }} aria-label="directions" >
                                <SendIcon style={{ color: '#164c7b' }} />
                            </IconButton>: */}
            <IconButton
              disabled={!Boolean(text?.trim())}
              onClick={() => AI_Chatbot()}
              sx={{ p: "10px", color: "#4c956c" }}
              aria-label="directions"
            >
              <SendIcon style={{ color: "#164c7b" }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {
        <Box
          sx={{
            bgcolor: "background.paper",
            // width: 500,
            position: "relative",
            borderRadius: "50%",
            // right: 20,
            // bottom: 30
            // minHeight: 200,
          }}
        >
          {chatBot ? (
            <Fab
              onClick={() => {
                setChatBot(!chatBot);
                setMessages(defaulttext);
                setText("");
                setDetails({ Name: "", emailid: "", phoneNo: "" });
                setStep(0);
              }}
              color="#002e5d"
              aria-label="add"
              sx={{
                width: "50px !important",
                height: "50px !important",
                borderRadius: "50% !important",
                // position: 'fixed !important',
                // bottom: '20px !important',
                // right: '20px !important'
              }}
            >
              <CloseIcon />
            </Fab>
          ) : (
            <Fab
              onClick={() => setChatBot(!chatBot)}
              color="#002e5d"
              aria-label="add"
              sx={{
                width: "50px !important",
                height: "50px !important",
                borderRadius: "50% !important",
                // position: 'fixed !important',
                // bottom: '20px !important',
                // right: '20px !important'
              }}
            >
              <ForumIcon />
            </Fab>
          )}
        </Box>
      }
    </>
  );
};

export default Chatbot;
