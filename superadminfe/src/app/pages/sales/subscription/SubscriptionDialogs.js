import React from 'react';
import { DialogContent } from '@mui/material';
import { Dragabledialog, DialogBox } from "app/pages/widgets/StylesComponents";
import CreateSubscriptionForm from "./CreateSubscriptionForm";
import EditSubscription from "./EditSubscription";
import SubscriptionInvoice from "./SubscriptionInvoice";

const CreateSubscriptionDialogs = ({
    createSubcriprion,
    setCreateSubcriprion,
    setListSubscription,
    GetSubscriptionRecords,
    editSubscription,
    setEditSubscription,
    editdatas,
    openInvoice,
    setOpenInvoice,
    organisationData,
    reportTemplateRef,
    showGenerateInvoice,
    setShowGenerateInvoice,
    generateInvoice,
}) => {
    return (
        <>
            {/* Create Subscription Dialog */}
            <Dragabledialog
                maxWidth="lg"
                open={createSubcriprion}
                title="Create Subscription"
                onClose={() => setCreateSubcriprion(false)}
            >
                <DialogContent sx={{ p: 1 }}>
                    <CreateSubscriptionForm
                        setCreateSubcriprion={setCreateSubcriprion}
                        setListSubscription={setListSubscription}
                        GetSubscriptionRecords={GetSubscriptionRecords}
                    />
                </DialogContent>
            </Dragabledialog>

            {/* Edit Subscription Dialog */}
            <Dragabledialog
                maxWidth="lg"
                open={editSubscription}
                title="Edit Subscription"
                onClose={() => setEditSubscription(false)}
            >
                <DialogContent sx={{ p: 1 }}>
                    <EditSubscription
                        setEditSubscription={setEditSubscription}
                        setListSubscription={setListSubscription}
                        editdatas={editdatas}
                        GetSubscriptionRecords={GetSubscriptionRecords}
                    />
                </DialogContent>
            </Dragabledialog>

            {/* Invoice Preview Dialog */}
            <Dragabledialog
                maxWidth="lg"
                open={openInvoice}
                title="Invoice Preview"
                onClose={() => setOpenInvoice(false)}
            >
                <SubscriptionInvoice
                    organisationData={organisationData}
                    reportTemplateRef={reportTemplateRef}
                    openInvoice={openInvoice}
                    setOpenInvoice={setOpenInvoice}
                    datas={editdatas}
                />
            </Dragabledialog>

            {/* Generate Invoice Confirmation Dialog */}
            <DialogBox
                open={showGenerateInvoice}
                Content={"Do you want to generate an invoice for this subscription?"}
                onClickYes={() => {
                    setShowGenerateInvoice(false);
                    generateInvoice(editdatas);
                }}
                onClickNo={() => setShowGenerateInvoice(false)}
            />
        </>
    );
};

export default CreateSubscriptionDialogs;
