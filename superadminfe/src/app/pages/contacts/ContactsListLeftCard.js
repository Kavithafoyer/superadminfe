import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import React from "react";
import { useState } from "react";
import AllContactsList from "./contacts-right-card/AllContactsList";



const ContactsListLeftCard = () => {

  const [showAllContacts, setShowAllContacts] = useState(true);
  const [notGeneratedContacts, setNotGeneratedContacts] = useState(false);
  const [generatedContacts, setGeneratedContacts] = useState(false);



  const handleClickAllContacts = () => {
    setShowAllContacts(true);
    setNotGeneratedContacts(false);
    setGeneratedContacts(false);
  };

  const handleClickNotGenerated = () => {
    setShowAllContacts(false);
    setNotGeneratedContacts(true);
    setGeneratedContacts(false);
  };

  const handleClickGenerated = () => {
    setShowAllContacts(false);
    setNotGeneratedContacts(false);
    setGeneratedContacts(true);
  };



  return (
    <>
      <JumboContentLayoutMain>
              <AllContactsList />
      </JumboContentLayoutMain>
    </>
  );
};

export default ContactsListLeftCard;
